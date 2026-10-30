const test = require("node:test");
const assert = require("node:assert/strict");
const { parseAmount, normalizeManualLedger, resolveEntry, summarizeLedgers } = require("../src/usage-ledgers");

test("amounts accept separators and Chinese/English magnitude suffixes", () => {
  assert.equal(parseAmount("1,200,000"), 1200000);
  assert.equal(parseAmount("3.5M"), 3500000);
  assert.equal(parseAmount("12万"), 120000);
  assert.equal(parseAmount("2亿"), 200000000);
  for (const bad of ["-5", "abc", "1e9", "", "5%"]) assert.equal(parseAmount(bad), null, bad);
});

test("manual entries reject invalid rows and keep unknown cache distinct from zero", () => {
  const ledger = normalizeManualLedger({ entries: [
    { provider: "DeepSeek", model: "v4", mode: "exact", inputTokens: "1M", outputTokens: "200k" },
    { provider: "Zero", model: "z", mode: "exact", inputTokens: "1M", cachedInputTokens: 0, outputTokens: 1 },
    { provider: "", model: "missing-provider", inputTokens: 10 },
    { provider: "X", model: "empty", mode: "estimate", totalTokens: 0 },
    { provider: "X", model: "y", inputTokens: 5, outputTokens: 1, inputPrice: "-1" }
  ] });
  assert.equal(ledger.entries.length, 3);
  assert.equal(ledger.entries[0].cachedInputTokens, null);
  assert.equal(ledger.entries[1].cachedInputTokens, 0);
  assert.equal(ledger.entries[2].inputPrice, null);
  assert.equal(new Set(ledger.entries.map(entry => entry.id)).size, 3);
});

test("estimated entries split by shared ratios; blank cache price is charged at input rate", () => {
  const [entry] = normalizeManualLedger({ entries: [{ provider: "P", model: "m", mode: "estimate",
    totalTokens: "10M", inputPrice: 2, outputPrice: 8 }] }).entries;
  const resolved = resolveEntry(entry, { inputShare: 80, cacheHitRate: 50 });
  assert.deepEqual([resolved.inputTokens, resolved.cachedInputTokens, resolved.outputTokens], [8e6, 4e6, 2e6]);
  assert.equal(resolved.estimatedCostUsd, 32); // 4M*2 + 4M*2 + 2M*8, cache not free
  assert.ok(resolved.cachedPriceAssumed);
  const unpriced = resolveEntry({ ...entry, outputPrice: null }, {});
  assert.equal(unpriced.priced, false);
  assert.equal(unpriced.estimatedCostUsd, null);
});

test("official view prices account Tokens at the native blended rate; combined view adds manual usage", () => {
  const cost = { available: true, estimatedCostUsd: 12, models: [
    { model: "gpt-x", inputTokens: 900000, cachedInputTokens: 800000, outputTokens: 100000, priced: true, estimatedCostUsd: 10, pricing: { vendor: "OpenAI" } },
    { model: "deepseek", inputTokens: 500000, cachedInputTokens: 0, outputTokens: 0, priced: true, estimatedCostUsd: 2, pricing: { vendor: "DeepSeek" } }
  ] };
  const manual = { entries: [{ provider: "Kimi", model: "k2", mode: "exact", inputTokens: 1000000, cachedInputTokens: 0,
    outputTokens: 0, inputPrice: 1, outputPrice: 4 }] };
  const result = summarizeLedgers({ scope: "account", lifetimeTokens: 3000000, totalWorkDays: 3 }, cost, manual);
  assert.equal(result.official.ratePerMillion, 10);
  assert.equal(result.official.costUsd, 30);
  assert.equal(result.official.dailyCostUsd, 10);
  assert.equal(result.combined.tokens, 4000000);
  assert.equal(result.combined.costUsd, 31);
  assert.equal(result.composition[0].label, "gpt-x");
  const noManual = summarizeLedgers({ scope: "account", lifetimeTokens: 3000000, totalWorkDays: 3 }, cost, {});
  assert.equal(noManual.combined.tokens, noManual.official.tokens);
  assert.equal(noManual.combined.costUsd, noManual.official.costUsd);
  const unpriced = summarizeLedgers({ scope: "account", lifetimeTokens: 3000000 }, cost,
    { entries: [{ provider: "Custom", model: "custom name", inputTokens: 10, outputTokens: 2 }] });
  assert.equal(unpriced.combined.tokens, 3000012);
  assert.equal(unpriced.combined.costUsd, unpriced.official.costUsd);
  assert.equal(unpriced.combined.partial, true);
  const missing = summarizeLedgers({ scope: "account", lifetimeTokens: 5 }, { available: false }, {});
  assert.equal(missing.official.costUsd, null);
  assert.equal(missing.combined.costUsd, null);
});

test("model composition allocates the account base and merges same-model manual rows without changing totals", () => {
  const result = summarizeLedgers({ scope: "account", lifetimeTokens: 3000000 }, { available: true, models: [
    { model: "gpt-a", inputTokens: 700000, outputTokens: 100000, priced: true, estimatedCostUsd: 7, pricing: { vendor: "OpenAI" } },
    { model: "gpt-b", inputTokens: 100000, outputTokens: 100000, priced: true, estimatedCostUsd: 3, pricing: { vendor: "OpenAI" } }
  ] }, { entries: [{ provider: "Custom", model: "GPT-A", inputTokens: 1000000, outputTokens: 0, cachedInputTokens: 0, inputPrice: 2, outputPrice: 4 }] });
  assert.equal(result.combined.costUsd, 32); assert.equal(result.combined.tokens, 4000000);
  assert.equal(result.composition.length, 2); assert.equal(result.composition[0].label, "gpt-a");
  assert.equal(result.composition[0].costUsd, 23); assert.equal(result.composition[0].tokens, 3400000);
  assert.equal(result.composition.reduce((sum, row) => sum + row.costUsd, 0), result.combined.costUsd);
  assert.equal(result.composition.reduce((sum, row) => sum + row.tokens, 0), result.combined.tokens);
});

test("the three user-confirmed TokenRouter routes join third-party totals once without changing the account base", () => {
  const usage = { scope: "account", lifetimeTokens: 3000000, totalWorkDays: 3 };
  const native = { model: "gpt-native", inputTokens: 900000, outputTokens: 100000, priced: true, estimatedCostUsd: 10, pricing: { vendor: "OpenAI" } };
  const router = [
    { model: "z-ai/glm-5.3-free", inputTokens: 191948741, cachedInputTokens: 171665024, outputTokens: 944989, estimatedCostUsd: 77.188061, priced: true, accountCalibrated: true, pricing: { vendor: "Z.AI" } },
    { model: "qwen/qwen3.8-max-free", inputTokens: 161805066, cachedInputTokens: 157975872, outputTokens: 896434, estimatedCostUsd: 43.299444, priced: true, pricing: { vendor: "Qwen" } },
    { model: "glm-5.3-flash", inputTokens: 467609524, cachedInputTokens: 418979840, outputTokens: 1146172, estimatedCostUsd: 20.436933, priced: true, pricing: { vendor: "Z.AI" } }
  ];
  const cost = { available: true, models: [native, ...router] }, before = JSON.stringify(cost);
  const baseline = summarizeLedgers(usage, { available: true, models: [native] }, {});
  const result = summarizeLedgers(usage, cost, {});
  assert.deepEqual(result.official, baseline.official);
  assert.equal(result.combined.thirdParty.tokens, 824350926); // cache is already part of input
  assert.equal(result.combined.thirdParty.costUsd, 140.924438);
  assert.equal(result.combined.thirdParty.count, 3);
  assert.equal(result.combined.manual.count, 0);
  assert.equal(result.entries.length, 0); // never manufacture a manual copy
  assert.equal(result.combined.tokens, baseline.official.tokens + 824350926);
  assert.equal(result.combined.costUsd, 170.924438);
  assert.deepEqual(result.observed.map(entry => entry.provider), ["TokenRouter", "TokenRouter", "TokenRouter"]);
  assert.deepEqual(result.composition.filter(row => row.group === "TokenRouter").map(row => row.costUsd).sort((a, b) => a - b), [20.436933, 43.299444, 77.188061]);
  assert.deepEqual(summarizeLedgers(usage, cost, {}), result);
  assert.equal(JSON.stringify(cost), before);
  assert.equal(result.composition.reduce((sum, row) => sum + row.tokens, 0), result.combined.tokens);
});

test("TokenRouter attribution stays exact and keeps manual additions and unknown prices distinct", () => {
  const { observedProvider } = require("../src/usage-ledgers");
  assert.equal(observedProvider("glm-5.3-flash"), "TokenRouter");
  for (const name of ["glm-5.3", "qwen3.8-max", "unrelated/glm-5.3-flash", "gpt-native"]) assert.equal(observedProvider(name), null);
  const manual = { entries: [{ provider: "TokenRouter", model: "qwen/qwen3.8-max-free", inputTokens: 20, cachedInputTokens: 0, outputTokens: 2, inputPrice: 2, outputPrice: 8 }] };
  const before = JSON.stringify(manual);
  const result = summarizeLedgers({ scope: "account", lifetimeTokens: 1000 }, { available: true, models: [
    { model: "gpt-native", inputTokens: 1000, outputTokens: 0, priced: true, estimatedCostUsd: 1, pricing: { vendor: "OpenAI" } },
    { model: "qwen/qwen3.8-max-free", inputTokens: 100, cachedInputTokens: 80, outputTokens: 10, priced: false },
    { model: "other-qwen", inputTokens: 999999, outputTokens: 999999, priced: true, estimatedCostUsd: 50, pricing: { vendor: "Qwen" } }
  ] }, manual);
  assert.equal(result.observed.length, 1);
  assert.equal(result.combined.thirdParty.tokens, 132);
  assert.equal(result.combined.thirdParty.costUsd, .000056);
  assert.equal(result.combined.thirdParty.unpriced, 1);
  assert.equal(result.combined.thirdParty.count, 1);
  assert.equal(result.combined.manual.tokens, 22);
  const model = result.composition.find(row => row.label === "qwen/qwen3.8-max-free");
  assert.equal(model.tokens, 132);
  assert.equal(model.group, "TokenRouter");
  assert.ok(model.partial);
  assert.equal(JSON.stringify(manual), before);
});

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
  assert.equal(result.combined.tokens, 2500000);
  assert.equal(result.combined.costUsd, 13);
  assert.equal(result.composition[0].label, "gpt-x");
  const missing = summarizeLedgers({ scope: "account", lifetimeTokens: 5 }, { available: false }, {});
  assert.equal(missing.official.costUsd, null);
  assert.equal(missing.combined.costUsd, null);
});

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { calculateUsageCost, summarizeRolloutLines, normalizeCodexCostUsageResult, CodexCostUsageReader } = require("../src/codex-cost-usage");
const { ADDITIONAL_MODEL_PRICING, effectivePricing } = require("../src/model-pricing-catalog");

function record(model, usage, cumulative = usage) {
  return [JSON.stringify({ type: "turn_context", payload: { model } }),
    JSON.stringify({ type: "token_usage_record", timestamp: "2026-10-28T01:00:00Z", payload: { usage, thread_token_usage: cumulative } })];
}

test("official Claude generations and routed/date aliases keep their own published rates", () => {
  const usage = { inputTokens: 100000, cachedInputTokens: 10000, outputTokens: 1000 };
  const cases = [["claude-sonnet-5-5", .191], ["router/anthropic/claude-sonnet-5.5-20260928-thinking", .191],
    ["gateway-claude-sonnet-5-5", .191],
    ["claude-opus-5-5", .382], ["claude-opus-5-5-fast", .764], ["claude-opus-4-6", .48],
    ["claude-sonnet-4-5-20250929", .288], ["claude-haiku-5-5", .0096], ["claude-fable-5-1", .9525]];
  for (const [model, expected] of cases) assert.ok(Math.abs(calculateUsageCost(model, usage).cost - expected) < 1e-12, model);
  for (const model of ["claude-sonnet-5-50", "claude-sonnet-9", "claude-sonnet-5-5-image", "claude-sonnet-5-5-fast"]) {
    assert.equal(calculateUsageCost(model, usage), null, model);
  }
});

test("Claude cache reads, 5m writes and explicit 1h writes are separate input classes", () => {
  const usage = { input_tokens: 20000, cache_read_input_tokens: 60000, cache_creation_input_tokens: 20000,
    cache_creation: { ephemeral_1h_input_tokens: 10000 }, output_tokens: 1000 };
  const cost = calculateUsageCost("claude-sonnet-5-5", usage);
  assert.equal(cost.cost, .121);
  const summary = summarizeRolloutLines([{ lines: record("claude-sonnet-5-5", usage) }]);
  assert.equal(summary.models[0].inputTokens, 100000);
  assert.equal(summary.models[0].cacheWriteLongInputTokens, 10000);
  assert.equal(summary.estimatedCostUsd, .121);
  assert.equal(calculateUsageCost("gpt-4.1", { inputTokens: 100, cacheWriteInputTokens: 50, cacheWriteLongInputTokens: 50 }), null);
});

test("per-call threshold boundaries differ between Haiku, OpenAI, Gemini and Grok", () => {
  const price = (model, input) => calculateUsageCost(model, { inputTokens: input, outputTokens: 100 });
  assert.equal(price("claude-haiku-5-5", 100000).isLongContext, false);
  assert.equal(price("claude-haiku-5-5", 100001).isLongContext, true);
  assert.equal(price("claude-sonnet-5-5", 900000).isLongContext, false);
  assert.equal(price("gpt-6.1-terra", 272000).isLongContext, false);
  assert.equal(price("gpt-6.1-terra", 272001).isLongContext, true);
  assert.equal(price("gemini-3.1-pro-preview", 200001).isLongContext, true);
  assert.equal(price("grok-4.7", 199999).isLongContext, false);
  assert.equal(price("grok-4.7", 200000).isLongContext, true);
  assert.equal(price("minimax-m3", 512001).isLongContext, true);
});

test("mixed short/long calls preserve numeric pricing weights through an incremental cold restart", async t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "quota-pricing-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const file = path.join(root, "rollout-price.jsonl"), model = "claude-haiku-5-5";
  const firstUsage = { input_tokens: 99000, output_tokens: 1000 };
  const nextUsage = { input_tokens: 100001, output_tokens: 1000 };
  fs.writeFileSync(file, record(model, firstUsage).join("\n") + "\n");
  const options = { sessionsRoot: root, cacheMs: 0 };
  const first = await new CodexCostUsageReader(options).read(1000);
  fs.appendFileSync(file, record(model, nextUsage, { input_tokens: 199001, output_tokens: 2000 })[1] + "\n");
  const updated = await new CodexCostUsageReader(options).read(1001, first);
  assert.equal(updated.models[0].inputTokens, 199001);
  assert.equal(updated.models[0].requestCount, 2);
  assert.equal(updated.estimatedCostUsd, .062901);
  const cold = normalizeCodexCostUsageResult(null, { tokenCostSnapshot: updated });
  assert.equal(cold.estimatedCostUsd, .062901);
  assert.equal(cold.models[0].longContextRequests, 1);
  const unchanged = await new CodexCostUsageReader(options).read(1002, updated);
  assert.equal(unchanged.scanProgress.bytesRead, 0);
});

test("new flat Claude prices revalue stored Tokens without a source rescan or generation reset", () => {
  const model = { model: "claude-sonnet-5-5", inputTokens: 1000000, cachedInputTokens: 800000,
    outputTokens: 10000, requestCount: 20, estimatedCostUsd: null, priced: false };
  const result = normalizeCodexCostUsageResult({ scanned: true, schemaVersion: 7, usageAdapterVersion: 2,
    ledgerGeneration: 123, models: [model], dailyUsage: [{date:"2026-10-28",models:[model]}], observedAt: 1000 });
  assert.equal(result.models[0].inputTokens, 1000000);
  assert.equal(result.models[0].priced, true);
  assert.equal(result.estimatedCostUsd, .58);
  assert.equal(result.ledgerGeneration, 123);
  assert.equal(result.persistence.tokenCostSnapshot.usageAdapterVersion, 2);
});

test("new context-tier prices never guess a historical per-call split from aggregate Tokens", () => {
  const model = { model: "claude-haiku-5-5", inputTokens: 400000, outputTokens: 10000,
    requestCount: 10, estimatedCostUsd: null, priced: false };
  const result = normalizeCodexCostUsageResult({ scanned: true, schemaVersion: 7, models: [model], dailyUsage: [], observedAt: 1000 });
  assert.equal(result.models[0].inputTokens, 400000);
  assert.equal(result.persistence.tokenCostSnapshot.models[0].pricingPending, true);
  assert.equal(result.persistence.tokenCostSnapshot.models[0].pricingUnits, null);
  assert.equal(result.models[0].pricingPending, true);
  assert.equal(result.models[0].priced, false);
  assert.equal(result.estimatedCostUsd, null);
});

test("published scheduled Gemini prices change only at their effective UTC dates", () => {
  const rate = ADDITIONAL_MODEL_PRICING["gemini-4-argon"];
  assert.equal(effectivePricing(rate, Date.parse("2026-11-30T23:59:59Z")).input, 2);
  assert.equal(effectivePricing(rate, Date.parse("2026-12-01T00:00:00Z")).input, 4);
});

test("streaming cache TTL counters survive partial reads without retaining unrelated payloads", async t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "quota-ttl-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const usage = { input_tokens: 20000, cache_read_input_tokens: 60000, cache_creation_input_tokens: 20000,
    cache_creation: { ephemeral_1h_input_tokens: 10000, ephemeral_5m_input_tokens: 10000, private: "NEVER_RETAIN" }, output_tokens: 1000 };
  fs.writeFileSync(path.join(root, "rollout-ttl.jsonl"), record("claude-sonnet-5-5", usage).join("\n") + "\n");
  let state;
  for (let pass = 0; pass < 40; pass++) {
    state = await new CodexCostUsageReader({ sessionsRoot: root, cacheMs: 0, maxTotalBytes: 37 }).read(1000 + pass, state);
    assert.doesNotMatch(JSON.stringify(state), /NEVER_RETAIN/);
    if (state.indexComplete) break;
  }
  assert.equal(state.indexComplete, true);
  assert.equal(state.models[0].cacheWriteLongInputTokens, 10000);
  assert.equal(state.estimatedCostUsd, .121);
});

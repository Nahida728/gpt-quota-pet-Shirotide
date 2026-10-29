const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { CodexCostUsageReader, summarizeRolloutLines, normalizeCodexCostUsageResult } = require("../src/codex-cost-usage");
const { createQuotaStateStore } = require("../src/store");

function records(model, input, cached, output, day = "2026-10-28") {
  const usage = { input_tokens: input, cached_input_tokens: cached, output_tokens: output, total_tokens: input + output };
  return [JSON.stringify({ type: "turn_context", payload: { model } }),
    JSON.stringify({ type: "token_usage_record", ...(day ? { timestamp: day + "T01:00:00Z" } : {}),
      payload: { usage, thread_token_usage: usage } })];
}

test("legacy calibration aligns native Token allocation and cost while retaining Claude independently", () => {
  const raw = summarizeRolloutLines([{ lines: records("gpt-6.1-sol", 300000, 280000, 10000) },
    { lines: records("claude-sonnet-5-5", 100000, 80000, 5000) }]);
  const before = JSON.stringify(raw);
  const result = normalizeCodexCostUsageResult(raw, {}, 1000, {
    lifetimeTokens: 150000, dailyUsageBuckets: [{ startDate: "2026-10-28", tokens: 150000 }]
  });
  const native = result.models.find(model => model.model === "gpt-6.1-sol");
  const claude = result.models.find(model => model.model === "claude-sonnet-5-5");
  assert.equal(native.inputTokens, 150000);
  assert.equal(native.cachedInputTokens, 140000);
  assert.equal(native.outputTokens, 5000);
  // Preserve the original long-call rate, even when scaled input is <272K.
  assert.equal(native.estimatedCostUsd, 0.143);
  assert.equal(claude.inputTokens, 100000);
  assert.equal(claude.cachedInputTokens, 80000);
  assert.equal(claude.estimatedCostUsd, 0.098);
  assert.equal(result.estimatedCostUsd, 0.241);
  assert.equal(result.calibratedInputTokens, 250000);
  assert.equal(result.independentInputTokens, 100000);
  assert.equal(result.calibrationAdjustedInputTokens, 150000);
  assert.equal(result.localUsage.lifetimeTokens, 260000);
  assert.equal(result.persistence.tokenCostSnapshot.models.find(model => model.model === "gpt-6.1-sol").inputTokens, 300000);
  assert.equal(JSON.stringify(raw), before);
});

test("missing official dates and undated calls retain their recorded usage", () => {
  const raw = summarizeRolloutLines([
    { lines: records("gpt-6.1-sol", 1000, 800, 10, "2026-10-27") },
    { lines: records("gpt-6.1-sol", 1000, 800, 10) },
    { lines: records("gpt-6.1-sol", 250, 200, 10, null) }
  ]);
  const result = normalizeCodexCostUsageResult(raw, {}, 1000, {
    lifetimeTokens: 500, dailyUsageBuckets: [{ startDate: "2026-10-27", tokens: 500 }]
  });
  assert.equal(result.models[0].inputTokens, 1750);
  assert.equal(result.models[0].outputTokens, 25);
  assert.equal(result.estimatedCostUsd, 0.00109);
  assert.equal(result.calibrationUncoveredDays, 1);
  assert.equal(result.rawUndatedInputTokens, 250);
  assert.equal(result.localUsage.undatedTokens, 260);
  const zero = normalizeCodexCostUsageResult(raw, {}, 1000, {
    lifetimeTokens: 0, dailyUsageBuckets: [{ startDate: "2026-10-27", tokens: 0 }]
  });
  assert.equal(zero.models[0].inputTokens, 1250);
});

test("rounded per-model input sums conserve the official daily budget", () => {
  const raw = summarizeRolloutLines([{ lines: records("gpt-6.1-sol", 1001, 800, 10) },
    { lines: records("gpt-6.1-terra", 1001, 800, 10) }]);
  const result = normalizeCodexCostUsageResult(raw, {}, 1000, {
    lifetimeTokens: 1001, dailyUsageBuckets: [{ startDate: "2026-10-28", tokens: 1001 }]
  });
  assert.equal(result.models.reduce((sum, model) => sum + model.inputTokens, 0), 1001);
  assert.ok(result.models.every(model => model.cachedInputTokens <= model.inputTokens));
  assert.equal(result.models.find(model => model.model === "gpt-6.1-sol").inputTokens, 501);
  const zero = normalizeCodexCostUsageResult(raw, {}, 1000, {
    lifetimeTokens: 0, dailyUsageBuckets: [{ startDate: "2026-10-28", tokens: 0 }]
  });
  assert.equal(zero.calibratedInputTokens, 0);
  assert.equal(zero.estimatedCostUsd, 0);
  assert.equal(zero.persistence.tokenCostSnapshot.models.reduce((sum, model) => sum + model.inputTokens, 0), 2002);
});

test("cached reads and immutable archive recovery recalibrate without persisting projected counters", async t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "quota-old-cost-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.writeFileSync(path.join(root, "rollout-original.jsonl"), records("gpt-6.1-sol", 300000, 280000, 10000).join("\n") + "\n");
  const raw = await new CodexCostUsageReader({ sessionsRoot: root, cacheMs: 0 }).read(1000);
  const file = path.join(root, "quota-state.json");
  const store = createQuotaStateStore(file);
  store.set("tokenCostSnapshot", raw, { forceBackup: true });
  store.set("tokenUsageSnapshot", { lifetimeTokens: 150000, observedAt: 2000,
    dailyUsageBuckets: [{ startDate: "2026-10-28", tokens: 150000 }] }, { forceBackup: true });
  fs.writeFileSync(file, "{}");
  const restored = createQuotaStateStore(file);
  const before = JSON.stringify(restored.data);
  const cached = normalizeCodexCostUsageResult(null, restored.data);
  assert.equal(cached.cached, true);
  assert.equal(cached.models[0].inputTokens, 150000);
  assert.equal(cached.estimatedCostUsd, 0.143);
  const fresh = normalizeCodexCostUsageResult(raw, restored.data, 3000, restored.data.tokenUsageSnapshot);
  assert.equal(fresh.models[0].inputTokens, cached.models[0].inputTokens);
  assert.equal(fresh.estimatedCostUsd, cached.estimatedCostUsd);
  assert.equal(fresh.persistence.tokenCostSnapshot.models[0].inputTokens, 300000);
  assert.equal(JSON.stringify(restored.data), before);
});

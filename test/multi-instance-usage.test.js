const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { discoverCodexSources } = require("../src/codex-sources");
const { CodexCostUsageReader, summarizeRolloutLines, normalizeCodexCostUsageResult } = require("../src/codex-cost-usage");
const { CodexActiveTaskReader } = require("../src/codex-active-tasks");
const { combineTokenUsage, localTokenUsageFromCost } = require("../src/token-usage");

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "quota-multi-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return root;
}
const context = model => JSON.stringify({ type: "turn_context", payload: { model, private: "NEVER_RETAIN" } });
function records(input = 100, cached = 20, output = 10) {
  const usage = { input_tokens: input, cached_input_tokens: cached, output_tokens: output, total_tokens: input + output };
  return [JSON.stringify({ type: "token_usage_record", timestamp: "2026-10-28T01:00:02Z", payload: {
    usage, thread_token_usage: usage, response_id: "PRIVATE_RESPONSE", unrelated: "NEVER_RETAIN" } }),
  JSON.stringify({ type: "event_msg", timestamp: "2026-10-28T01:00:02Z", payload: { type: "token_count",
    info: { last_token_usage: usage, total_token_usage: usage } } })];
}

test("discovers default, environment and bounded Codex++ homes without retaining identities", t => {
  const home = fixture(t);
  const registry = path.join(home, ".codex-session-delete", "codex-multi", "extra");
  fs.mkdirSync(registry, { recursive: true });
  const external = path.join(home, "external-codex");
  fs.writeFileSync(path.join(registry, "instance.json"), JSON.stringify({ codexHome: external,
    sqliteHome: path.join(home, "db"), identity: "NEVER_RETAIN", apiKey: "NEVER_RETAIN" }));
  const sources = discoverCodexSources({ home, env: { CODEX_HOME: external, CODEX_SQLITE_HOME: path.join(home, "db") } });
  assert.ok(sources.sessionRoots.includes(path.join(home, ".codex", "sessions")));
  assert.equal(sources.homes.filter(item => item === external).length, 1);
  assert.ok(sources.sqliteHomes.includes(path.join(home, "db")));
  assert.doesNotMatch(JSON.stringify(sources), /NEVER_RETAIN|apiKey|identity/);
});

test("counts new records once beside legacy mirrors and honors inclusive/exclusive vendor counters", () => {
  const ordinary = summarizeRolloutLines([{ lines: [context("private-provider/model"), ...records()] }]);
  assert.equal(ordinary.models[0].inputTokens, 100);
  assert.equal(ordinary.models[0].requestCount, 1);
  assert.equal(ordinary.duplicateEvents, 1);
  assert.doesNotMatch(JSON.stringify(ordinary), /PRIVATE_RESPONSE|NEVER_RETAIN/);
  const inclusive = summarizeRolloutLines([{ lines: [context("glm-5.3"), ...records(100, 80)] }]);
  assert.equal(inclusive.models[0].inputTokens, 100);
  const vendor = { input_tokens: 100, cache_read_input_tokens: 900, cache_creation_input_tokens: 50, output_tokens: 10 };
  const exclusive = summarizeRolloutLines([{ lines: [context("unpriced-vendor"), JSON.stringify({ type: "token_usage_record",
    timestamp: "2026-10-28T01:00:02Z", payload: { usage: vendor, thread_token_usage: vendor } })] }]);
  assert.equal(exclusive.models[0].inputTokens, 1050);
  assert.equal(exclusive.models[0].cachedInputTokens, 900);
  assert.equal(exclusive.models[0].cacheWriteInputTokens, 50);
});

function offsetMirrors({ separateCalls = false, reverse = false } = {}) {
  let modern = { input_tokens: 10000, cached_input_tokens: 8000, output_tokens: 1000 };
  let legacy = { input_tokens: 6000, cached_input_tokens: 4000, output_tokens: 500 };
  const lines = [context("gpt-6.1-sol")];
  for (const [index, input] of [100, 200, 200].entries()) {
    const usage = { input_tokens: input, cached_input_tokens: input - 20, output_tokens: input / 10 };
    usage.total_tokens = usage.input_tokens + usage.output_tokens;
    for (const total of [modern, legacy]) for (const key of ["input_tokens", "cached_input_tokens", "output_tokens"]) {
      total[key] += usage[key] * (separateCalls ? 2 : 1);
    }
    const at = Date.parse("2026-10-27T23:59:50Z") + index * 20000;
    const modernRecord = { type: "token_usage_record", payload: { usage, thread_token_usage: { ...modern } } };
    const legacyRecord = { type: "event_msg", payload: { type: "token_count", info: { last_token_usage: usage, total_token_usage: { ...legacy } } } };
    const pair = reverse ? [legacyRecord, modernRecord] : [modernRecord, legacyRecord];
    pair.forEach((record, order) => lines.push(JSON.stringify({ ...record, timestamp: new Date(at + order * 1000).toISOString() })));
  }
  return lines;
}

test("deduplicates mirrored calls with different cumulative baselines only after matching increments", () => {
  for (const reverse of [false, true]) {
    const lines = offsetMirrors({ reverse });
    const actual = summarizeRolloutLines([{ lines }]);
    const expected = summarizeRolloutLines([{ lines: lines.filter(line => JSON.parse(line).type !== "event_msg") }]);
    assert.equal(actual.models[0].inputTokens, 500);
    assert.equal(actual.models[0].outputTokens, 50);
    assert.equal(actual.models[0].requestCount, 3);
    assert.equal(actual.duplicateEvents, 3);
    assert.deepEqual(actual.models, expected.models);
    assert.deepEqual(actual.dailyUsage, expected.dailyUsage);
    assert.equal(actual.estimatedCostUsd, expected.estimatedCostUsd);
    const replayed = summarizeRolloutLines([{ lines: [...lines, context("gpt-6.1-sol"), ...lines.slice(1)] }]);
    assert.deepEqual(replayed.models, actual.models);
  }
});

test("keeps equal genuine calls when cross-format increments include separate requests", () => {
  const actual = summarizeRolloutLines([{ lines: offsetMirrors({ separateCalls: true }) }]);
  assert.equal(actual.models[0].inputTokens, 1000);
  assert.equal(actual.models[0].outputTokens, 100);
  assert.equal(actual.models[0].requestCount, 6);
  assert.equal(actual.duplicateEvents, 0);
  const noTimestamp = offsetMirrors().map(line => { const record = JSON.parse(line); delete record.timestamp; return JSON.stringify(record); });
  assert.equal(summarizeRolloutLines([{ lines: noTimestamp }]).models[0].requestCount, 6);
});

test("mirror evidence and reversible costs survive bounded reads, restart and archive reconciliation", async t => {
  const root = fixture(t), sessions = path.join(root, "sessions"); fs.mkdirSync(sessions);
  fs.writeFileSync(path.join(sessions, "rollout-mirrors.jsonl"), offsetMirrors().join("\n") + "\n");
  let snapshot;
  for (let pass = 0; pass < 80; pass++) {
    snapshot = await new CodexCostUsageReader({ sessionsRoot: sessions, cacheMs: 0, maxTotalBytes: 97 }).read(10000 + pass, snapshot);
    // JSON persistence must carry the pending first-pair correction as well.
    snapshot = JSON.parse(JSON.stringify(snapshot));
    if (snapshot.indexComplete) break;
  }
  assert.ok(snapshot.indexComplete);
  const expected = summarizeRolloutLines([{ lines: offsetMirrors() }]);
  assert.deepEqual(snapshot.models, expected.models);
  assert.deepEqual(snapshot.dailyUsage, expected.dailyUsage);
  const old = structuredClone(snapshot);
  old.usageAdapterVersion = 2;
  old.models[0].inputTokens = old.rolloutIndex[0].models[0].inputTokens = 100000;
  old.rolloutIndex[0].usageAdapterVersion = 2;
  const unverified = normalizeCodexCostUsageResult(null, { tokenCostSnapshot: old });
  assert.equal(unverified.hasUnverifiedHistory, true);
  assert.equal(unverified.unverifiedFiles, 1);
  const rebuilt = await new CodexCostUsageReader({ sessionsRoot: sessions, cacheMs: 0 }).read(20000, old);
  const recovered = require("../src/codex-cost-usage").reconcileCostSnapshots([old, rebuilt]);
  assert.deepEqual(recovered.models, expected.models);
  assert.equal(normalizeCodexCostUsageResult(null, { tokenCostSnapshot: recovered }).hasUnverifiedHistory, false);
  assert.doesNotMatch(JSON.stringify(snapshot), /PRIVATE_RESPONSE|NEVER_RETAIN|rollout-mirrors/);
});

test("multiple session roots stay running; archived copies count once and new-format telemetry survives restart", async t => {
  const root = fixture(t), roots = ["one/sessions", "one/archived_sessions", "two/sessions", "two/archived_sessions"].map(p => path.join(root, p));
  for (const p of roots) fs.mkdirSync(p, { recursive: true });
  const now = Date.parse("2026-10-28T01:00:10Z"), started = Math.floor(now / 1000) - 10;
  for (const [index, name] of [[0, "a"], [2, "b"]]) {
    fs.writeFileSync(path.join(roots[index], `rollout-${name}.jsonl`), [JSON.stringify({ type: "session_meta", payload: { cwd: "C:\\work\\sample" } }),
      JSON.stringify({ type: "event_msg", timestamp: new Date(started * 1000).toISOString(), payload: { type: "task_started", turn_id: name, started_at: started } }),
      context("gpt-6.1-sol"), records()[0]].join("\n") + "\n");
  }
  const reader = new CodexActiveTaskReader({ sessionRoots: roots, goalContextReader: () => new Map() });
  const active = await reader.read(now);
  assert.equal(active.count, 2);
  assert.deepEqual(active.tasks.map(row => row.telemetry.totalTokens), [110, 110]);
  const costReader = new CodexCostUsageReader({ sessionRoots: roots, cacheMs: 0, maxTotalBytes: 97 });
  let state;
  for (let pass = 0; pass < 50; pass++) {
    state = await costReader.read(now + pass, state);
    if (state.indexComplete) break;
  }
  assert.equal(state.models[0].inputTokens, 200);
  fs.copyFileSync(path.join(roots[0], "rollout-a.jsonl"), path.join(roots[1], "rollout-a.jsonl"));
  const restarted = await new CodexCostUsageReader({ sessionRoots: roots, cacheMs: 0 }).read(now + 100, state);
  assert.equal(restarted.models[0].inputTokens, 200);
  assert.equal(restarted.models[0].requestCount, 2);
  assert.ok(restarted.indexComplete);
  assert.doesNotMatch(JSON.stringify(restarted), /NEVER_RETAIN|PRIVATE_RESPONSE|C:\\\\work/);
});

test("official account totals remain authoritative beside the separate local population", () => {
  const raw = summarizeRolloutLines([{ lines: [context("unpriced-vendor"), records()[0]] }]);
  raw.unattributedInputTokens = 5;
  const localUsage = localTokenUsageFromCost(raw);
  const cost = { available: true, localUsage, cached: false };
  const combined = combineTokenUsage({ lifetimeTokens: 9999, totalWorkDays: 30, available: true }, cost);
  assert.equal(combined.lifetimeTokens, 9999);
  assert.equal(combined.scope, "account");
  assert.equal(combined.totalWorkDays, 30);
  assert.equal(combined.localUsage.lifetimeTokens, 115);
  assert.equal(combined.localUsage.totalWorkDays, 1);
  assert.equal(combined.localUsage.undatedTokens, 5);
  assert.equal(combineTokenUsage(combined, cost).lifetimeTokens, 9999);
  const corrected = combineTokenUsage({ available: true, lifetimeTokens: 50, totalWorkDays: 2, cached: true }, cost);
  assert.equal(corrected.lifetimeTokens, 50);
  assert.equal(corrected.totalWorkDays, 2);
  assert.equal(corrected.cached, true);
  const fallback = combineTokenUsage({ available: false }, cost);
  assert.equal(fallback.scope, "local");
  assert.equal(fallback.lifetimeTokens, 115);
  assert.equal(combineTokenUsage(fallback, cost).lifetimeTokens, 115);
});

test("counter adapter rebuild replaces old entries across restart and archive reconciliation", async t => {
  const root = fixture(t), sessions = path.join(root, "sessions"); fs.mkdirSync(sessions);
  fs.writeFileSync(path.join(sessions, "rollout-one.jsonl"), context("gpt-6.1-sol") + "\n" + records()[0] + "\n");
  const options = { sessionsRoot: sessions, cacheMs: 0 };
  const first = await new CodexCostUsageReader(options).read(1000);
  const old = structuredClone(first); delete old.usageAdapterVersion;
  old.models[0].inputTokens = old.rolloutIndex[0].models[0].inputTokens = 10000;
  const partial = await new CodexCostUsageReader({ ...options, maxTotalBytes: 80 }).read(1001, old);
  assert.equal(partial.models[0].inputTokens, 10000);
  assert.ok(partial.rescanPending.length);
  const rebuilt = await new CodexCostUsageReader(options).read(1002, partial, { force: true });
  const recovered = require("../src/codex-cost-usage").reconcileCostSnapshots([old, rebuilt]);
  assert.equal(recovered.models[0].inputTokens, 100);
  assert.equal(normalizeCodexCostUsageResult(null, { tokenCostSnapshot: recovered }).localUsage.lifetimeTokens, 110);
});

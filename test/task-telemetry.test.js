const test = require("node:test");
const assert = require("node:assert/strict");
const { summarizeTaskTelemetry, normalizeTaskTelemetry } = require("../src/task-telemetry");
const { summarizeTaskWindow, normalizeActiveTaskResult } = require("../src/codex-active-tasks");

test("compact task reads preserve offset mirror evidence and unattributed output", async t => {
  const fs = require("node:fs"), os = require("node:os"), path = require("node:path");
  const { CodexActiveTaskReader } = require("../src/codex-active-tasks");
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "task-mirror-"));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const file = path.join(directory, "rollout.jsonl");
  const cumulative = (seconds, total, last, step) => {
    const record = JSON.parse(counter(seconds, total, last));
    Object.assign(record.payload.info.total_token_usage, { input_tokens: 160 + step * 100,
      cached_input_tokens: 20 + step * 10, total_tokens: 160 + step * 100 + total });
    return record;
  };
  const modern = (seconds, total, last) => {
    const legacy = cumulative(seconds, total, last, total >= 1130 ? 2 : total >= 1070 ? 1 : 0);
    return JSON.stringify({ timestamp: legacy.timestamp, type: "token_usage_record", payload: {
      usage: legacy.payload.info.last_token_usage, thread_token_usage: legacy.payload.info.total_token_usage,
      stream_duration_ms: 8400, serviceTier: "priority" } });
  };
  const lines = [JSON.stringify({ type: "event_msg", timestamp: new Date(startedAt * 1000).toISOString(),
    payload: { type: "task_started", turn_id: "mirror", started_at: startedAt } }),
    modern(5, 1040, 40), // before model context: numeric usage must survive
    JSON.stringify({ type: "turn_context", payload: { model: "gpt-6.1-sol" } }),
    counter(6, 500, 0), // legacy heartbeat with an independent cumulative base
    modern(10, 1070, 30), JSON.stringify(cumulative(11, 530, 30, 1)),
    modern(20, 1130, 60), JSON.stringify(cumulative(21, 590, 60, 2)),
    JSON.stringify({ type: "event_msg", timestamp: new Date((startedAt + 30) * 1000).toISOString(),
      payload: { type: "task_complete", turn_id: "mirror", started_at: startedAt,
        completed_at: startedAt + 30, duration_ms: 30000 } })];
  fs.writeFileSync(file, lines.join("\n") + "\n");
  const stat = fs.statSync(file);
  const reader = new CodexActiveTaskReader({ sessionsRoot: directory });
  const compact = await reader.readCachedTaskWindow({ path: file, size: stat.size, mtimeMs: stat.mtimeMs }, 1e6, null);
  const raw = summarizeTaskWindow(lines, (startedAt + 40) * 1000).terminalTask;
  const task = summarizeTaskWindow(compact.lines, (startedAt + 40) * 1000).terminalTask;
  assert.deepEqual(task.telemetry, raw.telemetry);
  assert.equal(task.telemetry.outputTokens, 130);
  assert.equal(task.unattributedOutputTokens, 40);
  assert.equal(task.models[0].outputTokens, 90); // mirrors counted once
  assert.equal(task.hasUnpricedModels, true);
  assert.equal(task.telemetry.intervalCount, 3);
  assert.equal(task.telemetry.peakTokensPerSecond, 8);
  assert.equal(task.telemetry.minTokensPerSecond, 6);
  assert.equal(task.telemetry.streamingDurationMs, 8400);
  assert.equal(task.telemetry.serviceTier, "Fast");
});

const startedAt = 1791590400;
function counter(seconds, total, last = total) {
  return JSON.stringify({ timestamp: new Date((startedAt + seconds) * 1000).toISOString(), type: "event_msg",
    payload: { type: "token_count", info: {
      total_token_usage: { input_tokens: 160, cached_input_tokens: 20, output_tokens: total, total_tokens: 160 + total },
      last_token_usage: { input_tokens: 100, cached_input_tokens: 10, output_tokens: last, total_tokens: 100 + last }
    } } });
}
const terminal = { startedAt, eventAt: startedAt + 30, durationMs: 30000, firstTokenMs: 1250 };
const cost = { models: [{ inputTokens: 170, cachedInputTokens: 120, outputTokens: 130 }] };

test("turn telemetry separates total tokens, interval extrema, and whole-turn average", () => {
  const result = summarizeTaskTelemetry([counter(10, 40), counter(12, 40), counter(20, 130, 90)], terminal, cost);
  assert.equal(result.firstTokenMs, 1250);
  assert.equal(result.totalTokens, 300); // cached input is already included
  assert.equal(result.peakTokensPerSecond, 9);
  assert.equal(result.minTokensPerSecond, 4);
  assert.equal(result.averageTokensPerSecond, 130 / 30); // terminal tool/wait time stays in denominator
  assert.equal(result.intervalCount, 2); // replay is not a zero-speed sample
  assert.equal(result.cacheHitRate, 120 / 170 * 100);
});

test("cache hit rate weights every participating model by input tokens and never counts output", () => {
  const result = summarizeTaskTelemetry([counter(10, 40)], terminal, { models: [
    { inputTokens: 100, cachedInputTokens: 80, outputTokens: 40 },
    { inputTokens: 900, cachedInputTokens: 90, outputTokens: 1000 }
  ] });
  assert.equal(result.cacheHitRate, 17);
  assert.equal(summarizeTaskTelemetry([], terminal, cost).cacheHitRate, null);
  assert.equal(summarizeTaskTelemetry([counter(10,40)], terminal, {models:[]}).cacheHitRate,null);
  assert.equal(normalizeTaskTelemetry({cacheHitRate:101}).cacheHitRate,null);
  const missingCache=JSON.parse(counter(10,40));delete missingCache.payload.info.last_token_usage.cached_input_tokens;
  assert.equal(summarizeTaskTelemetry([JSON.stringify(missingCache)],terminal,cost).cacheHitRate,null);
});

test("missing timestamps and incomplete scans never invent interval speeds", () => {
  const withoutTime = JSON.parse(counter(10, 130));
  delete withoutTime.timestamp;
  const result = summarizeTaskTelemetry([JSON.stringify(withoutTime)], terminal, cost);
  assert.equal(result.peakTokensPerSecond, null);
  assert.equal(result.minTokensPerSecond, null);
  assert.equal(result.averageTokensPerSecond, 130 / 30);
  const partial = summarizeTaskTelemetry([counter(10, 130)], terminal, cost, true);
  assert.equal(partial.totalTokens, 300);
  assert.equal(partial.partial, true);
  assert.equal(partial.averageTokensPerSecond, null);
  assert.equal(partial.peakTokensPerSecond, null);
  const missing = summarizeTaskTelemetry([], terminal, cost);
  assert.equal(missing.totalTokens, null);
  assert.equal(missing.averageTokensPerSecond, null);
});

test("invalid and reset counters invalidate extrema; unsafe numeric fields stay unavailable", () => {
  const result = summarizeTaskTelemetry([counter(10, 130), counter(20, 10)], terminal, cost);
  assert.equal(result.minTokensPerSecond, null);
  assert.deepEqual(normalizeTaskTelemetry({ firstTokenMs: -1, totalTokens: "100", peakTokensPerSecond: Infinity }).firstTokenMs, null);
  assert.equal(normalizeTaskTelemetry({ totalTokens: "100" }).totalTokens, null);
});

test("completed-task latency and numeric telemetry cross the public normalization boundary", () => {
  const lines = [JSON.stringify({ type: "event_msg", timestamp: new Date(startedAt * 1000).toISOString(),
    payload: { type: "task_started", turn_id: "turn-1", started_at: startedAt } }),
    JSON.stringify({ type: "turn_context", payload: { model: "gpt-6.1-sol" } }),
    counter(10, 40), counter(20, 130, 90),
    JSON.stringify({ type: "event_msg", timestamp: new Date((startedAt + 30) * 1000).toISOString(),
      payload: { type: "task_complete", turn_id: "turn-1", started_at: startedAt, completed_at: startedAt + 30,
        duration_ms: 30000, time_to_first_token_ms: 1250, last_agent_message: "private content" } })];
  const task = summarizeTaskWindow(lines, (startedAt + 40) * 1000).terminalTask;
  assert.equal(task.telemetry.firstTokenMs, 1250);
  assert.equal(task.telemetry.outputTokens, 130);
  assert.equal(task.telemetry.peakTokensPerSecond, 9);
  const result = normalizeActiveTaskResult({ available: true, tasks: [], terminalTasks: [
    { ...task, id: "later-abort", endedAt: startedAt + 39, outcome: "abnormal-interrupted" }, task
  ] });
  assert.equal(result.latestTask.id, "turn-1");
  assert.equal(result.latestTask.telemetry.firstTokenMs, 1250);
  assert.ok(!JSON.stringify(result).includes("private content"));
});

test("streaming duration and speed tier require explicit evidence and survive task normalization", () => {
  assert.equal(summarizeTaskTelemetry([counter(10, 130)], terminal, cost).streamingDurationMs, null);
  assert.equal(summarizeTaskTelemetry([counter(10, 130)], terminal, cost).serviceTier, null);
  for (const [raw, expected] of [["standard", "Standard"], ["priority", "Fast"], ["ultra_fast", "UltraFast"], ["unknown-secret", null]]) {
    const lines = [JSON.stringify({ type: "event_msg", timestamp: new Date(startedAt * 1000).toISOString(), payload: { type: "task_started", turn_id: "speed", started_at: startedAt } }),
      JSON.stringify({ type: "turn_context", payload: { model: "gpt-6.1-sol", service_tier: raw } }), counter(10,130),
      JSON.stringify({ type: "event_msg", timestamp: new Date((startedAt + 30) * 1000).toISOString(), payload: { type: "task_complete", turn_id: "speed", started_at: startedAt,
        completed_at: startedAt+30, duration_ms:30000,time_to_first_token_ms:1250,streaming_duration_ms:8400 } })];
    const task = summarizeTaskWindow(lines, (startedAt+40)*1000).terminalTask;
    const result = normalizeActiveTaskResult({ available:true,tasks:[],terminalTasks:[task] }).latestTask.telemetry;
    assert.equal(result.streamingDurationMs,8400); assert.equal(result.serviceTier,expected);
    assert.ok(!JSON.stringify(result).includes("unknown-secret"));
  }
});

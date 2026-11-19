// Only numeric counters, timestamps and known tier labels leave this reader. Interval rates are
// output-token averages between log records, not per-token decoding speeds.
const MAX_SAFE = Number.MAX_SAFE_INTEGER;
const { tokenUsageInfo, USAGE_RECORD_PATTERN, usageCounterValues, observeUsageMirror } = require("./usage-record");

function safeNumber(value) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= MAX_SAFE
    ? value : null;
}

function normalizeServiceTier(value) {
  if (typeof value !== "string") return null;
  const tier = value.trim().toLowerCase();
  if (["standard", "default"].includes(tier)) return "Standard";
  if (["fast", "priority"].includes(tier)) return "Fast";
  if (["ultrafast", "ultra_fast", "ultra-fast"].includes(tier)) return "UltraFast";
  return null;
}

function readServiceTier(record) {
  const payload = record?.payload;
  if (record?.type === "event_msg" && payload?.type === "thread_settings_applied") {
    const settings = payload.thread_settings;
    return normalizeServiceTier(settings?.service_tier ?? settings?.serviceTier);
  }
  if (record?.type === "turn_context") {
    return normalizeServiceTier(payload?.service_tier ?? payload?.serviceTier);
  }
  return null;
}

function normalizeTaskTelemetry(value) {
  if (!value || typeof value !== "object") return null;
  const streamingDurationMs = safeNumber(value.streamingDurationMs);
  const reasoning = safeNumber(value.reasoningOutputTokens);
  const output = safeNumber(value.outputTokens);
  return {
    firstTokenMs: safeNumber(value.firstTokenMs),
    streamingDurationMs,
    streamingDurationKind: streamingDurationMs === null ? null
      : value.streamingDurationKind === "output-span" ? "output-span" : "recorded",
    serviceTier: normalizeServiceTier(value.serviceTier),
    totalTokens: safeNumber(value.totalTokens),
    outputTokens: output,
    reasoningOutputTokens: reasoning !== null && output !== null && reasoning <= output ? reasoning : null,
    cacheHitRate: safeNumber(value.cacheHitRate) !== null && value.cacheHitRate <= 100 ? value.cacheHitRate : null,
    peakTokensPerSecond: safeNumber(value.peakTokensPerSecond),
    minTokensPerSecond: safeNumber(value.minTokensPerSecond),
    averageTokensPerSecond: safeNumber(value.averageTokensPerSecond),
    intervalCount: Math.floor(safeNumber(value.intervalCount) || 0),
    partial: Boolean(value.partial),
    rateMode: "recorded-output-intervals"
  };
}

function outputSpanMs(terminal, firstTokenMs, finalAnswerAt) {
  const durationMs = safeNumber(terminal?.durationMs);
  const terminalAt = terminal?.eventAtMs;
  if (terminal?.kind !== "task_complete" || terminal.finalAnswer || firstTokenMs === null ||
      durationMs === null || !Number.isFinite(terminalAt) || !Number.isFinite(terminal.eventAt) ||
      !Number.isFinite(finalAnswerAt)) return null;
  // Cross-check the inferred millisecond start against the explicit start so
  // archived/replayed records cannot turn a replay delay into streamed output.
  const anchor = terminalAt - durationMs;
  if (!Number.isFinite(terminal.startedAt) || Math.abs(anchor - terminal.startedAt * 1000) > 2000 ||
      Number.isFinite(terminal.startLogMs) && Math.abs(anchor - terminal.startLogMs) > 2000 ||
      Math.abs(terminalAt - terminal.eventAt * 1000) >= 1000 ||
      finalAnswerAt < anchor + firstTokenMs || finalAnswerAt > terminalAt) return null;
  return finalAnswerAt - (anchor + firstTokenMs);
}

function summarizeTaskTelemetry(lines, terminal, cost, partial = false) {
  const models = [...(Array.isArray(cost?.models) ? cost.models : []), {
    inputTokens: cost?.unattributedInputTokens, cachedInputTokens: cost?.unattributedCachedInputTokens,
    outputTokens: cost?.unattributedOutputTokens, reasoningOutputTokens: cost?.unattributedReasoningOutputTokens
  }];
  // Codex reports reasoning as a subset of output, not additional tokens.
  const outputTokens = models.reduce((sum, model) => Math.min(MAX_SAFE, sum + (safeNumber(model.outputTokens) || 0)), 0);
  const reasoningOutputTokens = models.reduce((sum, model) =>
    Math.min(MAX_SAFE, sum + Math.min(safeNumber(model.outputTokens) || 0, safeNumber(model.reasoningOutputTokens) || 0)), 0);
  const totalTokens = models.reduce((sum, model) => Math.min(MAX_SAFE, sum + (safeNumber(model.inputTokens) || 0) + (safeNumber(model.outputTokens) || 0)), 0);
  const inputTokens = models.reduce((sum, model) => Math.min(MAX_SAFE, sum + (safeNumber(model.inputTokens) || 0)), 0);
  const cachedInputTokens = models.reduce((sum, model) => Math.min(MAX_SAFE, sum + Math.min(safeNumber(model.inputTokens) || 0, safeNumber(model.cachedInputTokens) || 0)), 0);
  let firstTokenMs = safeNumber(terminal?.firstTokenMs);
  let streamingDurationMs = safeNumber(terminal?.streamingDurationMs);
  let serviceTier = normalizeServiceTier(terminal?.serviceTier);
  let appliedTier = normalizeServiceTier(terminal?.appliedTier);
  const durationMs = safeNumber(terminal?.durationMs) ?? (
    Number.isFinite(terminal?.startedAt) && Number.isFinite(terminal?.eventAt)
      ? Math.max(0, terminal.eventAt - terminal.startedAt) * 1000 : null
  );
  let previousAt = Number.isFinite(terminal?.startedAt) ? terminal.startedAt * 1000 : null;
  const previousTotals = new Map();
  const seenUsage = new Set(), mirrors = {}, samples = [];
  let sampledOutput = 0;
  let countersKnown = false;
  let cacheCountersKnown = true;
  let cacheSampled = false;
  let reasoningKnown = false;
  let finalAnswerAt = null;
  let validIntervals = !partial;
  const rates = [];
  for (const line of Array.isArray(lines) ? lines : []) {
    if (!USAGE_RECORD_PATTERN.test(line) && !/"type"\s*:\s*"(?:turn_context|thread_settings_applied)"/.test(line) &&
        !/"phase"\s*:\s*"final_answer"/.test(line)) continue;
    let record;
    try { record = JSON.parse(line); } catch { continue; }
    if (record.type === "response_item" && record.payload?.role === "assistant" && record.payload?.phase === "final_answer") {
      finalAnswerAt = Date.parse(record.timestamp);
      continue;
    }
    if (record.type === "turn_context") {
      serviceTier = readServiceTier(record) ?? serviceTier;
      continue;
    }
    if (record.type === "event_msg" && record.payload?.type === "thread_settings_applied") {
      appliedTier ??= readServiceTier(record);
      continue;
    }
    const info = tokenUsageInfo(record);
    if (!info) continue;
    firstTokenMs ??= safeNumber(info.time_to_first_token_ms);
    streamingDurationMs = safeNumber(info.streaming_duration_ms ?? info.stream_duration_ms) ?? streamingDurationMs;
    serviceTier = normalizeServiceTier(info.service_tier ?? info.serviceTier) ?? serviceTier;
    const usage = info?.last_token_usage;
    const reasoning = safeNumber(usage?.reasoning_output_tokens ?? usage?.output_tokens_details?.reasoning_tokens ??
      usage?.completion_tokens_details?.reasoning_tokens);
    reasoningKnown ||= reasoning !== null;
    const input = safeNumber(usage?.input_tokens ?? usage?.prompt_tokens);
    const cached = safeNumber(usage?.cached_input_tokens ?? usage?.cache_read_input_tokens ?? usage?.input_tokens_details?.cached_tokens ?? usage?.prompt_tokens_details?.cached_tokens);
    if (input > 0 || cached > 0) { cacheSampled = true; cacheCountersKnown &&= cached !== null; }
    const total = safeNumber(info?.total_token_usage?.output_tokens ?? info?.total_token_usage?.completion_tokens);
    const last = safeNumber(usage?.output_tokens ?? usage?.completion_tokens);
    if (total === null) continue;
    countersKnown = true;
    const previousTotal = previousTotals.get(record.type) ?? null;
    const output = previousTotal === null ? last : total - previousTotal;
    const at = typeof record.timestamp === "string" ? Date.parse(record.timestamp) : NaN;
    const signature = info.total_token_usage && usage
      ? usageCounterValues(info.total_token_usage).concat(usageCounterValues(usage)).join(":") : null;
    const exactDuplicate = signature !== null && seenUsage.has(signature);
    const sample = { output, at, discarded: false };
    const mirror = observeUsageMirror(mirrors, record, sample, exactDuplicate);
    if (mirror.rollback) mirror.rollback.discarded = true;
    if (signature !== null) seenUsage.add(signature);
    previousTotals.set(record.type, total);
    if (exactDuplicate || mirror.duplicate || output === 0 || (previousTotal !== null && total === previousTotal)) continue;
    samples.push(sample);
  }
  for (const { output, at, discarded } of samples) {
    if (discarded) continue;
    if (output === null || output < 0 || !Number.isFinite(at) || previousAt === null ||
        at <= previousAt || (Number.isFinite(terminal?.eventAt) && at > terminal.eventAt * 1000 + 1000)) {
      validIntervals = false;
    } else {
      sampledOutput += output;
      rates.push(output / ((at - previousAt) / 1000));
    }
    previousAt = Number.isFinite(at) ? at : null;
  }
  // A missing/reordered counter or an uncovered output segment invalidates the
  // extrema. Whole-turn average can still use complete cost counters + duration.
  validIntervals = validIntervals && sampledOutput === outputTokens;
  const recorded = safeNumber(terminal?.streamingDurationMs) ?? streamingDurationMs;
  return normalizeTaskTelemetry({
    firstTokenMs,
    streamingDurationMs: recorded ?? outputSpanMs(terminal, safeNumber(terminal?.firstTokenMs), finalAnswerAt),
    streamingDurationKind: recorded === null ? "output-span" : "recorded",
    serviceTier: normalizeServiceTier(terminal?.serviceTier) ?? serviceTier ?? appliedTier,
    totalTokens: countersKnown ? totalTokens : null,
    outputTokens: countersKnown ? outputTokens : null,
    reasoningOutputTokens: countersKnown && reasoningKnown ? reasoningOutputTokens : null,
    cacheHitRate: cacheSampled && cacheCountersKnown && inputTokens > 0 ? cachedInputTokens / inputTokens * 100 : null,
    peakTokensPerSecond: validIntervals && rates.length ? rates.reduce((peak, rate) => Math.max(peak, rate), 0) : null,
    minTokensPerSecond: validIntervals && rates.length ? rates.reduce((minimum, rate) => Math.min(minimum, rate), Infinity) : null,
    averageTokensPerSecond: !partial && countersKnown && durationMs > 0
      ? outputTokens / (durationMs / 1000) : null,
    intervalCount: validIntervals ? rates.length : 0,
    partial
  });
}

module.exports = { normalizeTaskTelemetry, summarizeTaskTelemetry, normalizeServiceTier, readServiceTier };

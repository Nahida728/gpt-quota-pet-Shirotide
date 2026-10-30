// Only numeric counters and timestamps leave this reader. Interval rates are
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

function normalizeTaskTelemetry(value) {
  if (!value || typeof value !== "object") return null;
  return {
    firstTokenMs: safeNumber(value.firstTokenMs),
    streamingDurationMs: safeNumber(value.streamingDurationMs),
    serviceTier: normalizeServiceTier(value.serviceTier),
    totalTokens: safeNumber(value.totalTokens),
    outputTokens: safeNumber(value.outputTokens),
    cacheHitRate: safeNumber(value.cacheHitRate) !== null && value.cacheHitRate <= 100 ? value.cacheHitRate : null,
    peakTokensPerSecond: safeNumber(value.peakTokensPerSecond),
    minTokensPerSecond: safeNumber(value.minTokensPerSecond),
    averageTokensPerSecond: safeNumber(value.averageTokensPerSecond),
    intervalCount: Math.floor(safeNumber(value.intervalCount) || 0),
    partial: Boolean(value.partial),
    rateMode: "recorded-output-intervals"
  };
}

function summarizeTaskTelemetry(lines, terminal, cost, partial = false) {
  const models = [...(Array.isArray(cost?.models) ? cost.models : []), {
    inputTokens: cost?.unattributedInputTokens, cachedInputTokens: cost?.unattributedCachedInputTokens,
    outputTokens: cost?.unattributedOutputTokens
  }];
  const outputTokens = models.reduce((sum, model) => Math.min(MAX_SAFE, sum + (safeNumber(model.outputTokens) || 0)), 0);
  const totalTokens = models.reduce((sum, model) => Math.min(MAX_SAFE, sum + (safeNumber(model.inputTokens) || 0) + (safeNumber(model.outputTokens) || 0)), 0);
  const inputTokens = models.reduce((sum, model) => Math.min(MAX_SAFE, sum + (safeNumber(model.inputTokens) || 0)), 0);
  const cachedInputTokens = models.reduce((sum, model) => Math.min(MAX_SAFE, sum + Math.min(safeNumber(model.inputTokens) || 0, safeNumber(model.cachedInputTokens) || 0)), 0);
  const firstTokenMs = safeNumber(terminal?.firstTokenMs);
  let streamingDurationMs = safeNumber(terminal?.streamingDurationMs);
  let serviceTier = normalizeServiceTier(terminal?.serviceTier);
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
  let validIntervals = !partial;
  const rates = [];
  for (const line of Array.isArray(lines) ? lines : []) {
    if (!USAGE_RECORD_PATTERN.test(line) && !/"type"\s*:\s*"turn_context"/.test(line)) continue;
    let record;
    try { record = JSON.parse(line); } catch { continue; }
    if (record.type === "turn_context") {
      serviceTier = normalizeServiceTier(record.payload?.service_tier ?? record.payload?.serviceTier) ?? serviceTier;
      continue;
    }
    const info = tokenUsageInfo(record);
    if (!info) continue;
    streamingDurationMs = safeNumber(info.streaming_duration_ms ?? info.stream_duration_ms) ?? streamingDurationMs;
    serviceTier = normalizeServiceTier(info.service_tier ?? info.serviceTier) ?? serviceTier;
    const usage = info?.last_token_usage;
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
  return normalizeTaskTelemetry({
    firstTokenMs,
    streamingDurationMs: safeNumber(terminal?.streamingDurationMs) ?? streamingDurationMs,
    serviceTier: normalizeServiceTier(terminal?.serviceTier) ?? serviceTier,
    totalTokens: countersKnown ? totalTokens : null,
    outputTokens: countersKnown ? outputTokens : null,
    cacheHitRate: cacheSampled && cacheCountersKnown && inputTokens > 0 ? cachedInputTokens / inputTokens * 100 : null,
    peakTokensPerSecond: validIntervals && rates.length ? rates.reduce((peak, rate) => Math.max(peak, rate), 0) : null,
    minTokensPerSecond: validIntervals && rates.length ? rates.reduce((minimum, rate) => Math.min(minimum, rate), Infinity) : null,
    averageTokensPerSecond: !partial && countersKnown && durationMs > 0
      ? outputTokens / (durationMs / 1000) : null,
    intervalCount: validIntervals ? rates.length : 0,
    partial
  });
}

module.exports = { normalizeTaskTelemetry, summarizeTaskTelemetry, normalizeServiceTier };

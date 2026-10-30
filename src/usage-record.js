// Adapt the two generations of Codex usage evidence to the same counter pair.
// IDs, response contents and other payload fields never leave this function.
function tokenUsageInfo(record) {
  if (record?.type === "event_msg" && record.payload?.type === "token_count") return record.payload.info;
  if (record?.type === "token_usage_record") return {
    last_token_usage: record.payload?.usage,
    total_token_usage: record.payload?.thread_token_usage,
    streaming_duration_ms: record.payload?.streaming_duration_ms ?? record.payload?.stream_duration_ms,
    service_tier: record.payload?.service_tier ?? record.payload?.serviceTier
  };
  return null;
}

const USAGE_RECORD_PATTERN = /"type"\s*:\s*"(?:token_count|token_usage_record)"/;
function compactUsage(value) {
  if (!value || typeof value !== "object") return undefined;
  const result = {};
  for (const key of ["input_tokens", "cached_input_tokens", "cache_write_input_tokens", "output_tokens", "reasoning_output_tokens", "total_tokens",
    "prompt_tokens", "completion_tokens", "cache_read_input_tokens", "cache_creation_input_tokens", "cache_write_1h_input_tokens", "cache_write_12h_input_tokens", "cache_write_5m_input_tokens", "cache_write_30m_input_tokens"]) {
    if (Number.isSafeInteger(value[key]) && value[key] >= 0) result[key] = value[key];
  }
  for (const [key, child] of [["input_tokens_details", "cached_tokens"], ["prompt_tokens_details", "cached_tokens"],
    ["output_tokens_details", "reasoning_tokens"], ["completion_tokens_details", "reasoning_tokens"], ["cache_creation", "ephemeral_1h_input_tokens"], ["cache_creation", "ephemeral_5m_input_tokens"]]) {
    if (Number.isSafeInteger(value[key]?.[child]) && value[key][child] >= 0) (result[key] ||= {})[child] = value[key][child];
  }
  return result;
}
function usageCounterValues(value) {
  const count = number => Number.isSafeInteger(number) && number >= 0 ? number : 0;
  const shortWrite = value?.cache_write_5m_input_tokens ?? value?.cache_write_30m_input_tokens ?? value?.cache_creation?.ephemeral_5m_input_tokens;
  const longWrite = value?.cache_write_1h_input_tokens ?? value?.cache_write_12h_input_tokens ?? value?.cache_creation?.ephemeral_1h_input_tokens;
  return [value?.input_tokens ?? value?.prompt_tokens,
    value?.cached_input_tokens ?? value?.cache_read_input_tokens ?? value?.input_tokens_details?.cached_tokens ?? value?.prompt_tokens_details?.cached_tokens,
    value?.cache_write_input_tokens ?? value?.cache_creation_input_tokens ?? count(shortWrite) + count(longWrite),
    value?.output_tokens ?? value?.completion_tokens,
    value?.reasoning_output_tokens ?? value?.output_tokens_details?.reasoning_tokens ?? value?.completion_tokens_details?.reasoning_tokens,
    value?.total_tokens].map(count);
}

// A resumed thread can give the two formats different cumulative baselines.
// Equal last-usage counts alone are insufficient: require two one-to-one pairs
// whose counter offsets are constant and whose increments equal the next call.
// Keep only numeric evidence, including a reversible first candidate, across
// bounded reads. Independent rollouts never share this state.
function observeUsageMirror(state, record, contribution, exactDuplicate) {
  const info = tokenUsageInfo(record);
  const at = typeof record.timestamp === "string" ? Date.parse(record.timestamp) : NaN;
  if (!info?.last_token_usage || !info.total_token_usage || !Number.isFinite(at)) {
    state.previous = null;
    state.pair = null;
    state.pending = null;
    return {};
  }
  const current = { type: record.type, at, last: usageCounterValues(info.last_token_usage).slice(0, 5),
    total: usageCounterValues(info.total_token_usage).slice(0, 5), paired: false };
  const previous = state.previous;
  state.previous = current;
  if (!previous || previous.paired || previous.type === current.type || at < previous.at ||
      !current.last.some(number => number > 0) ||
      current.last.some((number, index) => number !== previous.last[index])) return {};
  current.paired = true;
  const modern = current.type === "token_usage_record" ? current : previous;
  const legacy = current.type === "event_msg" ? current : previous;
  const pair = { modern, legacy, offset: modern.total.map((number, index) => number - legacy.total[index]) };
  const baseline = state.pair;
  const continuous = baseline && pair.offset.every((number, index) => number === baseline.offset[index]) &&
    ["modern", "legacy"].every(kind => pair[kind].at >= baseline[kind].at &&
      pair[kind].total.every((number, index) => number - baseline[kind].total[index] === pair[kind].last[index]));
  const rollback = continuous ? state.pending : null;
  state.pair = pair;
  state.pending = !continuous && !exactDuplicate ? contribution : null;
  return { duplicate: Boolean(continuous), rollback };
}

module.exports = { tokenUsageInfo, compactUsage, USAGE_RECORD_PATTERN, usageCounterValues, observeUsageMirror };

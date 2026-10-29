const { normalizeDailyBuckets } = require("./token-usage");

const count = value => Number.isFinite(value) && value >= 0 ? Math.min(Number.MAX_SAFE_INTEGER, Math.floor(value)) : 0;
const rounded = value => Math.round((value + Math.max(1, value) * Number.EPSILON) * 1e6) / 1e6;
const TOKEN_KEYS = ["inputTokens", "cachedInputTokens", "cacheWriteInputTokens", "cacheWriteLongInputTokens",
  "outputTokens", "reasoningOutputTokens", "requestCount", "longContextRequests"];
const UNATTRIBUTED_KEYS = ["unattributedInputTokens", "unattributedCachedInputTokens", "unattributedCacheWriteInputTokens",
  "unattributedOutputTokens", "unattributedReasoningOutputTokens", "unattributedRequestCount"];

function sumUnattributed(rows) {
  return Object.fromEntries(UNATTRIBUTED_KEYS.map(key => [key, rows.reduce((sum, row) => sum + count(row[key]), 0)]));
}

// Combine already-priced rows without reclassifying a scaled prompt as short
// context. Daily calibration changes allocation, never the original call tier.
function combineProjectedModels(collections) {
  const grouped = new Map();
  for (const models of collections) for (const model of models) {
    const target = grouped.get(model.model) || { ...model,
      ...Object.fromEntries(TOKEN_KEYS.map(key => [key, 0])), estimatedCostUsd: 0,
      priced: false, pricingPartial: false, accountCalibrated: false, pricingUnits: null };
    for (const key of TOKEN_KEYS) target[key] += count(model[key]);
    const priced = model.priced && Number.isFinite(model.estimatedCostUsd);
    if (priced) { target.estimatedCostUsd += model.estimatedCostUsd; target.priced = true; }
    else if (model.inputTokens || model.outputTokens) target.pricingPartial = true;
    target.accountCalibrated ||= Boolean(model.accountCalibrated);
    grouped.set(model.model, target);
  }
  return [...grouped.values()].map(model => ({ ...model,
    estimatedCostUsd: model.priced ? rounded(model.estimatedCostUsd) : null,
    pricingPending: !model.priced && Boolean(model.pricing),
    cacheHitRate: model.inputTokens ? Number((model.cachedInputTokens / model.inputTokens * 100).toFixed(2)) : 0
  })).filter(model => model.inputTokens || model.outputTokens || model.requestCount)
    .sort((a, b) => Number(b.priced) - Number(a.priced) || (b.estimatedCostUsd || 0) - (a.estimatedCostUsd || 0) || a.model.localeCompare(b.model));
}

function allocateInput(models, unattributedInput, budget) {
  const values = [...models.map(model => count(model.inputTokens)), count(unattributedInput)];
  const total = values.reduce((sum, value) => sum + value, 0);
  if (!total) return values;
  const target = Math.min(total, count(budget));
  const exact = values.map(value => value / total * target);
  const result = exact.map(Math.floor);
  let remaining = target - result.reduce((sum, value) => sum + value, 0);
  const order = exact.map((value, index) => ({ index, fraction: value - result[index] }))
    .sort((a, b) => b.fraction - a.fraction || a.index - b.index);
  for (const item of order) if (remaining > 0) { result[item.index]++; remaining--; }
  return result;
}

function scaledModel(model, factor, allocatedInput) {
  const result = { ...model, ...Object.fromEntries(TOKEN_KEYS.map(key => [key, Math.round(count(model[key]) * factor)])),
    inputTokens: allocatedInput, accountCalibrated: true,
    estimatedCostUsd: model.priced && Number.isFinite(model.estimatedCostUsd) ? model.estimatedCostUsd * factor : null };
  result.cachedInputTokens = Math.min(result.inputTokens, result.cachedInputTokens);
  result.cacheWriteInputTokens = Math.min(result.inputTokens - result.cachedInputTokens, result.cacheWriteInputTokens);
  result.cacheWriteLongInputTokens = Math.min(result.cacheWriteInputTokens, result.cacheWriteLongInputTokens);
  result.reasoningOutputTokens = Math.min(result.outputTokens, result.reasoningOutputTokens);
  result.longContextRequests = Math.min(result.requestCount, result.longContextRequests);
  return result;
}

function undatedModels(snapshot) {
  const dated = combineProjectedModels(snapshot.dailyUsage.map(row => row.models));
  const byName = new Map(dated.map(model => [model.model, model]));
  return snapshot.models.map(model => {
    const known = byName.get(model.model) || {};
    return { ...model, ...Object.fromEntries(TOKEN_KEYS.map(key => [key, Math.max(0, count(model[key]) - count(known[key]))])),
      estimatedCostUsd: model.priced && Number.isFinite(model.estimatedCostUsd)
        ? Math.max(0, model.estimatedCostUsd - (known.estimatedCostUsd || 0)) : null };
  }).filter(model => model.inputTokens || model.outputTokens || model.requestCount);
}

function calibrateCostSnapshot(snapshot, accountUsage, isNativeModel) {
  const official = new Map(normalizeDailyBuckets(accountUsage?.dailyUsageBuckets).map(row => [row.startDate, row.tokens]));
  const rawInput = snapshot.models.reduce((sum, model) => sum + model.inputTokens, snapshot.unattributedInputTokens || 0);
  const rows = [];
  let adjusted = 0, matchedDays = 0, uncoveredDays = 0, nativeDatedInput = 0;
  for (const row of snapshot.dailyUsage) {
    const native = row.models.filter(model => isNativeModel(model.model));
    const independent = row.models.filter(model => !isNativeModel(model.model));
    const input = native.reduce((sum, model) => sum + model.inputTokens, row.unattributedInputTokens || 0);
    nativeDatedInput += input;
    // A missing official date is unknown coverage, not a zero-use day.
    if (!official.has(row.date) || !input) {
      if (input && !official.has(row.date)) uncoveredDays++;
      rows.push({ ...row, models: combineProjectedModels([row.models]) });
      continue;
    }
    matchedDays++;
    const budget = Math.min(input, official.get(row.date));
    const factor = budget / input;
    const allocation = allocateInput(native, row.unattributedInputTokens, budget);
    const scaledUnattributed = Object.fromEntries(UNATTRIBUTED_KEYS.map(key => [key, Math.round(count(row[key]) * factor)]));
    scaledUnattributed.unattributedInputTokens = allocation.at(-1);
    scaledUnattributed.unattributedCachedInputTokens = Math.min(allocation.at(-1), scaledUnattributed.unattributedCachedInputTokens);
    scaledUnattributed.unattributedCacheWriteInputTokens = Math.min(allocation.at(-1) - scaledUnattributed.unattributedCachedInputTokens,
      scaledUnattributed.unattributedCacheWriteInputTokens);
    scaledUnattributed.unattributedReasoningOutputTokens = Math.min(scaledUnattributed.unattributedOutputTokens, scaledUnattributed.unattributedReasoningOutputTokens);
    rows.push({ date: row.date, models: combineProjectedModels([
      native.map((model, index) => scaledModel(model, factor, allocation[index])), independent
    ]), ...scaledUnattributed });
    adjusted += input - budget;
  }
  const datedUnattributed = sumUnattributed(snapshot.dailyUsage);
  const undatedUnattributed = Object.fromEntries(UNATTRIBUTED_KEYS.map(key => [key,
    Math.max(0, count(snapshot[key]) - datedUnattributed[key])]));
  const models = combineProjectedModels([...rows.map(row => row.models), undatedModels(snapshot)]);
  const unattributed = sumUnattributed([...rows, undatedUnattributed]);
  const calibratedInput = models.reduce((sum, model) => sum + model.inputTokens, unattributed.unattributedInputTokens);
  const independentInput = models.filter(model => !isNativeModel(model.model)).reduce((sum, model) => sum + model.inputTokens, 0);
  const datedInput = snapshot.dailyUsage.reduce((sum, row) => sum + row.models.reduce((total, model) => total + model.inputTokens,
    row.unattributedInputTokens || 0), 0);
  return { ...snapshot, models, dailyUsage: rows, ...unattributed,
    estimatedCostUsd: models.some(model => model.priced)
      ? rounded(models.reduce((sum, model) => sum + (model.estimatedCostUsd || 0), 0))
      : models.length || unattributed.unattributedInputTokens || unattributed.unattributedOutputTokens ? null : 0,
    hasUnpricedModels: models.some(model => !model.priced || model.pricingPartial),
    hasUnattributedUsage: unattributed.unattributedRequestCount > 0,
    calibratedToOfficialUsage: matchedDays > 0,
    calibrationMethod: "legacy-daily",
    calibrationMatchedDays: matchedDays, calibrationUncoveredDays: uncoveredDays,
    rawLocalInputTokens: rawInput, calibratedInputTokens: calibratedInput,
    calibratedNativeInputTokens: calibratedInput - independentInput,
    independentInputTokens: independentInput,
    calibrationAdjustedInputTokens: adjusted,
    replayExcludedInputTokens: adjusted, // Legacy field name; adjustment is not replay proof.
    officialUnmappedInputTokens: Math.max(0, count(accountUsage?.lifetimeTokens) - Math.max(0, nativeDatedInput - adjusted)),
    rawUndatedInputTokens: Math.max(0, rawInput - datedInput)
  };
}

module.exports = { calibrateCostSnapshot };

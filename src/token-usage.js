const MAX_DAILY_BUCKETS = 10_000;

function normalizeCount(value) {
  if (!Number.isFinite(value) || value < 0) return null;
  return Math.min(Number.MAX_SAFE_INTEGER, Math.floor(value));
}

function parseDateKey(value) {
  const match = String(value || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) return null;
  return match[0];
}

function dateFromKey(key) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function dateKey(date) {
  return date.toISOString().slice(0, 10);
}

function addUtcDays(key, days) {
  const date = dateFromKey(key);
  date.setUTCDate(date.getUTCDate() + days);
  return dateKey(date);
}

function normalizeDailyBuckets(value) {
  if (!Array.isArray(value)) return [];
  const totals = new Map();
  for (const bucket of value) {
    const startDate = parseDateKey(bucket?.startDate);
    const tokens = normalizeCount(bucket?.tokens);
    if (!startDate || tokens === null) continue;
    totals.set(
      startDate,
      Math.min(Number.MAX_SAFE_INTEGER, (totals.get(startDate) || 0) + tokens)
    );
  }
  return [...totals.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .slice(-MAX_DAILY_BUCKETS)
    .map(([startDate, tokens]) => ({ startDate, tokens }));
}

function normalizeSnapshot(value) {
  if (!value || typeof value !== "object") return null;
  const hasDailyUsageBuckets = Array.isArray(value.dailyUsageBuckets);
  const dailyUsageBuckets = normalizeDailyBuckets(value.dailyUsageBuckets);
  const derivedTotalWorkDays = hasDailyUsageBuckets
    ? dailyUsageBuckets.reduce(
        (count, bucket) => count + (bucket.tokens > 0 ? 1 : 0),
        0
      )
    : null;
  const snapshot = {
    lifetimeTokens: normalizeCount(value.lifetimeTokens),
    totalWorkDays: normalizeCount(value.totalWorkDays) ?? derivedTotalWorkDays,
    currentStreakDays: normalizeCount(value.currentStreakDays),
    longestStreakDays: normalizeCount(value.longestStreakDays),
    peakDailyTokens: normalizeCount(value.peakDailyTokens),
    longestRunningTurnSec: normalizeCount(value.longestRunningTurnSec),
    dailyUsageBuckets,
    observedAt: normalizeCount(value.observedAt)
  };
  const hasSummary = [
    snapshot.lifetimeTokens,
    snapshot.totalWorkDays,
    snapshot.currentStreakDays,
    snapshot.longestStreakDays,
    snapshot.peakDailyTokens,
    snapshot.longestRunningTurnSec
  ].some(item => item !== null);
  return hasSummary || dailyUsageBuckets.length ? snapshot : null;
}

function normalizeTokenUsageResponse(raw, previousState = {}, now = Date.now()) {
  const current = normalizeSnapshot({
    ...(raw?.summary || {}),
    dailyUsageBuckets: raw?.dailyUsageBuckets,
    observedAt: now
  });

  const cached = normalizeSnapshot(previousState?.tokenUsageSnapshot);
  // A summary-only response cannot replace the last complete dated snapshot;
  // otherwise fee calibration flickers back to unadjusted local counters.
  const missingDailyBuckets = !Array.isArray(raw?.dailyUsageBuckets);
  if (current && !(missingDailyBuckets && cached?.dailyUsageBuckets.length)) {
    return {
      available: true,
      cached: false,
      ...current,
      persistence: { tokenUsageSnapshot: current }
    };
  }

  if (cached) {
    return {
      available: true,
      cached: true,
      ...cached,
      persistence: {}
    };
  }

  return {
    available: false,
    cached: false,
    lifetimeTokens: null,
    totalWorkDays: null,
    currentStreakDays: null,
    longestStreakDays: null,
    peakDailyTokens: null,
    longestRunningTurnSec: null,
    dailyUsageBuckets: [],
    observedAt: null,
    persistence: {}
  };
}

function localTokenUsageFromCost(snapshot) {
  const add = (left, right) => Math.min(Number.MAX_SAFE_INTEGER, left + (normalizeCount(right) || 0));
  const total = row => (row.models || []).reduce((sum, model) => add(add(sum, model.inputTokens), model.outputTokens),
    add(normalizeCount(row.unattributedInputTokens) || 0, row.unattributedOutputTokens));
  const dailyUsageBuckets = normalizeDailyBuckets((snapshot.dailyUsage || []).map(row => ({ startDate: row.date, tokens: total(row) })));
  const lifetimeTokens = total(snapshot);
  const datedTokens = dailyUsageBuckets.reduce((sum, row) => add(sum, row.tokens), 0);
  return { lifetimeTokens, dailyUsageBuckets,
    totalWorkDays: dailyUsageBuckets.filter(row => row.tokens > 0).length,
    undatedTokens: Math.max(0, lifetimeTokens - datedTokens),
    truncated: Boolean(snapshot.truncated), observedAt: snapshot.observedAt };
}

function combineTokenUsage(account = {}, cost = {}) {
  const local = cost.verifiedLocalUsage || cost.localUsage;
  // Account totals can be corrected by the service and cover a different
  // population. A local ledger must never replace a valid account snapshot.
  if (account.scope !== "local" && account.available && normalizeCount(account.lifetimeTokens) !== null) {
    return { ...account, scope: "account", localUsage: cost.available ? local : null };
  }
  if (!cost.available || !local || !(local.lifetimeTokens > 0)) return { ...account, scope: account.scope || "account" };
  return { ...account, ...local, available: true, cached: Boolean(cost.cached), scope: "local",
    localUsage: local,
    currentStreakDays: null, longestStreakDays: null, longestRunningTurnSec: null,
    peakDailyTokens: local.dailyUsageBuckets.reduce((peak, row) => Math.max(peak, row.tokens), 0),
    accountLifetimeTokens: account.scope === "local" ? account.accountLifetimeTokens : account.lifetimeTokens,
    accountWorkDays: account.scope === "local" ? account.accountWorkDays : account.totalWorkDays,
    accountCached: account.scope === "local" ? account.accountCached : Boolean(account.cached),
    persistence: account.persistence || {} };
}

function startOfWeek(key) {
  const date = dateFromKey(key);
  const day = date.getUTCDay();
  date.setUTCDate(date.getUTCDate() - (day === 0 ? 6 : day - 1));
  return dateKey(date);
}

function startOfMonth(key) {
  return `${key.slice(0, 7)}-01`;
}

function addUtcMonths(key, months) {
  const date = dateFromKey(key);
  date.setUTCMonth(date.getUTCMonth() + months, 1);
  return dateKey(date);
}

function aggregateTokenUsage(value, period = "day") {
  const buckets = normalizeDailyBuckets(value);
  if (!buckets.length) return [];
  const mode = ["day", "week", "month"].includes(period) ? period : "day";
  const grouped = new Map();

  for (const bucket of buckets) {
    const key = mode === "week"
      ? startOfWeek(bucket.startDate)
      : (mode === "month" ? startOfMonth(bucket.startDate) : bucket.startDate);
    grouped.set(
      key,
      Math.min(Number.MAX_SAFE_INTEGER, (grouped.get(key) || 0) + bucket.tokens)
    );
  }

  const keys = [...grouped.keys()].sort();
  const output = [];
  let cursor = keys[0];
  const last = keys.at(-1);
  while (cursor <= last && output.length <= MAX_DAILY_BUCKETS) {
    output.push({ startDate: cursor, tokens: grouped.get(cursor) || 0 });
    cursor = mode === "month"
      ? addUtcMonths(cursor, 1)
      : addUtcDays(cursor, mode === "week" ? 7 : 1);
  }
  return output;
}

const api = {
  aggregateTokenUsage,
  normalizeDailyBuckets,
  normalizeTokenUsageResponse,
  localTokenUsageFromCost,
  combineTokenUsage,
  parseDateKey
};

if (typeof module !== "undefined" && module.exports) module.exports = api;
if (typeof window !== "undefined") window.TokenUsage = api;

// Two accounting views shared by the main process (validation) and renderer.
// Official: account Token total priced at the blended rate of locally priced
// native OpenAI calls. Combined: local Codex ledger plus user-entered usage.
(function exposeUsageLedgers(root) {
  const MAX_ENTRIES = 500;
  const MAX_TOKENS = 1e15;
  const MAX_PRICE = 10000;
  const DEFAULTS = Object.freeze({ inputShare: 75, cacheHitRate: 50 });
  const UNITS = { k: 1e3, m: 1e6, b: 1e9, g: 1e9, t: 1e12, "千": 1e3, "万": 1e4, "百万": 1e6, "亿": 1e8 };

  const finite = value => Number.isFinite(value) ? value : null;
  const round6 = value => Math.round((value + Math.max(1, Math.abs(value)) * Number.EPSILON) * 1e6) / 1e6;
  const sum = (rows, key) => rows.reduce((total, row) => total + (Number.isFinite(row?.[key]) && row[key] > 0 ? row[key] : 0), 0);

  function parseAmount(value) {
    if (typeof value === "number") return Number.isFinite(value) && value >= 0 ? value : null;
    const text = String(value ?? "").trim().replace(/[,，\s_]/g, "").toLowerCase();
    const match = text.match(/^(\d+(?:\.\d+)?)(k|m|b|g|t|千|万|百万|亿)?$/);
    if (!match) return null;
    const result = Number(match[1]) * (match[2] ? UNITS[match[2]] : 1);
    return Number.isFinite(result) ? result : null;
  }

  function tokenCount(value) {
    if (value === null || value === undefined || value === "") return null;
    const amount = parseAmount(value);
    return amount === null ? null : Math.min(MAX_TOKENS, Math.round(amount));
  }

  function unitPrice(value) {
    if (value === null || value === undefined || value === "") return null;
    const amount = parseAmount(value);
    return amount === null || amount > MAX_PRICE ? null : round6(amount);
  }

  function percent(value, fallback) {
    if (value === null || value === undefined || value === "") return fallback;
    const amount = parseAmount(value);
    return amount === null || amount > 100 ? fallback : Math.round(amount * 10) / 10;
  }

  function label(value, max) {
    return String(value ?? "").replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, max);
  }

  function timestamp(value) {
    return Number.isFinite(value) && value > 0 && value < 8.64e15 ? Math.floor(value) : null;
  }

  function normalizeDefaults(value = {}) {
    return {
      inputShare: percent(value?.inputShare, DEFAULTS.inputShare),
      cacheHitRate: percent(value?.cacheHitRate, DEFAULTS.cacheHitRate)
    };
  }

  function normalizeEntry(value) {
    if (!value || typeof value !== "object") return null;
    const provider = label(value.provider, 60);
    const model = label(value.model, 80);
    if (!provider || !model) return null;
    const mode = value.mode === "estimate" ? "estimate" : "exact";
    const entry = {
      id: typeof value.id === "string" && /^[a-z0-9-]{6,64}$/.test(value.id) ? value.id : null,
      provider, model, mode,
      inputTokens: null, cachedInputTokens: null, outputTokens: null, totalTokens: null,
      inputShare: null, cacheHitRate: percent(value.cacheHitRate, null),
      requestCount: tokenCount(value.requestCount),
      inputPrice: unitPrice(value.inputPrice),
      cachedPrice: unitPrice(value.cachedPrice),
      outputPrice: unitPrice(value.outputPrice),
      createdAt: timestamp(value.createdAt),
      updatedAt: timestamp(value.updatedAt)
    };
    if (mode === "estimate") {
      entry.totalTokens = tokenCount(value.totalTokens);
      entry.inputShare = percent(value.inputShare, null);
      if (!(entry.totalTokens > 0)) return null;
    } else {
      entry.inputTokens = tokenCount(value.inputTokens) ?? 0;
      entry.outputTokens = tokenCount(value.outputTokens) ?? 0;
      const cached = tokenCount(value.cachedInputTokens);
      // Blank cache means "unknown": priced with the shared hit-rate default.
      entry.cachedInputTokens = cached === null ? null : Math.min(entry.inputTokens, cached);
      if (!(entry.inputTokens + entry.outputTokens > 0)) return null;
    }
    return entry;
  }

  function entryId(entry, index) {
    return "m-" + (entry.createdAt || 1).toString(36) + "-" + index.toString(36);
  }

  function normalizeManualLedger(value) {
    const entries = [];
    const seen = new Set();
    const source = Array.isArray(value?.entries) ? value.entries.slice(0, MAX_ENTRIES) : [];
    for (const item of source) {
      const entry = normalizeEntry(item);
      if (!entry) continue;
      if (!entry.id || seen.has(entry.id)) entry.id = entryId(entry, entries.length);
      seen.add(entry.id);
      entries.push(entry);
    }
    return { version: 1, defaults: normalizeDefaults(value?.defaults), entries };
  }

  function resolveEntry(entry, defaults = DEFAULTS) {
    const shared = normalizeDefaults(defaults);
    const estimated = entry.mode === "estimate";
    const inputShare = estimated ? entry.inputShare ?? shared.inputShare : null;
    const inputTokens = estimated ? Math.round(entry.totalTokens * inputShare / 100) : entry.inputTokens;
    const outputTokens = estimated ? entry.totalTokens - inputTokens : entry.outputTokens;
    const cacheEstimated = estimated || entry.cachedInputTokens === null;
    const hitRateUsed = cacheEstimated ? entry.cacheHitRate ?? shared.cacheHitRate : null;
    const cachedInputTokens = cacheEstimated
      ? Math.round(inputTokens * hitRateUsed / 100)
      : Math.min(inputTokens, entry.cachedInputTokens);
    const priced = entry.inputPrice !== null && entry.outputPrice !== null;
    // Unknown cache-read prices are charged at the input rate, never as free.
    const cachedRate = entry.cachedPrice ?? entry.inputPrice;
    const estimatedCostUsd = priced
      ? round6(((inputTokens - cachedInputTokens) * entry.inputPrice + cachedInputTokens * cachedRate +
        outputTokens * entry.outputPrice) / 1e6)
      : null;
    return {
      id: entry.id, provider: entry.provider, model: entry.model, mode: entry.mode,
      inputTokens, cachedInputTokens, outputTokens, totalTokens: inputTokens + outputTokens,
      hitRate: inputTokens ? cachedInputTokens / inputTokens * 100 : 0,
      inputShareUsed: inputShare, hitRateUsed, estimated, cacheEstimated, priced, estimatedCostUsd,
      cachedPriceAssumed: priced && entry.cachedPrice === null && cachedInputTokens > 0,
      requestCount: entry.requestCount, entry
    };
  }

  function isNativeModel(model) {
    return model?.pricing?.vendor === "OpenAI" || Boolean(model?.accountCalibrated);
  }

  function modelStatus(model) {
    if (model.priced) return "priced";
    if (model.missingPriceComponents?.length) return "rate";
    return model.pricingPending ? "pending" : "unpriced";
  }

  function summarizeLedgers(usage = {}, cost = {}, manual = {}) {
    const ledger = normalizeManualLedger(manual);
    const models = cost?.available && Array.isArray(cost.models)
      ? cost.models.filter(model => model?.model && model.model !== "unknown")
      : [];
    const accountTokens = finite(usage?.scope === "local" ? usage.accountLifetimeTokens : usage?.lifetimeTokens);
    const accountDays = finite(usage?.scope === "local" ? usage.accountWorkDays : usage?.totalWorkDays);
    const native = models.filter(model => isNativeModel(model) && model.priced && Number.isFinite(model.estimatedCostUsd));
    const nativeTokens = sum(native, "inputTokens") + sum(native, "outputTokens");
    const ratePerMillion = nativeTokens > 0 ? sum(native, "estimatedCostUsd") / nativeTokens * 1e6 : null;
    const officialCost = accountTokens !== null && ratePerMillion !== null ? round6(accountTokens * ratePerMillion / 1e6) : null;
    const official = {
      available: accountTokens !== null,
      cached: Boolean(usage?.scope === "local" ? usage.accountCached : usage?.cached),
      tokens: accountTokens, workDays: accountDays, costUsd: officialCost,
      ratePerMillion: ratePerMillion === null ? null : round6(ratePerMillion),
      basisModels: native.length,
      dailyTokens: accountTokens !== null && accountDays > 0 ? accountTokens / accountDays : null,
      dailyCostUsd: officialCost !== null && accountDays > 0 ? officialCost / accountDays : null
    };

    const entries = ledger.entries.map(entry => resolveEntry(entry, ledger.defaults));
    const codexInput = sum(models, "inputTokens") + (finite(cost?.unattributedInputTokens) || 0);
    const codexCached = sum(models, "cachedInputTokens") + (finite(cost?.unattributedCachedInputTokens) || 0);
    const codexOutput = sum(models, "outputTokens") + (finite(cost?.unattributedOutputTokens) || 0);
    const codexCost = cost?.available && Number.isFinite(cost.estimatedCostUsd) ? cost.estimatedCostUsd : null;
    const pricedEntries = entries.filter(entry => entry.priced);
    const manualCost = pricedEntries.length ? round6(sum(pricedEntries, "estimatedCostUsd")) : null;
    const inputTokens = codexInput + sum(entries, "inputTokens");
    const cachedInputTokens = codexCached + sum(entries, "cachedInputTokens");
    const outputTokens = codexOutput + sum(entries, "outputTokens");
    const combined = {
      available: Boolean(cost?.available) || entries.length > 0,
      tokens: inputTokens + outputTokens, inputTokens, cachedInputTokens, outputTokens,
      hitRate: inputTokens ? cachedInputTokens / inputTokens * 100 : null,
      costUsd: codexCost === null && manualCost === null ? null : round6((codexCost || 0) + (manualCost || 0)),
      codex: { tokens: codexInput + codexOutput, costUsd: codexCost, models: models.length },
      manual: { tokens: sum(entries, "totalTokens"), costUsd: manualCost, count: entries.length,
        unpriced: entries.length - pricedEntries.length,
        estimatedTokens: sum(entries.filter(entry => entry.estimated || entry.cacheEstimated), "totalTokens") },
      partial: Boolean(cost?.hasUnpricedModels || cost?.hasUnattributedUsage || cost?.truncated) ||
        entries.length > pricedEntries.length
    };

    const composition = [
      ...models.map(model => ({
        key: "codex:" + model.model, label: model.model, group: model.pricing?.vendor || "Codex", kind: "codex",
        tokens: (finite(model.inputTokens) || 0) + (finite(model.outputTokens) || 0),
        costUsd: model.priced && Number.isFinite(model.estimatedCostUsd) ? model.estimatedCostUsd : null,
        status: modelStatus(model), estimated: false
      })),
      ...entries.map(entry => ({
        key: "manual:" + entry.id, label: entry.model, group: entry.provider, kind: "manual",
        tokens: entry.totalTokens, costUsd: entry.estimatedCostUsd,
        status: entry.priced ? "priced" : "unpriced", estimated: entry.estimated || entry.cacheEstimated
      }))
    ].sort((a, b) => (b.costUsd ?? -1) - (a.costUsd ?? -1) || b.tokens - a.tokens || a.label.localeCompare(b.label));

    const measuredInput = sum(models, "inputTokens");
    const measuredOutput = sum(models, "outputTokens");
    const measuredDefaults = measuredInput + measuredOutput > 0 ? {
      inputShare: Math.round(measuredInput / (measuredInput + measuredOutput) * 1000) / 10,
      cacheHitRate: measuredInput ? Math.round(sum(models, "cachedInputTokens") / measuredInput * 1000) / 10 : 0
    } : null;

    return { official, combined, composition, entries, defaults: ledger.defaults, measuredDefaults };
  }

  const api = { DEFAULTS, MAX_ENTRIES, parseAmount, normalizeEntry, normalizeManualLedger, normalizeDefaults,
    resolveEntry, summarizeLedgers, isNativeModel };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root && typeof root === "object") root.UsageLedgers = api;
})(typeof window !== "undefined" ? window : null);

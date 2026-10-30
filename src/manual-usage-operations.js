// Provider/model views and explicit mutations over the existing v1 ledger.
// Increment batches retain their own prices; replacement is an explicit reset.
(function exposeManualUsage(root) {
  const usage = typeof module !== "undefined" && module.exports ? require("./usage-ledgers") : root.UsageLedgers;
  const nameKey = value => String(value ?? "").trim().toLowerCase();
  const identity = (provider, model) => JSON.stringify([nameKey(provider), nameKey(model)]);
  const sum = (rows, field) => rows.reduce((total, row) => total + (row[field] ?? 0), 0);
  const round6 = value => Math.round(value * 1e6) / 1e6;
  const fail = code => { throw new Error("MANUAL_" + code); };

  function groupManualUsage(value) {
    const ledger = usage.normalizeManualLedger(value), providers = new Map();
    for (const entry of ledger.entries) {
      const providerKey = nameKey(entry.provider);
      if (!providers.has(providerKey)) providers.set(providerKey, { key: providerKey, provider: entry.provider, models: [] });
      const provider = providers.get(providerKey), key = identity(entry.provider, entry.model);
      let model = provider.models.find(item => item.key === key);
      if (!model) { model = { key, id: entry.id, provider: entry.provider, model: entry.model, entries: [] }; provider.models.push(model); }
      model.entries.push(entry);
    }
    for (const provider of providers.values()) {
      for (const model of provider.models) {
        const rows = model.entries, resolved = rows.map(entry => usage.resolveEntry(entry, ledger.defaults));
        for (const field of ["inputTokens", "cachedInputTokens", "cacheWriteInputTokens", "outputTokens", "totalTokens"]) model[field] = sum(resolved, field);
        model.estimated = resolved.some(row => row.estimated);
        model.cacheEstimated = resolved.some(row => row.cacheEstimated);
        model.priced = resolved.every(row => row.priced);
        model.partial = !model.priced;
        model.estimatedCostUsd = resolved.some(row => row.priced) ? round6(sum(resolved, "estimatedCostUsd")) : null;
        model.cachedPriceAssumed = resolved.some(row => row.cachedPriceAssumed);
        model.revision = JSON.stringify({ defaults: ledger.defaults, entries: rows });
        const blend = (field, weight) => {
          const weights = resolved.map(weight), total = weights.reduce((a, b) => a + b, 0);
          const rates = rows.map(row => field === "cachedPrice" ? row.cachedPrice ?? row.inputPrice : row[field]);
          if (weights.some((amount, i) => amount > 0 && rates[i] === null)) return null;
          return total ? round6(weights.reduce((amount, count, i) => amount + count * (rates[i] ?? 0), 0) / total) : rows[rows.length - 1][field];
        };
        model.draft = rows.length === 1 ? { ...rows[0] } : usage.normalizeEntry({
          provider: model.provider, model: model.model, mode: model.estimated ? "estimate" : "exact",
          inputTokens: model.inputTokens, cachedInputTokens: model.cacheEstimated ? null : model.cachedInputTokens,
          outputTokens: model.outputTokens, totalTokens: model.totalTokens,
          cacheWriteInputTokens: model.cacheWriteInputTokens,
          cacheWritePrice: blend("cacheWritePrice", row => row.cacheWriteInputTokens),
          inputShare: model.totalTokens ? model.inputTokens / model.totalTokens * 100 : 0,
          cacheHitRate: model.inputTokens ? model.cachedInputTokens / model.inputTokens * 100 : 0,
          requestCount: rows.every(row => row.requestCount !== null) ? sum(rows, "requestCount") : null,
          inputPrice: blend("inputPrice", row => row.inputTokens - row.cachedInputTokens - row.cacheWriteInputTokens),
          cachedPrice: rows.every(row => row.cachedPrice === null) ? null : blend("cachedPrice", row => row.cachedInputTokens),
          outputPrice: blend("outputPrice", row => row.outputTokens)
        });
      }
      provider.totalTokens = sum(provider.models, "totalTokens");
      provider.estimatedCostUsd = provider.models.some(model => model.estimatedCostUsd !== null)
        ? round6(sum(provider.models, "estimatedCostUsd")) : null;
      provider.partial = provider.models.some(model => model.partial);
    }
    return [...providers.values()];
  }

  function validateInput(value) {
    if (!value || typeof value !== "object") fail("INVALID");
    const counts = value.mode === "estimate" ? ["totalTokens", "requestCount"] : ["inputTokens", "cachedInputTokens", "cacheWriteInputTokens", "outputTokens", "requestCount"];
    for (const [fields, maximum] of [[counts, 1e15], [["inputPrice", "cachedPrice", "cacheWritePrice", "outputPrice"], 10000], [["inputShare", "cacheHitRate"], 100]]) {
      for (const field of fields) {
        if (value[field] === null || value[field] === undefined || value[field] === "") continue;
        const amount = usage.parseAmount(value[field]);
        if (amount === null || amount > maximum) fail("INVALID");
      }
    }
    if (value.mode !== "estimate" && usage.parseAmount(value.cachedInputTokens) > (usage.parseAmount(value.inputTokens) ?? 0)) fail("INVALID");
    const entry = usage.normalizeEntry(value);
    if (!entry) fail("INVALID");
    return entry;
  }

  function applyManualUsageChange(value, change, options = {}) {
    if (!change || typeof change !== "object") fail("INVALID");
    if (value?.entries?.length > usage.MAX_ENTRIES) fail("LIMIT");
    const ledger = usage.normalizeManualLedger(value);
    if (change.action === "defaults") {
      if (!change.defaults || Object.keys(change.defaults).some(key => !["inputShare", "cacheHitRate"].includes(key))) fail("INVALID");
      for (const amount of Object.values(change.defaults)) if (usage.parseAmount(amount) === null || usage.parseAmount(amount) > 100) fail("INVALID");
      return { ...ledger, defaults: usage.normalizeDefaults({ ...ledger.defaults, ...change.defaults }) };
    }
    if (!["create", "replace", "increment", "remove"].includes(change.action)) fail("INVALID");
    const models = groupManualUsage(ledger).flatMap(provider => provider.models);
    const target = change.targetId ? models.find(model => model.entries.some(entry => entry.id === change.targetId)) : null;
    if (change.action !== "create" && (!target || change.revision !== target.revision)) fail("CONFLICT");
    const ids = new Set(target?.entries.map(entry => entry.id) || []);
    if (change.action === "remove") return { ...ledger, entries: ledger.entries.filter(entry => !ids.has(entry.id)) };
    const entry = validateInput(change.entry), key = identity(entry.provider, entry.model);
    if (change.action === "increment" && key !== target.key) fail("INVALID");
    if (models.some(model => model.key === key && model !== target)) fail("DUPLICATE");
    const now = options.now || Date.now();
    entry.id = options.id || `m-${now.toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    entry.createdAt = now; entry.updatedAt = now;
    const entries = ledger.entries.slice();
    if (change.action === "replace") {
      const fields = row => JSON.stringify({ ...row, id: null, createdAt: null, updatedAt: null });
      if (fields(entry) === fields(target.draft)) return ledger;
      entry.id = target.id;
      entry.createdAt = Math.min(...target.entries.map(row => row.createdAt || now));
      const index = entries.findIndex(row => ids.has(row.id));
      return { ...ledger, entries: [...entries.slice(0, index), entry, ...entries.slice(index).filter(row => !ids.has(row.id))] };
    }
    if (change.action === "increment") {
      if (![target.inputTokens + (usage.resolveEntry(entry, ledger.defaults).inputTokens), target.outputTokens + usage.resolveEntry(entry, ledger.defaults).outputTokens].every(Number.isSafeInteger)) fail("INVALID");
      // Exact batches with identical rates can accumulate without using another
      // ledger slot; estimated or differently priced batches remain independent.
      const merge = target.entries.find(row => row.mode === "exact" && entry.mode === "exact" &&
        row.cachedInputTokens !== null && entry.cachedInputTokens !== null &&
        (row.requestCount === null) === (entry.requestCount === null) &&
        ["inputPrice", "cachedPrice", "cacheWritePrice", "outputPrice"].every(field => row[field] === entry[field]) &&
        ["inputTokens", "outputTokens", "requestCount"].every(field => (row[field] || 0) + (entry[field] || 0) <= 1e15));
      if (merge) {
        const updated = { ...merge, updatedAt: now };
        for (const field of ["inputTokens", "cachedInputTokens", "cacheWriteInputTokens", "outputTokens"]) updated[field] += entry[field];
        updated.requestCount = merge.requestCount === null || entry.requestCount === null ? null : merge.requestCount + entry.requestCount;
        entries[entries.findIndex(row => row.id === merge.id)] = updated;
        return { ...ledger, entries };
      }
    }
    if (entries.length >= usage.MAX_ENTRIES) fail("LIMIT");
    entries.push(entry);
    return { ...ledger, entries };
  }

  const api = { identity, nameKey, groupManualUsage, applyManualUsageChange };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) root.ManualUsage = api;
})(typeof window !== "undefined" ? window : null);

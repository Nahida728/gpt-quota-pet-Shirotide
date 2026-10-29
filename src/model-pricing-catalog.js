// USD / million text tokens, Standard/global API equivalents. Checked 2026-10-28.
// No gateway markup, subscription charge, tool fee or cache-storage time is inferred.
const PRICING_DATE = "2026-10-28";
const SOURCES = Object.freeze({
  OpenAI: "https://developers.openai.com/api/docs/pricing",
  Anthropic: "https://platform.claude.com/docs/en/about-claude/pricing",
  Google: "https://ai.google.dev/gemini-api/docs/pricing",
  xAI: "https://docs.x.ai/developers/pricing",
  DeepSeek: "https://api-docs.deepseek.com/quick_start/pricing/",
  "Z.AI": "https://docs.z.ai/guides/overview/pricing",
  MiniMax: "https://platform.minimax.io/docs/pricing/overview",
  Qwen: "https://docs.qwencloud.com/developer-guides/getting-started/model-prices"
});
const catalog = {};
function add(names, vendor, input, cachedInput, output, options = {}) {
  for (const model of names.split(" ")) catalog[model] = Object.freeze({
    input, cachedInput, output, cacheWrite: input, vendor, source: SOURCES[vendor], ...options
  });
}
const context = (threshold, input = 2, output = 1.5, inclusive = false) => ({
  contextThreshold: threshold, contextInputMultiplier: input, contextOutputMultiplier: output, contextInclusive: inclusive
});

add("gpt-6.1-terra", "OpenAI", 1, .05, 5, { cacheWrite: 1.25, cacheWriteLong: 2.5, ...context(272000) });
add("gpt-5.4-nano", "OpenAI", .2, .02, 1.25);
add("gpt-5.5-pro gpt-5.4-pro", "OpenAI", 30, null, 180, { cacheWrite: null, ...context(272000) });
add("gpt-5.2-pro", "OpenAI", 21, null, 168, { cacheWrite: null });
add("gpt-5-pro", "OpenAI", 15, null, 120, { cacheWrite: null });
add("gpt-5-mini", "OpenAI", .25, .025, 2);
add("gpt-5-nano", "OpenAI", .05, .005, .4);
add("gpt-4.1", "OpenAI", 2, .5, 8);
add("gpt-4.1-mini", "OpenAI", .4, .1, 1.6);
add("gpt-4.1-nano", "OpenAI", .1, .025, .4);
add("gpt-4o", "OpenAI", 2.5, 1.25, 10);
add("gpt-4o-2024-05-13", "OpenAI", 5, null, 15);
add("gpt-4o-mini", "OpenAI", .15, .075, .6);
add("o1", "OpenAI", 15, 7.5, 60);
add("o1-pro", "OpenAI", 150, null, 600);
add("o3-pro", "OpenAI", 20, null, 80);
add("o3", "OpenAI", 2, .5, 8);
add("o3-mini", "OpenAI", 1.1, .55, 4.4);
add("o4-mini", "OpenAI", 1.1, .275, 4.4);
add("gpt-4-turbo-2024-04-09", "OpenAI", 10, null, 30);
add("gpt-4-0613", "OpenAI", 30, null, 60);
add("gpt-3.5-turbo gpt-3.5-turbo-0125", "OpenAI", .5, null, 1.5);
add("gpt-5.6-cyber", "OpenAI", 12.5, 1.25, 75, { cacheWrite: 15.625, cacheWriteLong: 31.25 });
add("gpt-rosalind-research gpt-rosalind-discovery", "OpenAI", 5, .5, 25);
add("chat-latest", "OpenAI", 5, .5, 30);

function claude(names, input, cached, output, options = {}) {
  add(names, "Anthropic", input, cached, output, { cacheWrite: input * 1.25, cacheWriteLong: input * 2, ...options });
}
claude("claude-fable-5-1 claude-mythos-5-1", 10, .25, 50);
claude("claude-fable-5 claude-mythos-5", 10, 1, 50);
claude("claude-opus-5-5", 4, .2, 20);
claude("claude-opus-5-5-fast", 8, .4, 40);
claude("claude-sonnet-5-5", 2, .1, 10);
claude("claude-haiku-5-5", .1, .01, .5, context(100000, 5, 5));
claude("claude-opus-5 claude-opus-4-8 claude-opus-4-7 claude-opus-4-6 claude-opus-4-5", 5, .5, 25);
claude("claude-opus-5-fast claude-opus-4-8-fast", 10, 1, 50);
claude("claude-opus-4-1 claude-opus-4", 15, 1.5, 75);
claude("claude-sonnet-5", 2, .2, 10);
claude("claude-sonnet-4-6 claude-sonnet-4-5 claude-sonnet-4", 3, .3, 15);
claude("claude-haiku-4-5", 1, .1, 5);
claude("claude-3-5-haiku", .8, .08, 4);
// Historical Sonnet text rates: https://www.anthropic.com/news/claude-3-7-sonnet
claude("claude-3-7-sonnet claude-3-5-sonnet", 3, .3, 15);

add("gemini-4-argon", "Google", 2, .1, 10, { scheduledRates: { startsAt: "2026-12-01", input: 4, cachedInput: .2, cacheWrite: 4, output: 20 }, note: "promotion" });
add("gemini-3.8-flash", "Google", .75, .075, 3.75, { scheduledRates: { startsAt: "2027-01-01", input: 1.5, cachedInput: .15, cacheWrite: 1.5, output: 7.5 }, note: "promotion" });
add("gemini-3.5-flash-lite", "Google", .3, .03, 2.5);
add("gemini-3.1-flash-lite", "Google", .25, .025, 1.5);
add("gemini-3.1-pro-preview gemini-3.1-pro-preview-customtools", "Google", 2, .2, 12, context(200000));

add("grok-4.7 grok-4.6", "xAI", 2, .5, 6, context(200000, 2, 2, true));
add("grok-4.7-fast", "xAI", 4, 1, 12, context(200000, 1.5, 1.5));
add("grok-4.5", "xAI", 2, .3, 6, context(200000, 2, 2, true));
add("grok-4.3 grok-4.20-multi-agent-0309 grok-4.20-0309-reasoning grok-4.20-0309-non-reasoning", "xAI", 1.25, .2, 2.5, context(200000, 2, 2, true));
add("grok-build-0.1", "xAI", 1, .2, 2, context(200000, 2, 2, true));

// DeepSeek peak list rates are the explicit equivalent basis; off-peak and
// public-holiday discounts are not inferred for unknown gateway billing zones.
add("deepseek-v4-pro", "DeepSeek", 1.32, .044, 3.96, { note: "peak" });
add("deepseek-flash deepseek-v4.1-flash", "DeepSeek", .3, .006, 1.2, { note: "peak" });
add("deepseek-v4-flash", "DeepSeek", .3, .006, 1.2, { note: "peak" });
add("glm-5.3-flashx glm-5.3-flashx-legal", "Z.AI", .37, .075, 1.25);
add("glm-5.1", "Z.AI", 1.4, .26, 4.4);
add("glm-5", "Z.AI", 1, .2, 3.2);
add("glm-4.7 glm-4.6", "Z.AI", .6, .11, 2.2);
add("minimax-m3", "MiniMax", .3, .06, 1.2, context(512000, 2, 2));
add("minimax-m3.1-flash", "MiniMax", .15, .015, .6);
// Global Qwen USD basis; regional and reseller prices can differ.
add("qwen3.8-flash", "Qwen", .113, null, .382, { cacheWrite: null, note: "global" });

const ADDITIONAL_MODEL_PRICING = Object.freeze(catalog);
const suffix = "(?:-(?:latest|thinking|free|preview|\\d{8}|\\d{4}-\\d{2}-\\d{2}|\\d{4}))*(?:-v\\d+:\\d+)?";
const routed = Object.keys(catalog).filter(key => catalog[key].vendor !== "OpenAI").sort((a,b) => b.length-a.length)
  .map(key => [new RegExp("^(?:.*[/_.:-])?" + key.replace(/[.\-]/g, "[-_.]") + suffix + "$"), key]);
function catalogModelName(value) {
  for (const [pattern, key] of routed) if (pattern.test(value)) return key;
  return null;
}
function pricingShape(pricing) {
  return JSON.stringify([pricing.contextThreshold ?? (pricing.longContext ? 272000 : null),
    pricing.contextInputMultiplier ?? 2, pricing.contextOutputMultiplier ?? 1.5, Boolean(pricing.contextInclusive)]);
}
function effectivePricing(pricing, now = Date.now()) {
  const scheduled = pricing?.scheduledRates;
  return scheduled && now >= Date.parse(scheduled.startsAt + "T00:00:00Z") ? { ...pricing, ...scheduled } : pricing;
}
const UNIT_KEYS = ["input", "cached", "write", "writeLong", "output"];
function normalizePricingUnits(value) {
  if (!value || !UNIT_KEYS.every(key => Number.isFinite(value[key]) && value[key] >= 0 && value[key] <= Number.MAX_SAFE_INTEGER)) return null;
  return Object.fromEntries(UNIT_KEYS.map(key => [key, value[key]]));
}
function priceUnits(pricing, units) {
  const rates = { input: pricing.input, cached: pricing.cachedInput, write: pricing.cacheWrite,
    writeLong: Object.hasOwn(pricing, "cacheWriteLong") ? pricing.cacheWriteLong : pricing.cacheWrite, output: pricing.output };
  if (UNIT_KEYS.some(key => units[key] > 0 && !Number.isFinite(rates[key]))) return null;
  return UNIT_KEYS.reduce((sum, key) => sum + units[key] * (rates[key] || 0), 0) / 1e6;
}
function usagePricingUnits(pricing, usage) {
  const threshold = pricing.contextThreshold ?? (pricing.longContext ? 272000 : null);
  const long = threshold !== null && (pricing.contextInclusive ? usage.inputTokens >= threshold : usage.inputTokens > threshold);
  const inputMultiplier = long ? pricing.contextInputMultiplier ?? 2 : 1;
  const outputMultiplier = long ? pricing.contextOutputMultiplier ?? 1.5 : 1;
  const units = { input: Math.max(0, usage.inputTokens - usage.cachedInputTokens - usage.cacheWriteInputTokens) * inputMultiplier,
    cached: usage.cachedInputTokens * inputMultiplier,
    write: (usage.cacheWriteInputTokens - (usage.cacheWriteLongInputTokens || 0)) * inputMultiplier,
    writeLong: (usage.cacheWriteLongInputTokens || 0) * inputMultiplier, output: usage.outputTokens * outputMultiplier };
  return { units, isLongContext: long };
}
module.exports = { ADDITIONAL_MODEL_PRICING, PRICING_DATE, SOURCES, catalogModelName, pricingShape, effectivePricing,
  normalizePricingUnits, priceUnits, usagePricingUnits, UNIT_KEYS };

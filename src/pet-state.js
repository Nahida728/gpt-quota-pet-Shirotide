// Small, numeric-only projection. Pet presentation never owns usage/history.
const PET_ART = require("./renderer/assets/gpt-pet.json");
const DEFAULT_PET_SETTINGS = Object.freeze({ size: 256, alwaysOnTop: true, bubbles: true, sound: true });
const { nextChatterIndex } = require("./pet-chatter");
const integer = (value, fallback, min, max) => Number.isFinite(value) ? Math.round(Math.max(min, Math.min(max, value))) : fallback;

function normalizePetSettings(value = {}) {
  return { size: integer(value?.size, 256, 160, 352),
    alwaysOnTop: typeof value?.alwaysOnTop === "boolean" ? value.alwaysOnTop : true,
    bubbles: typeof value?.bubbles === "boolean" ? value.bubbles : true,
    sound: typeof value?.sound === "boolean" ? value.sound : true };
}

function placePet(anchor, settings, displays, primary = displays[0], { snap = true } = {}) {
  const sizeRequested = normalizePetSettings(settings).size;
  const valid = anchor && Number.isFinite(anchor.x) && Number.isFinite(anchor.y);
  const display = valid && displays.find(({ workArea: a }) => anchor.x + sizeRequested > a.x && anchor.x < a.x + a.width &&
    anchor.y + sizeRequested > a.y && anchor.y < a.y + a.height) || primary;
  const a = display.workArea;
  // Fixed narrow carrier, with room above/below the character for either bubble
  // placement. Its local pet coordinates never change during drag or flight.
  const width = a.width, height = a.height;
  const bubbleWidth = Math.min(256, width - 16), bubbleHeight = bubbleWidth * 667 / 764;
  const size = Math.min(sizeRequested, Math.max(48, width - 32), Math.max(48, height - bubbleHeight - 48));
  // Size is the longest visible edge. Transparent canvas margins do not count.
  const scale = size / Math.max(PET_ART.width, PET_ART.height);
  const actorWidth = PET_ART.width * scale, actorHeight = PET_ART.height * scale;
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
  let x = clamp(valid ? anchor.x : a.x + a.width - actorWidth - 20, a.x, a.x + a.width - actorWidth);
  let y = clamp(valid ? anchor.y : a.y + a.height - actorHeight - 20, a.y, a.y + a.height - actorHeight);
  if (snap && x - a.x < 36) x = a.x;
  if (snap && a.x + a.width - x - actorWidth < 36) x = a.x + a.width - actorWidth;
  if (snap && y - a.y < 36) y = a.y;
  if (snap && a.y + a.height - y - actorHeight < 36) y = a.y + a.height - actorHeight;
  const left = x + actorWidth / 2 < a.x + a.width / 2;
  const carrierWidth = Math.ceil(Math.max(actorWidth + 64, bubbleWidth + 128));
  const actor = { x: Math.round((carrierWidth - actorWidth) / 2), y: Math.ceil(bubbleHeight + 24), width: actorWidth, height: actorHeight };
  const carrierHeight = Math.ceil(actor.y + actorHeight + bubbleHeight + 24);
  const top = y + actorHeight + bubbleHeight + 16 <= a.y + a.height;
  const savedAnchor = { x: Math.min(Math.round(x), Math.floor(a.x + a.width - actorWidth)),
    y: Math.min(Math.round(y), Math.floor(a.y + a.height - actorHeight)) };
  const originX = savedAnchor.x - actor.x;
  const bubbleX = clamp(savedAnchor.x + actorWidth / 2 - bubbleWidth / 2, a.x + 8, a.x + a.width - bubbleWidth - 8) - originX;
  const above = { x: bubbleX, y: actor.y - bubbleHeight - 8, width: bubbleWidth, height: bubbleHeight };
  const below = { ...above, y: actor.y + actorHeight + 8 };
  return { bounds: { x: savedAnchor.x - actor.x, y: savedAnchor.y - actor.y, width: carrierWidth, height: carrierHeight },
    actor, bubble: top ? below : above, bubbleSlots: [above, below].map(rect => ({ ...rect, x: 0, width: carrierWidth })),
    anchor: savedAnchor, left, top, stage: false };
}

function petShape(layout, bubbleVisible) {
  const { actor, bounds } = layout;
  const pad = 32;
  const region = [{ x: actor.x - pad, y: actor.y - pad, width: actor.width + pad * 2, height: actor.height + pad * 2 }];
  if (bubbleVisible) region.push(...(layout.bubbleSlots || [layout.bubble]).map(rect => ({ ...rect })));
  return region.map(r => {
    const x = Math.max(0, Math.floor(r.x)), y = Math.max(0, Math.floor(r.y));
    return { x, y, width: Math.min(bounds.width, Math.ceil(r.x + r.width)) - x,
      height: Math.min(bounds.height, Math.ceil(r.y + r.height)) - y };
  });
}

function petSummary(snapshot, localTasks, now = Date.now()) {
  const remote = snapshot?.activeTasks;
  const tasks = (localTasks?.observedAt || 0) > (remote?.observedAt || 0) ? localTasks : remote;
  const taskFresh = tasks?.available === true && Number.isFinite(tasks.observedAt) && now - tasks.observedAt <= 120000;
  const quota = window => Number.isFinite(window?.remainingPercent) && window.remainingPercent >= 0 && window.remainingPercent <= 100
    ? Math.round(window.remainingPercent) : null;
  const online = snapshot?.online === true;
  return { online,
    fiveHour: online ? quota(snapshot.data?.windows?.fiveHour) : null,
    fiveHourPaused: online && !snapshot.data?.windows?.fiveHour && Boolean(snapshot.data?.windows?.weekly),
    weekly: online ? quota(snapshot.data?.windows?.weekly) : null,
    reserve: online ? quota(snapshot.data?.reserve) : null,
    running: taskFresh && Number.isSafeInteger(tasks.count) && tasks.count >= 0 ? Math.min(tasks.count, 9999) : null,
    partial: !taskFresh || Boolean(tasks.truncated) };
}

// Baseline from the first complete read; never replay historical completion bubbles.
class PetNotices {
  constructor() { this.seen = new Set(); this.initialized = false; this.observedAt = 0; }
  observe(result) {
    if (!result?.available || result.truncated || !Number.isFinite(result.observedAt) || result.observedAt < this.observedAt) return null;
    this.observedAt = result.observedAt;
    const rows = Array.isArray(result.pendingTasks) ? result.pendingTasks : [];
    const fresh = rows.filter(row => typeof row?.id === "string" && row.id.length <= 256 && !this.seen.has(row.id));
    for (const row of fresh) this.seen.add(row.id);
    if (this.seen.size > 512) {
      const current = new Set(rows.map(row => row.id));
      for (const id of this.seen) { if (!current.has(id)) this.seen.delete(id); if (this.seen.size <= 384) break; }
    }
    const baseline = !this.initialized; this.initialized = true;
    const completed = fresh.filter(row => row.outcome === "completed");
    if (baseline || !completed.length) return null;
    const cost = completed.reduce((total, row) => total + (Number.isFinite(row.estimatedCostUsd) && row.estimatedCostUsd >= 0 ? row.estimatedCostUsd : 0), 0);
    return { count: completed.length, costUsd: Math.round(cost * 1e6) / 1e6 };
  }
}

module.exports = { PET_ART, DEFAULT_PET_SETTINGS, nextChatterIndex, normalizePetSettings, placePet, petShape, petSummary, PetNotices };

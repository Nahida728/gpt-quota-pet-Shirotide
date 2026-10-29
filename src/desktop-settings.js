const DEFAULT_SIZE = Object.freeze({ width: 1360, height: 900 });
const DEFAULT_APPEARANCE = Object.freeze({ fit: "contain", x: 50, y: 50, zoom: 100, blur: 0, veil: 18, cardOpacity: 80, reducedTransparency: false, allowUpscale: false });

function bounded(value, fallback, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, Number.isFinite(value) ? value : fallback));
}

function normalizeAppearance(value = {}) {
  if (!value || typeof value !== "object") value = {};
  return {
    fit: ["contain", "cover", "actual"].includes(value.fit) ? value.fit : "contain",
    x: bounded(value.x, 50, 0, 100), y: bounded(value.y, 50, 0, 100),
    zoom: bounded(value.zoom, 100, 100, 200), blur: bounded(value.blur, 0, 0, 24),
    veil: bounded(value.veil, 18, 0, 85), cardOpacity: bounded(value.cardOpacity, 80, 60, 100),
    reducedTransparency: value.reducedTransparency === true,
    allowUpscale: value.allowUpscale === true
  };
}

function restoreDesktopWindow(saved, displays, primary = displays[0]) {
  const valid = saved && [saved.x, saved.y, saved.width, saved.height].every(Number.isFinite);
  const matching = valid && displays.find(({ workArea: a }) => saved.x < a.x + a.width - 64 &&
    saved.x + saved.width > a.x + 64 && saved.y < a.y + a.height - 32 && saved.y + 32 > a.y);
  const { workArea: area } = matching || primary;
  const availableWidth = Math.max(320, area.width - 24);
  const availableHeight = Math.max(240, area.height - 24);
  const minWidth = Math.min(1000, availableWidth);
  const minHeight = Math.min(680, availableHeight);
  const width = Math.round(bounded(valid ? saved.width : undefined, DEFAULT_SIZE.width, minWidth, availableWidth));
  const height = Math.round(bounded(valid ? saved.height : undefined, DEFAULT_SIZE.height, minHeight, availableHeight));
  const x = Math.round(bounded(matching ? saved.x : undefined, area.x + (area.width - width) / 2, area.x, area.x + area.width - width));
  const y = Math.round(bounded(matching ? saved.y : undefined, area.y + (area.height - height) / 2, area.y, area.y + area.height - height));
  return { x, y, width, height, minWidth, minHeight };
}

function migrateDesktopSettings(store) {
  if (store.get("desktopSettingsVersion", 0) >= 2) return;
  // A versioned copy is kept in settings only. Never touch usage or archives.
  store.set("desktopSettingsV1", {
    windowBounds: store.get("windowBounds", null),
    windowCollapsed: store.get("windowCollapsed", false),
    topDockEnabled: store.get("topDockEnabled", false),
    positionLocked: store.get("positionLocked", false)
  });
  store.set("desktopSettingsVersion", 2);
}

module.exports = { DEFAULT_SIZE, DEFAULT_APPEARANCE, normalizeAppearance, restoreDesktopWindow, migrateDesktopSettings };

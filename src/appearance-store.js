const { normalizeAppearance } = require("./desktop-settings");
const { writeJsonAtomically } = require("./store");

function saveAppearanceSettings(store, value, opacity) {
  // This store is settings-only. Never apply this transaction to usage history.
  if (!store?.filePath || store.reconcile) throw new Error("Invalid appearance store");
  const appearance = normalizeAppearance(value);
  const backgroundOpacity = Number.isFinite(opacity) ? Math.min(.85, Math.max(.08, opacity)) : store.get("backgroundOpacity", .34);
  const next = { ...store.data, appearance, backgroundOpacity };
  writeJsonAtomically(store.filePath, next);
  store.data = next;
  return { appearance, backgroundOpacity };
}
module.exports = { saveAppearanceSettings };

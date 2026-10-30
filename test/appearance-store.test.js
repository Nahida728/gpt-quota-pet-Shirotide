const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs"), os = require("node:os"), path = require("node:path");
const { JsonStore } = require("../src/store");
const { saveAppearanceSettings } = require("../src/appearance-store");
test("appearance and opacity commit together and survive a cold read without touching other settings", t => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "cqm-appearance-"));
  t.after(() => { assert.ok(directory.startsWith(path.join(os.tmpdir(), "cqm-appearance-"))); fs.rmSync(directory, { recursive: true, force: true }); });
  const file = path.join(directory, "settings.json"), store = new JsonStore(file);
  store.set("petSettings", { size: 256 }); store.set("backgroundAsset", { displayPath: "retained.png" });
  const saved = saveAppearanceSettings(store, { cardOpacity: 64, blur: 7, x: 23, fit: "contain" }, .57);
  const cold = new JsonStore(file);
  assert.deepEqual(cold.get("appearance"), saved.appearance); assert.equal(cold.get("backgroundOpacity"), .57);
  assert.deepEqual(cold.get("petSettings"), { size: 256 }); assert.deepEqual(cold.get("backgroundAsset"), { displayPath: "retained.png" });
  const before = JSON.stringify(store.data);
  store.filePath = directory; // A directory cannot replace a settings file.
  assert.throws(() => saveAppearanceSettings(store, { cardOpacity: 95 }, .22));
  assert.equal(JSON.stringify(store.data), before);
  assert.deepEqual(new JsonStore(file).get("appearance"), saved.appearance);
});

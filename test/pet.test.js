const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { PET_ART, normalizePetSettings, placePet, petShape, petSummary, PetNotices } = require("../src/pet-state");
const display = { workArea: { x: 0, y: 0, width: 1920, height: 1040 } };

test("pet placement keeps character and hit regions visible at each edge and after monitor removal", () => {
  const second = { workArea: { x: -1280, y: -100, width: 1280, height: 800 } };
  for (const anchor of [null, { x: 2, y: 2 }, { x: 1800, y: 2 }, { x: 2, y: 1000 }, { x: 1900, y: 1040 }, { x: -1200, y: 40 }, { x: 9000, y: -5000 }]) {
    for (const size of [160, 256, 352]) {
      const layout = placePet(anchor, { size }, [display, second], display, { bubbleVisible: true });
      const a = layout.anchor.x < 0 ? second.workArea : display.workArea;
      assert.ok(Math.abs(layout.actor.width / layout.actor.height - PET_ART.width / PET_ART.height) < 1e-10, "Visible artwork keeps its original aspect ratio");
      for (const r of petShape(layout, true)) {
        assert.ok(r.x >= 0 && r.y >= 0 && r.width > 0 && r.height > 0);
        assert.ok(r.x + r.width <= layout.bounds.width && r.y + r.height <= layout.bounds.height);
      }
      for (const r of [layout.actor, layout.bubble]) {
        assert.ok(layout.bounds.x + r.x >= a.x && layout.bounds.y + r.y >= a.y);
        assert.ok(layout.bounds.x + r.x + r.width <= a.x + a.width);
        assert.ok(layout.bounds.y + r.y + r.height <= a.y + a.height);
      }
      assert.equal(petShape(layout, false).length, 1);
    }
  }
  assert.deepEqual(normalizePetSettings({ size: Infinity, sound: "yes", bubbles: false }), { size: 256, alwaysOnTop: true, bubbles: false, sound: true });
  assert.ok(placePet({ x: -1200, y: 20 }, {}, [display]).anchor.x >= 0);
  const compact = placePet(null, {}, [display]);
  assert.ok(compact.bounds.width <= 390 && compact.bounds.height < 860, "Pet keeps a fixed narrow carrier, never a full-screen surface");
  const withBubble = placePet(compact.anchor, {}, [display], display, { bubbleVisible: true });
  assert.deepEqual(compact.actor, withBubble.actor);
  assert.deepEqual(compact.bounds, withBubble.bounds, 'Bubble toggles must never resize the transparent surface');
});

test("pet summary exposes only validated numbers and never infers online from local work", () => {
  const local = { available: true, observedAt: 1000, count: 2, tasks: [{ prompt: "SECRET" }] };
  const snapshot = { online: true, activeTasks: { ...local, observedAt: 900, count: 1 },
    data: { windows: { fiveHour: null, weekly: { remainingPercent: 82 } }, reserve: null, auth: "SECRET" } };
  const result = petSummary(snapshot, local, 1100);
  assert.deepEqual(result, { online: true, fiveHour: null, fiveHourPaused: true, weekly: 82, reserve: null, running: 2, partial: false });
  assert.doesNotMatch(JSON.stringify(result), /SECRET/);
  const offline = petSummary({ ...snapshot, online: false }, local, 1100);
  assert.equal(offline.online, false); assert.equal(offline.weekly, null); assert.equal(offline.running, 2);
  assert.equal(petSummary(snapshot, local, 200000).running, null);
});

test("completion bubbles baseline first read, deduplicate and ignore incomplete/older reads and interruptions", () => {
  const notices = new PetNotices();
  const read = (at, rows, extra = {}) => ({ available: true, observedAt: at, pendingTasks: rows, ...extra });
  const old = { id: "old", outcome: "completed", estimatedCostUsd: 1 };
  assert.equal(notices.observe(read(1000, [old])), null);
  const next = { id: "next", outcome: "completed", estimatedCostUsd: .12, projectName: "SECRET" };
  assert.equal(notices.observe(read(1100, [old, next], { truncated: true })), null);
  assert.deepEqual(notices.observe(read(1200, [old, next])), { count: 1, costUsd: .12 });
  assert.equal(notices.observe(read(1200, [old, next])), null);
  assert.equal(notices.observe(read(1150, [{ ...next, id: "older" }])), null);
  assert.equal(notices.observe(read(1300, [{ id: "stop", outcome: "manual-interrupted" }])), null);
});

test("pet renderer uses its own sandbox and CSP; native gesture guards already released clicks", () => {
  const root = path.join(__dirname, "..", "src");
  const controller = fs.readFileSync(path.join(root, "pet-controller.js"), "utf8");
  const native = fs.readFileSync(path.join(root, "pet-native-move.js"), "utf8");
  const preload = fs.readFileSync(path.join(root, "pet-preload.js"), "utf8");
  assert.match(controller, /event\.sender === this\.window\.webContents/);
  assert.match(controller, /contextIsolation: true/); assert.match(controller, /nodeIntegration: false, sandbox: true/);
  assert.match(native, /GetAsyncKeyState/); assert.match(native, /readBigUInt64LE/);
  assert.doesNotMatch(native, /setInterval|setPosition|setBounds/);
  assert.doesNotMatch(preload, /readQuota|readSettings|exec|auth|shell/);
  assert.match(fs.readFileSync(path.join(root, "renderer/pet/index.html"), "utf8"), /connect-src 'none'/);
});

const path = require("node:path");
const { PET_ART, nextChatterIndex, normalizePetSettings, placePet, petShape, petSummary, PetNotices } = require("./pet-state");
const { DISPLAY_NAME } = require("./brand");
const { startPetMove, translatePet } = require("./pet-native-move");
const { releaseVelocity } = require("./pet-physics");

class PetController {
  constructor({ BrowserWindow, Menu, screen, ipcMain, store, getLanguage, getIcon, getSnapshot, getTasks,
    onEnter, onRestore, onHide, onQuit, onSettings, moveWindow = translatePet }) {
    Object.assign(this, { BrowserWindow, Menu, screen, store, getLanguage, getIcon, getSnapshot, getTasks,
      onEnter, onRestore, onHide, onQuit, onSettings, moveWindow });
    this.notices = new PetNotices(); this.bubbleSerial = 0; this.flightSerial = 0; this.active = false;
    const trusted = event => this.window && !this.window.isDestroyed() && event.sender === this.window.webContents;
    ipcMain.handle("pet:read", event => trusted(event) ? this.state() : null);
    ipcMain.handle("pet:gesture", event => trusted(event) ? this.gesture() : false);
    ipcMain.on("pet:catch", (event, point) => { if (trusted(event)) this.catch(point); });
    ipcMain.on("pet:hover", (event, hit) => { if (trusted(event) && !this.flight && !this.moving && typeof hit === "boolean") this.setPointerHit(hit); });
    ipcMain.on("pet:flight-progress", (event, value) => { if (trusted(event)) this.flightProgress(value); });
    ipcMain.on("pet:flight-hover", (event, value) => { if (trusted(event)) this.flightHover(value); });
    ipcMain.on("pet:flight-end", (event, value) => {
      if (trusted(event) && this.acceptFlightPoint(value)) { this.flushFlightPoint(); this.stopFlight(); }
    });
    ipcMain.on("pet:menu", event => { if (trusted(event)) this.menu(); });
    ipcMain.on("pet:tap", event => { if (trusted(event)) this.speak("tap"); });
    ipcMain.on("pet:interact", event => { if (trusted(event)) this.interact(); });
    ipcMain.on("pet:dismiss", event => { if (trusted(event)) this.dismiss(); });
    ipcMain.on("pet:ready", event => { if (trusted(event)) this.ready?.(); });
    this.onDisplaysChanged = () => { this.stopFlight(); if (this.layout) this.position(this.layout.anchor); };
    for (const name of ["display-added", "display-removed", "display-metrics-changed"]) screen.on(name, this.onDisplaysChanged);
  }
  preferences() { return normalizePetSettings(this.store.get("petSettings")); }
  state() {
    return { language: this.getLanguage(), preferences: this.preferences(), layout: this.layout, layoutVersion: this.layoutVersion || 0, art: PET_ART,
      summary: petSummary(this.getSnapshot(), this.getTasks()), bubble: this.bubble || null, active: this.active };
  }
  publish() {
    if (this.window && !this.window.isDestroyed() && this.loaded) {
      const title = this.getLanguage() === "en" ? "GPT-Shirotide Companion" : "GPT-白汐小宠物";
      if (this.window.getTitle() !== title) this.window.setTitle(title);
      const state = this.state();
      // Anchor reports during flight do not change the renderer's base layout.
      const signature = JSON.stringify({ ...state, layout: { ...state.layout, anchor: undefined,
        bounds: { width: state.layout.bounds.width, height: state.layout.bounds.height } } });
      if (signature === this.stateSignature) return;
      this.stateSignature = signature;
      this.window.webContents.send("pet:state", state);
    }
  }
  shape() {
    if (this.flight || !this.window || this.window.isDestroyed() || !this.layout) return;
    const region = petShape(this.layout, true), signature = JSON.stringify(region);
    if (signature !== this.shapeSignature) { this.window.setShape(region); this.shapeSignature = signature; }
  }
  position(anchor = this.store.get("petPosition"), options) {
    const nextLayout = placePet(anchor, this.preferences(), this.screen.getAllDisplays(), this.screen.getPrimaryDisplay(),
      { bubbleVisible: Boolean(this.bubble), ...options });
    const geometry = layout => JSON.stringify(layout && { bounds: layout.bounds, actor: layout.actor, bubble: layout.bubble, top: layout.top });
    if (geometry(this.layout) !== geometry(nextLayout)) this.layoutVersion = (this.layoutVersion || 0) + 1;
    this.layout = nextLayout;
    if (this.window && !this.window.isDestroyed()) {
      const current = this.window.getBounds(), next = this.layout.bounds;
      if (current.x !== next.x || current.y !== next.y || Math.abs(current.width - next.width) > 1 || Math.abs(current.height - next.height) > 1) {
        this.window.setBounds(next, false); this.shapeSignature = null;
      }
      this.shape(); this.syncPointerHit(); this.publish();
    }
  }
  setPointerHit(hit) {
    if (!this.window || this.window.isDestroyed() || hit === this.pointerHit) return;
    this.pointerHit = hit; this.window.setIgnoreMouseEvents(!hit, { forward: true });
  }
  syncPointerHit() {
    if (this.flight || this.moving || !this.layout) return;
    const pointer = this.screen.getCursorScreenPoint(), { bounds, actor, bubble } = this.layout;
    const x = pointer.x - bounds.x, y = pointer.y - bounds.y;
    const inside = rect => x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height;
    this.setPointerHit(this.active && (inside(actor) || Boolean(this.bubble && inside(bubble))));
  }
  savePosition() { if (this.layout) this.store.set("petPosition", this.layout.anchor); }
  async ensureWindow() {
    if (this.window && !this.window.isDestroyed() && this.loaded) return;
    if (this.loading) return this.loading;
    this.position();
    this.stateSignature = this.shapeSignature = null;
    this.pointerHit = undefined;
    const pet = this.window = new this.BrowserWindow({ ...this.layout.bounds,
      frame: false, transparent: true, backgroundColor: "#00000000", hasShadow: false, thickFrame: false,
      resizable: false, maximizable: false, fullscreenable: false, skipTaskbar: true, show: false,
      alwaysOnTop: this.preferences().alwaysOnTop, title: this.getLanguage() === "en" ? "GPT-Shirotide Companion" : "GPT-白汐小宠物", icon: this.getIcon(),
      webPreferences: { preload: path.join(__dirname, "pet-preload.js"), contextIsolation: true,
        nodeIntegration: false, sandbox: true, backgroundThrottling: false } });
    pet.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
    pet.webContents.on("will-navigate", event => event.preventDefault());
    pet.on("close", event => { if (!this.disposed) { event.preventDefault(); this.onHide(); } });
    pet.on("closed", () => { this.window = null; this.loaded = false; });
    pet.webContents.on("render-process-gone", () => {
      this.loaded = false; this.stopFlight({ settle: false }); this.shape(); this.active = false;
      if (!this.disposed) this.onRestore();
    });
    this.loading = new Promise((resolve, reject) => {
      const timer = setTimeout(() => { this.ready = null; reject(new Error("PET_LOAD_TIMEOUT")); }, 6000);
      this.ready = () => { clearTimeout(timer); this.ready = null; this.loaded = true; this.shape(); resolve(); };
      pet.webContents.once("did-fail-load", () => { clearTimeout(timer); reject(new Error("PET_LOAD_FAILED")); });
      pet.loadFile(path.join(__dirname, "renderer", "pet", "index.html")).catch(reject);
    }).catch(error => { if (!pet.isDestroyed()) pet.destroy(); throw error; }).finally(() => { this.loading = null; });
    return this.loading;
  }
  async enter() {
    this.wantPet = true;
    try {
      await this.ensureWindow();
      if (!this.wantPet || this.disposed) return false;
      this.active = true; this.store.set("petMode", true);
      this.position(); this.window.setAlwaysOnTop(this.preferences().alwaysOnTop, "floating");
      this.window.showInactive(); this.publish(); this.window.webContents.invalidate(); this.onEnter();
      this.speak("hello"); return true;
    } catch { this.active = false; this.wantPet = false; return false; }
  }
  hide({ restore = false } = {}) {
    this.stopFlight();
    this.wantPet = false; this.active = false;
    this.dismiss(); this.window?.hide();
    if (restore) this.store.set("petMode", false);
    this.publish();
  }
  updateSettings(value) {
    this.stopFlight();
    const next = normalizePetSettings({ ...this.preferences(), ...value });
    this.store.set("petSettings", next);
    this.window?.setAlwaysOnTop(next.alwaysOnTop, "floating");
    if (!next.bubbles) this.dismiss();
    this.position(this.layout?.anchor); this.savePosition(); this.onSettings?.(next); return next;
  }
  updateTasks(result) {
    const notice = this.notices.observe(result);
    if (notice && this.active) this.speak("completed", notice);
    this.publish();
  }
  speak(kind, data = {}) {
    if (!this.active || this.flight || this.moving || !this.preferences().bubbles) return;
    clearTimeout(this.bubbleTimer);
    this.bubble = { serial: ++this.bubbleSerial, kind, phase: "quota" };
    this.position(this.layout.anchor, { snap: false });
    this.bubbleTimer = setTimeout(() => this.dismiss(), 7000);
    this.bubbleTimer.unref?.();
  }
  interact() {
    if (!this.active || !this.preferences().bubbles) return;
    if (!this.bubble) return;
    if (this.bubble.phase === "chat") { this.dismiss(); return; }
    clearTimeout(this.bubbleTimer);
    this.chatterIndex = nextChatterIndex(this.chatterIndex);
    this.bubble = { serial: ++this.bubbleSerial, kind: "tap", phase: "chat", chatterIndex: this.chatterIndex };
    this.publish();
    this.bubbleTimer = setTimeout(() => this.dismiss(), 7000); this.bubbleTimer.unref?.();
  }
  dismiss() {
    clearTimeout(this.bubbleTimer);
    if (!this.bubble) return;
    this.bubble = null; this.position(this.layout?.anchor, { snap: false, stage: Boolean(this.flight) });
  }
  async gesture() {
    if (!this.active || this.moving || !this.window || this.window.isDestroyed()) return { moved: false };
    this.moving = true;
    this.stopFlight(); this.dismiss();
    let releasedAt;
    const pet = this.window, samples = [], recordMove = () => {
      if (pet.isDestroyed()) return;
      const b = pet.getBounds(), at = performance.now();
      samples.push({ x: b.x, y: b.y, at });
      while (samples.length > 2 && at - samples[0].at > 140) samples.shift();
    };
    try {
      const before = pet.getBounds();
      recordMove(); pet.on("move", recordMove);
      const began = await new Promise(resolve => {
        let done = false, entered = false, timer, beginTimer;
        const finish = value => {
          if (done) return; done = true; clearTimeout(timer); clearTimeout(beginTimer);
          pet.removeListener("moved", ended); pet.removeListener("closed", closed);
          if (!pet.isDestroyed()) { pet.unhookWindowMessage(0x0232); pet.unhookWindowMessage(0x0231); }
          this.cancelGesture = null; resolve(value);
        };
        const ended = () => { releasedAt ??= performance.now(); setImmediate(() => finish(true)); };
        const closed = () => finish(false);
        this.cancelGesture = closed;
        pet.hookWindowMessage(0x0231, () => { entered = true; }); // WM_ENTERSIZEMOVE
        pet.hookWindowMessage(0x0232, ended); // WM_EXITSIZEMOVE
        pet.once("moved", ended); pet.once("closed", closed);
        timer = setTimeout(() => finish(false), 120000);
        beginTimer = setTimeout(() => { if (!entered) finish(false); }, 400);
        try { if (!startPetMove(pet.getNativeWindowHandle())) finish(false); }
        catch { finish(false); }
      });
      if (!began || pet.isDestroyed()) return { moved: false };
      const after = pet.getBounds();
      const moved = before.x !== after.x || before.y !== after.y;
      if (moved) {
        const velocity = releaseVelocity(samples, releasedAt ?? performance.now());
        pet.removeListener("move", recordMove);
        const anchor = { x: after.x + this.layout.actor.x, y: after.y + this.layout.actor.y };
        this.layout.bounds = after; this.layout.anchor = anchor;
        if (Math.hypot(velocity.vx, velocity.vy) >= 260) this.startFlight(velocity, anchor);
        else { this.refreshBubblePlacement(); this.savePosition(); }
      }
      return { moved };
    } finally { pet.removeListener("move", recordMove); this.moving = false; }
  }
  motion(value) { if (this.loaded && this.window && !this.window.isDestroyed()) this.window.webContents.send("pet:motion", value); }
  catch(point) {
    if (!this.flight || point?.id !== this.flight.id) return;
    // Freeze the carrier where Windows actually displays it, not one predicted
    // frame ahead of the mouse. Local pointer-capture coordinates stay fixed.
    clearImmediate(this.nativeMoveFrame); this.nativeMoveFrame = null;
    this.pendingFlightPoint = null;
    const bounds = this.window.getBounds();
    this.layout.bounds = bounds;
    this.layout.anchor = { x: bounds.x + this.layout.actor.x, y: bounds.y + this.layout.actor.y };
    this.stopFlight();
  }
  refreshBubblePlacement() {
    const projected = placePet(this.layout.anchor, this.preferences(), this.screen.getAllDisplays(), this.screen.getPrimaryDisplay(), { snap: false });
    this.translateAnchor(projected.anchor);
    const changed = this.layout.top !== projected.top || JSON.stringify(this.layout.bubble) !== JSON.stringify(projected.bubble);
    this.layout.top = projected.top; this.layout.left = projected.left; this.layout.bubble = projected.bubble;
    if (changed) this.layoutVersion = (this.layoutVersion || 0) + 1;
    this.syncPointerHit(); this.publish();
  }
  stopFlight({ settle = true } = {}) {
    clearTimeout(this.flightTimer); this.flightTimer = null;
    clearImmediate(this.nativeMoveFrame); this.nativeMoveFrame = null;
    if (!this.flight) return;
    if (this.pendingFlightPoint) this.flushFlightPoint();
    this.flight = null; this.pointerHit = undefined;
    this.motion({ flying: false });
    if (settle && this.window && !this.window.isDestroyed()) { this.refreshBubblePlacement(); this.savePosition(); }
  }
  startFlight(velocity, releasedAnchor = this.layout.anchor) {
    if (!this.active || this.disposed) return false;
    this.stopFlight({ settle: false });
    this.layout.anchor = { ...releasedAnchor };
    const { actor } = this.layout;
    const display = this.screen.getDisplayNearestPoint({ x: Math.round(releasedAnchor.x + actor.width / 2), y: Math.round(releasedAnchor.y + actor.height / 2) });
    const area = { ...display.workArea }, id = ++this.flightSerial;
    this.flight = { id, area, size: { width: actor.width, height: actor.height } };
    // Keep this exact HWND, bitmap size and local sprite origin for the whole
    // flight. Only no-size native translation changes the screen position.
    this.window.webContents.send('pet:flight', { id, area, size: this.flight.size,
      actor: { ...actor }, body: { ...releasedAnchor, ...velocity }, pointer: this.screen.getCursorScreenPoint() });
    this.flightTimer = setTimeout(() => this.stopFlight(), 8000);
    return true;
  }
  acceptFlightPoint(value) {
    if (!this.flight || value?.id !== this.flight.id || !Number.isFinite(value.x) || !Number.isFinite(value.y)) return false;
    const { area, size } = this.flight;
    if (value.x < area.x - 1 || value.y < area.y - 1 || value.x > area.x + area.width - size.width + 1 ||
        value.y > area.y + area.height - size.height + 1) return false;
    this.pendingFlightPoint = { id: value.id, x: Math.round(value.x), y: Math.round(value.y) }; return true;
  }
  flushFlightPoint() {
    clearImmediate(this.nativeMoveFrame); this.nativeMoveFrame = null;
    const point = this.pendingFlightPoint; this.pendingFlightPoint = null;
    if (!point || point.id !== this.flight?.id || !this.window || this.window.isDestroyed()) return;
    this.translateAnchor(point);
  }
  translateAnchor(point) {
    const x = Math.round(point.x - this.layout.actor.x), y = Math.round(point.y - this.layout.actor.y);
    if (x === this.layout.bounds.x && y === this.layout.bounds.y) return;
    const physical = this.screen.dipToScreenPoint({ x, y });
    if (!this.moveWindow(this.window.getNativeWindowHandle(), physical)) return;
    this.layout.anchor = { x: point.x, y: point.y };
    this.layout.bounds = { ...this.layout.bounds, x, y };
  }
  flightProgress(value) {
    if (!this.acceptFlightPoint(value) || this.nativeMoveFrame) return;
    // One newest pose per event-loop turn; no backlog of obsolete native moves.
    this.nativeMoveFrame = setImmediate(() => this.flushFlightPoint());
  }
  flightHover(value) {
    if (!this.flight || value?.id !== this.flight.id || typeof value.hit !== "boolean" || value.hit === this.flight.hit) return;
    this.flight.hit = value.hit;
    this.window.setIgnoreMouseEvents(!value.hit, { forward: true });
  }
  menu() {
    if (!this.active) return;
    this.stopFlight();
    const zh = this.getLanguage() !== "en", p = this.preferences();
    this.Menu.buildFromTemplate([
      { label: zh ? `打开${DISPLAY_NAME.zh}` : `Open ${DISPLAY_NAME.en}`, click: this.onRestore },
      { label: zh ? "查看额度气泡" : "Show quota bubble", enabled: p.bubbles, click: () => this.speak("tap") },
      { type: "separator" },
      { label: zh ? "宠物大小" : "Pet size", submenu: [192, 256, 320].map(size => ({ label: `${size} px`, type: "radio", checked: p.size === size, click: () => this.updateSettings({ size }) })) },
      { label: zh ? "宠物保持置顶" : "Keep pet on top", type: "checkbox", checked: p.alwaysOnTop, click: item => this.updateSettings({ alwaysOnTop: item.checked }) },
      { label: zh ? "气泡提示" : "Speech bubbles", type: "checkbox", checked: p.bubbles, click: item => this.updateSettings({ bubbles: item.checked }) },
      { label: zh ? "小黄鸭音效" : "Duck squeak", type: "checkbox", checked: p.sound, click: item => this.updateSettings({ sound: item.checked }) },
      { type: "separator" }, { label: zh ? "隐藏到托盘" : "Hide to tray", click: this.onHide },
      { label: zh ? "退出" : "Quit", click: this.onQuit }
    ]).popup({ window: this.window });
  }
  dispose() {
    this.cancelGesture?.();
    this.stopFlight({ settle: false }); this.disposed = true; this.wantPet = false; clearTimeout(this.bubbleTimer);
    for (const name of ["display-added", "display-removed", "display-metrics-changed"]) this.screen.removeListener(name, this.onDisplaysChanged);
    this.window?.destroy();
  }
}
module.exports = { PetController };

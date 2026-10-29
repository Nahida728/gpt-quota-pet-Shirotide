const { app, BrowserWindow, ipcMain, Menu, Tray, nativeImage, nativeTheme, screen, dialog, net, shell } = require("electron");
const fs = require("node:fs");
const path = require("node:path");
const { QuotaService } = require("./quota-service");
const { RealtimeSync } = require("./realtime-sync");
const { MonitorUpdater } = require("./monitor-updater");
const { JsonStore } = require("./store");
const { combineTokenUsage } = require("./token-usage");
const { focusCodexWindow } = require("./codex-window-focus");
const crypto = require("node:crypto");
const { restoreDesktopWindow, normalizeAppearance, migrateDesktopSettings } = require("./desktop-settings");
const { MAX_BYTES: MAX_BACKGROUND_BYTES, imageDimensions, decodeDataUrl, normalizeCrop } = require("./background-image");
const { discoverCodexSources } = require("./codex-sources");
const { MODEL_PRICING, PRICING_DATE } = require("./codex-cost-usage");
const { SOURCES } = require("./model-pricing-catalog");

let window, tray, quotaService, realtimeSync, monitorUpdater, store;
let isQuitting = false;
let isAppHidden = false;
let alwaysOnTopYielded = false;
let windowPositionSaveTimer = null;
const APP_NAME = "Codex监测台";
const hasSingleInstanceLock = app.requestSingleInstanceLock();
if (!hasSingleInstanceLock) app.quit();

function isChinese() {
  return store?.get("language", "zh") === "zh";
}

function getLocalizedAppName() {
  return isChinese() ? APP_NAME : "Codex Quota Monitor";
}

function createTrayIcon() {
  const filename = nativeTheme.shouldUseDarkColors
    ? "tray-icon-on-dark.png"
    : "tray-icon-on-light.png";
  const iconPath = app.isPackaged
    ? path.join(process.resourcesPath, filename)
    : path.join(__dirname, "..", "assets", filename);
  const image = nativeImage.createFromPath(iconPath);
  if (!image.isEmpty()) return image;
  return nativeImage.createFromPath(path.join(__dirname, "..", "assets", "codex-icon-white.png"))
    .resize({ width: 32, height: 32 });
}

function getWindowIconPath() {
  return app.isPackaged
    ? path.join(process.resourcesPath, "icon.ico")
    : path.join(__dirname, "..", "assets", "icon.ico");
}

function saveWindowPosition(target = window) {
  if (!target || target.isDestroyed() || target.isMinimized()) return;
  clearTimeout(windowPositionSaveTimer);
  windowPositionSaveTimer = null;
  const bounds = target.getNormalBounds();
  if ([bounds.x, bounds.y, bounds.width, bounds.height].every(Number.isFinite)) {
    store.set("desktopWindow", { ...bounds, maximized: target.isMaximized() });
  }
}

function scheduleWindowPositionSave() {
  clearTimeout(windowPositionSaveTimer);
  windowPositionSaveTimer = setTimeout(() => saveWindowPosition(), 300);
}

function reconcileDisplayBounds() {
  if (!window || window.isDestroyed()) return;
  const bounds = window.getNormalBounds();
  const next = restoreDesktopWindow(bounds, screen.getAllDisplays(), screen.getPrimaryDisplay());
  window.setMinimumSize(next.minWidth, next.minHeight);
  if (!window.isMaximized() && !window.isMinimized() &&
      ["x", "y", "width", "height"].some(key => bounds[key] !== next[key])) {
    window.setBounds({ x: next.x, y: next.y, width: next.width, height: next.height });
  }
}

function createWindow() {
  const saved = store.get("desktopWindow", null);
  const bounds = restoreDesktopWindow(saved, screen.getAllDisplays(), screen.getPrimaryDisplay());
  window = new BrowserWindow({
    ...bounds, frame: false, transparent: false, backgroundColor: "#f3f8fc",
    titleBarStyle: "hidden",
    titleBarOverlay: { color: "#f3f8fc", symbolColor: "#245466", height: 52 },
    icon: getWindowIconPath(), title: getLocalizedAppName(),
    resizable: true, movable: true, maximizable: true, fullscreenable: true,
    alwaysOnTop: store.get("alwaysOnTop", false), show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), contextIsolation: true,
      nodeIntegration: false, sandbox: true
    }
  });
  window.setMenuBarVisibility(false);
  let shown = false;
  const showInitialWindow = () => {
    if (shown || !window || window.isDestroyed()) return;
    shown = true;
    if (saved?.maximized) window.maximize();
    isAppHidden = false;
    window.show();
  };
  window.once("ready-to-show", showInitialWindow);
  window.webContents.once("did-finish-load", showInitialWindow);
  window.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  window.webContents.on("will-navigate", event => event.preventDefault());
  window.loadFile(path.join(__dirname, "renderer", "index.html"));
  for (const event of ["move", "resize", "maximize", "unmaximize"]) window.on(event, scheduleWindowPositionSave);
  window.on("moved", () => {
    const area = screen.getDisplayMatching(window.getBounds()).workArea;
    window.setMinimumSize(Math.min(1000, Math.max(320, area.width - 24)), Math.min(680, Math.max(240, area.height - 24)));
  });
  window.on("close", event => {
    if (isQuitting) return;
    event.preventDefault();
    if (store.get("closeBehavior", "tray") === "quit") app.quit();
    else hideAppWindows();
  });
  window.on("closed", () => { window = null; });
  window.on("show", updateTray);
  window.on("hide", updateTray);
  window.on("focus", () => {
    if (alwaysOnTopYielded && store.get("alwaysOnTop", false)) {
      window.setAlwaysOnTop(true, "floating"); alwaysOnTopYielded = false;
    }
  });
  screen.on("display-removed", reconcileDisplayBounds);
  screen.on("display-metrics-changed", reconcileDisplayBounds);
  if (process.argv.includes("--dev")) window.webContents.openDevTools({ mode: "detach" });
}

function getBackgroundDataUrl(source = false) {
  const asset = store.get("backgroundAsset");
  const filename = source ? asset?.sourcePath : asset?.displayPath || store.get("backgroundPath");
  try {
    if (!filename || fs.statSync(filename).size > MAX_BACKGROUND_BYTES) return null;
    const buffer = fs.readFileSync(filename);
    if (!imageDimensions(buffer)) return null;
    const type = { ".png": "png", ".jpg": "jpeg", ".jpeg": "jpeg", ".webp": "webp", ".gif": "gif" }[path.extname(filename).toLowerCase()];
    return type ? "data:image/" + type + ";base64," + buffer.toString("base64") : null;
  } catch { return null; }
}

function safeRemoveBackground(filename) {
  if (typeof filename !== "string" || path.dirname(path.resolve(filename)) !== path.resolve(app.getPath("userData")) ||
      !/^custom-background(?:-[a-z0-9-]+)?\.png$/i.test(path.basename(filename))) return;
  try { fs.unlinkSync(filename); } catch {}
}

function saveBackground(dataUrl, requestedCrop) {
  const buffer = decodeDataUrl(dataUrl);
  if (!buffer) return { error: "INVALID_IMAGE" };
  const crop = normalizeCrop(requestedCrop);
  if (requestedCrop && !crop) return { error: "INVALID_IMAGE" };
  let image = nativeImage.createFromBuffer(buffer);
  if (image.isEmpty()) return { error: "INVALID_IMAGE" };
  let size = image.getSize();
  if (size.width * size.height > 40 * 1024 * 1024) return { error: "INVALID_IMAGE" };
  if (Math.max(size.width, size.height) > 3840) {
    const scale = 3840 / Math.max(size.width, size.height);
    image = image.resize({ width: Math.max(1, Math.round(size.width * scale)), height: Math.max(1, Math.round(size.height * scale)) });
  }
  let original = image.toPNG();
  if (original.length > MAX_BACKGROUND_BYTES) {
    const scale = 2048 / Math.max(image.getSize().width, image.getSize().height);
    size = image.getSize();
    image = image.resize({ width: Math.round(size.width * scale), height: Math.round(size.height * scale) });
    original = image.toPNG();
  }
  size = image.getSize();
  let display = image;
  if (crop) {
    const x = Math.min(size.width - 1, Math.floor(crop.x * size.width));
    const y = Math.min(size.height - 1, Math.floor(crop.y * size.height));
    display = image.crop({ x, y, width: Math.max(1, Math.min(size.width - x, Math.round(crop.width * size.width))), height: Math.max(1, Math.min(size.height - y, Math.round(crop.height * size.height))) });
  }
  const rendered = display.toPNG();
  if (original.length > MAX_BACKGROUND_BYTES || rendered.length > MAX_BACKGROUND_BYTES) return { error: "FILE_TOO_LARGE" };
  const id = crypto.randomUUID();
  const sourcePath = path.join(app.getPath("userData"), "custom-background-source-" + id + ".png");
  const displayPath = path.join(app.getPath("userData"), "custom-background-display-" + id + ".png");
  const previous = store.get("backgroundAsset");
  try {
    for (const [filename, bytes] of [[sourcePath, original], [displayPath, rendered]]) {
      const handle = fs.openSync(filename, "wx", 0o600);
      try { fs.writeFileSync(handle, bytes); fs.fsyncSync(handle); } finally { fs.closeSync(handle); }
    }
    store.set("backgroundAsset", { sourcePath, displayPath, crop });
  } catch {
    safeRemoveBackground(sourcePath); safeRemoveBackground(displayPath);
    return { error: "SAVE_FAILED" };
  }
  safeRemoveBackground(previous?.sourcePath); safeRemoveBackground(previous?.displayPath);
  return { dataUrl: getBackgroundDataUrl() };
}

function buildTrayMenu() {
  const language = store.get("language", "zh");
  const zh = language === "zh";
  return Menu.buildFromTemplate([
    {
      label: !isAppHidden ? (zh ? "隐藏窗口" : "Hide window") : (zh ? "显示窗口" : "Show window"),
      click: () => (!isAppHidden ? hideAppWindows() : showWindow())
    },
    {
      label: zh ? "立即刷新" : "Refresh now",
      click: () => window?.webContents.send("quota:refresh")
    },
    { type: "separator" },
    {
      label: zh ? "始终置顶" : "Always on top",
      type: "checkbox",
      checked: store.get("alwaysOnTop", false),
      click: ({ checked }) => setAlwaysOnTop(checked)
    },
    {
      label: zh ? "开机启动" : "Launch at login",
      type: "checkbox",
      checked: app.getLoginItemSettings().openAtLogin,
      click: ({ checked }) => app.setLoginItemSettings({ openAtLogin: checked })
    },
    { type: "separator" },
    {
      label: zh ? "退出" : "Quit",
      click: () => {
        isQuitting = true;
        app.quit();
      }
    }
  ]);
}

function updateTray() {
  if (!tray) return;
  tray.setToolTip(getLocalizedAppName());
  tray.setContextMenu(buildTrayMenu());
}

function showWindow() {
  if (!window || window.isDestroyed()) return;
  isAppHidden = false;
  window.setAlwaysOnTop(store.get("alwaysOnTop", false), "floating");
  alwaysOnTopYielded = false;
  if (window.isMinimized()) window.restore();
  window.showInactive();
  window.focus();
  updateTray();
}

function hideAppWindows() {
  isAppHidden = true;
  saveWindowPosition(window, "windowBounds");
  window?.hide();
  updateTray();
}

function setAlwaysOnTop(enabled) {
  store.set("alwaysOnTop", Boolean(enabled));
  alwaysOnTopYielded = false;
  window?.setAlwaysOnTop(Boolean(enabled), "floating");
  window?.webContents.send("settings:alwaysOnTop", Boolean(enabled));
  updateTray();
}

function focusCodexFromMonitor() {
  const shouldYieldAlwaysOnTop = Boolean(
    window &&
    !window.isDestroyed() &&
    store.get("alwaysOnTop", false) &&
    window.isAlwaysOnTop()
  );
  if (shouldYieldAlwaysOnTop) {
    window.setAlwaysOnTop(false);
    alwaysOnTopYielded = true;
  }
  const focused = focusCodexWindow();
  if (!focused && shouldYieldAlwaysOnTop) {
    window.setAlwaysOnTop(true, "floating");
    alwaysOnTopYielded = false;
  }
  return focused;
}

function registerIpc() {
  ipcMain.handle("pricing:read", () => ({ date: PRICING_DATE, models: Object.entries(MODEL_PRICING).map(([model, price]) => ({ model, ...price, vendor: price.vendor || "OpenAI", source: price.source || SOURCES.OpenAI })) }));
  ipcMain.handle("pricing:openSource", (_event, url) => Object.values(SOURCES).includes(url) ? shell.openExternal(url) : false);
  ipcMain.handle("monitor-update:read", () => monitorUpdater?.snapshot());
  ipcMain.handle("monitor-update:check", () => monitorUpdater?.check());
  ipcMain.handle("monitor-update:install", () => monitorUpdater?.install());
  ipcMain.handle("quota:read", () => realtimeSync.refresh({ forceCheckpoints: true }));
  ipcMain.handle("cost:rescan", async () => {
    const result = await quotaService.rescanCost();
    realtimeSync.requestRemote();
    return result;
  });
  ipcMain.handle("codex:focus", () => focusCodexFromMonitor());
  ipcMain.handle("reset:open-source", (_event, url) => {
    if (url === "https://codexresettracker.com/" || url === "https://codex-reset.com/" ||
        /^https:\/\/x\.com\/thsottiaux\/status\/\d{10,25}$/.test(url || "")) {
      return shell.openExternal(url);
    }
    return false;
  });
  ipcMain.handle("tasks:active-status", async () => {
    const result = await quotaService.readActiveTasks();
    return {
      available: Boolean(result.available),
      count: Number.isFinite(result.count) ? result.count : 0,
      observedAt: Number.isFinite(result.observedAt) ? result.observedAt : null
    };
  });
  ipcMain.handle("settings:read", () => ({
    monitorVersion: app.getVersion(), language: store.get("language", "zh"),
    alwaysOnTop: store.get("alwaysOnTop", false), closeBehavior: store.get("closeBehavior", "tray"),
    appearance: normalizeAppearance(store.get("appearance")),
    backgroundDataUrl: getBackgroundDataUrl(), backgroundOpacity: store.get("backgroundOpacity", 0.34)
  }));
  ipcMain.handle("settings:language", (_event, language) => {
    const next = language === "en" ? "en" : "zh";
    store.set("language", next); window?.setTitle(getLocalizedAppName()); updateTray(); return next;
  });
  ipcMain.handle("settings:alwaysOnTop", (_event, enabled) => { setAlwaysOnTop(enabled); return Boolean(enabled); });
  ipcMain.handle("settings:closeBehavior", (_event, value) => {
    const next = value === "quit" ? "quit" : "tray"; store.set("closeBehavior", next); return next;
  });
  ipcMain.handle("settings:appearance", (_event, value) => {
    const next = normalizeAppearance(value); store.set("appearance", next); return next;
  });
  ipcMain.handle("sources:read", () => {
    const sources = discoverCodexSources();
    return sources.homes.filter(home => fs.existsSync(home)).map((home, index) => ({
      id: String(index + 1), name: path.basename(home) === "codex-home" ? path.basename(path.dirname(home)) : path.basename(home),
      sessions: ["sessions", "archived_sessions"].filter(name => { try { return fs.statSync(path.join(home, name)).isDirectory(); } catch { return false; } }).length
    }));
  });
  ipcMain.handle("background:choose", async () => {
    const zh = isChinese();
    const result = await dialog.showOpenDialog(window, {
      title: zh ? "选择工作台背景图" : "Choose workspace background", properties: ["openFile"],
      filters: [{ name: zh ? "图片" : "Images", extensions: ["png", "jpg", "jpeg", "webp", "gif"] }]
    });
    if (result.canceled || !result.filePaths[0]) return { canceled: true };
    try {
      const sourcePath = result.filePaths[0];
      if (fs.statSync(sourcePath).size > MAX_BACKGROUND_BYTES) return { error: "FILE_TOO_LARGE" };
      const buffer = fs.readFileSync(sourcePath);
      const type = { ".png": "png", ".jpg": "jpeg", ".jpeg": "jpeg", ".webp": "webp", ".gif": "gif" }[path.extname(sourcePath).toLowerCase()];
      if (!type || !imageDimensions(buffer)) return { error: "INVALID_IMAGE" };
      return { name: path.basename(sourcePath), dataUrl: "data:image/" + type + ";base64," + buffer.toString("base64") };
    } catch { return { error: "INVALID_IMAGE" }; }
  });
  ipcMain.handle("background:save", (_event, dataUrl, crop) => saveBackground(dataUrl, crop));
  ipcMain.handle("background:validate", (_event, dataUrl) => Boolean(decodeDataUrl(dataUrl)));
  ipcMain.handle("background:source", () => getBackgroundDataUrl(true) || getBackgroundDataUrl());
  ipcMain.handle("background:opacity", (_event, opacity) => {
    const next = Math.min(0.85, Math.max(0.08, Number(opacity) || 0.34));
    store.set("backgroundOpacity", next); return next;
  });
  ipcMain.handle("background:clear", () => {
    const asset = store.get("backgroundAsset");
    const legacy = store.get("backgroundPath");
    store.set("backgroundAsset", null); store.set("backgroundPath", null);
    safeRemoveBackground(asset?.sourcePath); safeRemoveBackground(asset?.displayPath); safeRemoveBackground(legacy);
    return true;
  });
  ipcMain.on("window:minimize", () => window?.minimize());
  ipcMain.on("window:hide", hideAppWindows);
}

if (hasSingleInstanceLock) app.whenReady().then(() => {
  app.setName(APP_NAME);
  app.setAppUserModelId("com.codex.quota-monitor");
  store = new JsonStore(path.join(app.getPath("userData"), "settings.json"));
  migrateDesktopSettings(store);
  quotaService = new QuotaService({
    appStatePath: path.join(app.getPath("userData"), "quota-state.json"),
    fetchImpl: (url, options) => net.fetch(url, options)
  });
  realtimeSync = new RealtimeSync({
    service: quotaService,
    onSnapshot: snapshot => window?.webContents.send("quota:snapshot", snapshot),
    onTasks: result => window?.webContents.send("tasks:snapshot", result)
  });
  realtimeSync.start();
  quotaService.onCheckpoints = checkpoint => {
    if (realtimeSync.latest) realtimeSync.latest = { ...realtimeSync.latest, resetCheckpoints: checkpoint };
    window?.webContents.send("checkpoints:snapshot", checkpoint);
  };
  quotaService.onCostSnapshot = cost => {
    if (realtimeSync.latest) realtimeSync.latest = { ...realtimeSync.latest, tokenCost: cost,
      tokenUsage: combineTokenUsage(realtimeSync.latest.tokenUsage, cost) };
    window?.webContents.send("cost:snapshot", cost);
  };
  quotaService.scheduleCostScan();
  registerIpc();
  createWindow();
  monitorUpdater = new MonitorUpdater({
    app, store, fetchImpl: (url, options) => net.fetch(url, options),
    notify: state => window?.webContents.send("monitor-update:state", state),
    idle: () => {
      const remoteTasks = realtimeSync.latest?.activeTasks;
      const tasks = (realtimeSync.latestTasks?.observedAt || 0) > (remoteTasks?.observedAt || 0) ? realtimeSync.latestTasks : remoteTasks;
      return tasks?.available && !tasks.truncated && tasks.count === 0 &&
        Date.now() - tasks.observedAt < 60000;
    },
    prepareQuit: async () => {
      await Promise.allSettled([quotaService.inFlight, quotaService.activeTaskInFlight, quotaService.fullScanInFlight, quotaService.costScanInFlight]);
      saveWindowPosition(window, "windowBounds");
    }
  });
  monitorUpdater.start();
  tray = new Tray(createTrayIcon());
  tray.setToolTip(getLocalizedAppName());
  tray.setContextMenu(buildTrayMenu());
  tray.on("click", () => {
    !isAppHidden ? hideAppWindows() : showWindow();
  });
  nativeTheme.on("updated", () => tray?.setImage(createTrayIcon()));
});

app.on("second-instance", () => {
  if (!hasSingleInstanceLock || !app.isReady()) return;
  showWindow();
});

app.on("before-quit", () => {
  isQuitting = true;
  saveWindowPosition(window, "windowBounds");
  quotaService?.dispose();
  realtimeSync?.dispose();
  monitorUpdater?.dispose();
});

app.on("window-all-closed", () => { if (!tray) app.quit(); });

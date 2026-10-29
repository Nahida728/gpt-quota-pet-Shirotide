const { contextBridge, ipcRenderer } = require("electron");

function subscribe(channel, callback) {
  const listener = (_event, value) => callback(value);
  ipcRenderer.on(channel, listener);
  return () => ipcRenderer.removeListener(channel, listener);
}

contextBridge.exposeInMainWorld("codexMonitor", {
  readQuota: () => ipcRenderer.invoke("quota:read"),
  rescanCost: () => ipcRenderer.invoke("cost:rescan"),
  readMonitorUpdate: () => ipcRenderer.invoke("monitor-update:read"),
  checkMonitorUpdate: () => ipcRenderer.invoke("monitor-update:check"),
  installMonitorUpdate: () => ipcRenderer.invoke("monitor-update:install"),
  readActiveTaskStatus: () => ipcRenderer.invoke("tasks:active-status"),
  focusCodex: () => ipcRenderer.invoke("codex:focus"),
  openResetSource: url => ipcRenderer.invoke("reset:open-source", url),
  readSettings: () => ipcRenderer.invoke("settings:read"),
  setLanguage: language => ipcRenderer.invoke("settings:language", language),
  setAlwaysOnTop: enabled => ipcRenderer.invoke("settings:alwaysOnTop", enabled),
  setCloseBehavior: value => ipcRenderer.invoke("settings:closeBehavior", value),
  setAppearance: value => ipcRenderer.invoke("settings:appearance", value),
  readSources: () => ipcRenderer.invoke("sources:read"),
  readPricing: () => ipcRenderer.invoke("pricing:read"),
  openPricingSource: url => ipcRenderer.invoke("pricing:openSource", url),
  chooseBackground: () => ipcRenderer.invoke("background:choose"),
  saveBackground: (dataUrl, crop) => ipcRenderer.invoke("background:save", dataUrl, crop),
  validateBackground: dataUrl => ipcRenderer.invoke("background:validate", dataUrl),
  readBackgroundSource: () => ipcRenderer.invoke("background:source"),
  setBackgroundOpacity: opacity => ipcRenderer.invoke("background:opacity", opacity),
  clearBackground: () => ipcRenderer.invoke("background:clear"),
  minimize: () => ipcRenderer.send("window:minimize"),
  hide: () => ipcRenderer.send("window:hide"),
  onRefresh: callback => subscribe("quota:refresh", callback),
  onSnapshot: callback => subscribe("quota:snapshot", callback),
  onTasks: callback => subscribe("tasks:snapshot", callback),
  onCheckpoints: callback => subscribe("checkpoints:snapshot", callback),
  onCost: callback => subscribe("cost:snapshot", callback),
  onMonitorUpdate: callback => subscribe("monitor-update:state", callback),
  onAlwaysOnTop: callback => subscribe("settings:alwaysOnTop", callback)
});

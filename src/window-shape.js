const WINDOW_RADIUS = 12;

let native;
function loadNative() {
  if (native) return native;
  const koffi = require("koffi");
  const user32 = koffi.load("user32.dll"), gdi32 = koffi.load("gdi32.dll");
  native = {
    valid: user32.func("int __stdcall IsWindow(void *)"),
    rectangle: user32.func("int __stdcall GetWindowRect(void *, void *)"),
    create: gdi32.func("void * __stdcall CreateRoundRectRgn(int, int, int, int, int, int)"),
    set: user32.func("int __stdcall SetWindowRgn(void *, void *, int)"),
    dispose: gdi32.func("int __stdcall DeleteObject(void *)")
  };
  return native;
}

function setNativeRoundedCorners(window) {
  // A minimized HWND has icon-sized native bounds, not the workspace surface.
  if (window.isDestroyed() || window.isMinimized()) return false;
  const handle = window.getNativeWindowHandle();
  if (!Buffer.isBuffer(handle) || handle.length < 4) return false;
  const hwnd = handle.length >= 8 ? handle.readBigUInt64LE(0) : BigInt(handle.readUInt32LE(0));
  const api = loadNative();
  if (!hwnd || !api.valid(hwnd)) return false;
  const rectangle = Buffer.alloc(16);
  if (!api.rectangle(hwnd, rectangle)) return false;
  const width = rectangle.readInt32LE(8) - rectangle.readInt32LE(0);
  const height = rectangle.readInt32LE(12) - rectangle.readInt32LE(4);
  const bounds = window.getBounds();
  if (width <= 0 || height <= 0 || bounds.width <= 0) return false;
  // Measure physical pixels directly: fractional display scales must not leave
  // an oversized region whose rounded corners lie beyond the actual HWND.
  const radius = Math.max(1, Math.min(Math.round(WINDOW_RADIUS * width / bounds.width),
    Math.floor(Math.min(width, height) / 2)));
  const region = api.create(0, 0, width, height, radius * 2, radius * 2);
  if (!region) return false;
  let transferred = false;
  try {
    transferred = Boolean(api.set(hwnd, region, Number(window.isVisible())));
    return transferred;
  } finally {
    // Windows owns a successfully installed region, including its disposal.
    if (!transferred) api.dispose(region);
  }
}

function installWindowCorners(window) {
  if (process.platform !== "win32") return () => {};
  const contents = window.webContents;
  let pending = null, applying = false;
  const apply = () => {
    if (applying || window.isDestroyed()) return;
    applying = true;
    try {
      setNativeRoundedCorners(window);
    } catch (error) {
      console.error("Workspace corner update failed:", error.message);
    } finally { applying = false; }
  };
  const refresh = () => {
    if (applying || window.isDestroyed()) return;
    clearImmediate(pending);
    // Restore/show can rebuild the native frame after emitting their events.
    // Apply once after that operation finishes; never poll or alter bounds.
    pending = setImmediate(() => { pending = null; apply(); });
  };
  const events = ["show", "restore", "moved", "resize"];
  for (const event of events) window.on(event, refresh);
  contents.on("did-finish-load", refresh);
  window.once("closed", () => {
    clearImmediate(pending);
    for (const event of events) window.removeListener(event, refresh);
    if (!contents.isDestroyed()) contents.removeListener("did-finish-load", refresh);
  });
  apply();
  return refresh;
}

module.exports = { WINDOW_RADIUS, installWindowCorners };

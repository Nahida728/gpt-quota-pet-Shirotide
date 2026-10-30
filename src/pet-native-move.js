// Queue one Windows system move. Never re-enter Electron/V8 from a blocking FFI
// SendMessage modal loop; completion is observed by PetController separately.
let user32;
function nativeApi() {
  if (!user32) {
    const lib = require('koffi').load('user32.dll');
    user32 = { release: lib.func('bool ReleaseCapture()'), valid: lib.func('bool IsWindow(void *hWnd)'),
      button: lib.func('short GetAsyncKeyState(int vKey)'),
      post: lib.func('bool PostMessageW(void *hWnd, uint32_t msg, uintptr_t wParam, intptr_t lParam)'),
      position: lib.func('bool SetWindowPos(void *, void *, int, int, int, int, uint32_t)') };
  }
  return user32;
}
function handle(buffer) { return buffer.length >= 8 ? buffer.readBigUInt64LE(0) : BigInt(buffer.readUInt32LE(0)); }
function startPetMove(buffer) {
  if (process.platform !== "win32" || !Buffer.isBuffer(buffer) || buffer.length < 4) return false;
  nativeApi();
  const hwnd = handle(buffer);
  if (!hwnd || !user32.valid(hwnd)) return false;
  // A fast click may already have ended during the two-frame paint. Never start
  // an unheld system move, which would leave the window attached to the cursor.
  if (!(user32.button(1) & 0x8000)) return false;
  user32.release();
  return user32.post(hwnd, 0x0112, 0xf010 | 2, 0);
}
function translatePet(buffer, point) {
  if (process.platform !== 'win32' || !Buffer.isBuffer(buffer) || buffer.length < 4 ||
      !Number.isSafeInteger(point?.x) || !Number.isSafeInteger(point?.y)) return false;
  const api = nativeApi(), hwnd = handle(buffer);
  if (!hwnd || !api.valid(hwnd)) return false;
  // Physical pixels; preserve native size, contents, focus, owner and Z-order.
  // No HWND resize, renderer remount, alpha clear or modal message loop.
  return api.position(hwnd, null, point.x, point.y, 0, 0, 0x0001 | 0x0004 | 0x0010 | 0x0200 | 0x0400);
}
module.exports = { startPetMove, translatePet };

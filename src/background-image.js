// Validate encoded dimensions before nativeImage is allowed to decode pixels.
const MAX_BYTES = 20 * 1024 * 1024;
const MAX_PIXELS = 40 * 1024 * 1024;

function imageDimensions(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 12 || buffer.length > MAX_BYTES) return null;
  let width, height;
  if (buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) && buffer.length >= 24 && buffer.toString("ascii", 12, 16) === "IHDR") {
    width = buffer.readUInt32BE(16); height = buffer.readUInt32BE(20);
  } else if (/^GIF8[79]a$/.test(buffer.toString("ascii", 0, 6))) {
    width = buffer.readUInt16LE(6); height = buffer.readUInt16LE(8);
  } else if (buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2;
    while (offset + 4 < buffer.length) {
      if (buffer[offset++] !== 0xff) return null;
      while (buffer[offset] === 0xff) offset++;
      const marker = buffer[offset++];
      if (marker === 0xda || marker === 0xd9) break;
      if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd8)) continue;
      if (offset + 2 > buffer.length) return null;
      const length = buffer.readUInt16BE(offset);
      if (length < 2 || offset + length > buffer.length) return null;
      if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker) && length >= 7) {
        height = buffer.readUInt16BE(offset + 3); width = buffer.readUInt16BE(offset + 5); break;
      }
      offset += length;
    }
  } else if (buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") {
    const type = buffer.toString("ascii", 12, 16);
    if (type === "VP8X" && buffer.length >= 30) {
      width = 1 + buffer.readUIntLE(24, 3); height = 1 + buffer.readUIntLE(27, 3);
    } else if (type === "VP8L" && buffer.length >= 25 && buffer[20] === 0x2f) {
      const bits = buffer.readUInt32LE(21); width = 1 + (bits & 0x3fff); height = 1 + ((bits >>> 14) & 0x3fff);
    } else if (type === "VP8 " && buffer.length >= 30 && buffer.subarray(23, 26).equals(Buffer.from([0x9d, 0x01, 0x2a]))) {
      width = buffer.readUInt16LE(26) & 0x3fff; height = buffer.readUInt16LE(28) & 0x3fff;
    }
  }
  return Number.isInteger(width) && Number.isInteger(height) && width > 0 && height > 0 &&
    width <= 16000 && height <= 16000 && width * height <= MAX_PIXELS ? { width, height } : null;
}

function decodeDataUrl(value) {
  if (typeof value !== "string" || value.length > Math.ceil(MAX_BYTES * 4 / 3) + 100) return null;
  const match = value.match(/^data:image\/(png|jpeg|webp|gif);base64,([A-Za-z0-9+/=]+)$/);
  if (!match) return null;
  const buffer = Buffer.from(match[2], "base64");
  return imageDimensions(buffer) ? buffer : null;
}

function normalizeCrop(value) {
  if (!value) return null;
  if (![value.x, value.y, value.width, value.height].every(Number.isFinite) || value.x < 0 || value.y < 0 ||
      value.width <= 0 || value.height <= 0 || value.x + value.width > 1.000001 || value.y + value.height > 1.000001) return null;
  return { x: value.x, y: value.y, width: value.width, height: value.height };
}

module.exports = { MAX_BYTES, imageDimensions, decodeDataUrl, normalizeCrop };

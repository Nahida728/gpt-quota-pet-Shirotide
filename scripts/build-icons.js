const path = require("node:path");
const sharp = require("sharp");
const fs = require("node:fs/promises");

const projectRoot = path.resolve(__dirname, "..");
const assetsDir = path.join(projectRoot, "assets");

async function buildIcons() {
  const master = path.join(assetsDir, "shirotide-icon-master.png");
  const icon = await sharp(master).resize(456, 456, { fit: "contain", background: "#00000000" })
    .extend({ top: 28, bottom: 28, left: 28, right: 28, background: "#00000000" }).png().toBuffer();
  await fs.writeFile(path.join(projectRoot, "src/renderer/assets/shirotide-icon.png"), icon);
  const sizes = [16, 24, 32, 48, 64, 128, 256];
  const images = await Promise.all(sizes.map(size => sharp(icon).resize(size, size).png().toBuffer()));
  const header = Buffer.alloc(6 + 16 * sizes.length); header.writeUInt16LE(1, 2); header.writeUInt16LE(sizes.length, 4);
  let offset = header.length;
  images.forEach((image, index) => {
    const at = 6 + index * 16, size = sizes[index];
    header[at] = header[at + 1] = size === 256 ? 0 : size;
    header.writeUInt16LE(1, at + 4); header.writeUInt16LE(32, at + 6);
    header.writeUInt32LE(image.length, at + 8); header.writeUInt32LE(offset, at + 12); offset += image.length;
  });
  await fs.writeFile(path.join(assetsDir, "icon.ico"), Buffer.concat([header, ...images]));
  const tray = await sharp(icon).resize(32, 32).png().toBuffer();
  await fs.writeFile(path.join(assetsDir, "tray-icon-on-dark.png"), tray);
  await fs.writeFile(path.join(assetsDir, "tray-icon-on-light.png"), tray);
}

buildIcons().catch(error => {
  console.error(error);
  process.exitCode = 1;
});

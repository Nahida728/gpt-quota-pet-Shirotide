// Local release gate. Never publishes or installs artifacts.
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
const asar = require("@electron/asar");
const yaml = require("js-yaml");
const root = path.resolve(__dirname, "..");
const pkg = require(path.join(root, "package.json"));
const lock = require(path.join(root, "package-lock.json"));
const output = path.join(root, "release");
const archive = path.join(output, "win-unpacked", "resources", "app.asar");
const entries = asar.listPackage(archive).map(name => name.replaceAll("\\", "/").replace(/^\//, ""));
const forbidden = entries.filter(name => /(^|\/)(?:readme(?:\.[^/]*)?|agents?\.md|\.git|test|tests|scripts|logs)(?:\/|$)/i.test(name) || /\.(?:log|tmp)$/i.test(name));
assert.deepEqual(forbidden, [], "Development files in ASAR");
assert.deepEqual(pkg.build.files, ["src/**/*", "package.json"]);
assert.equal(pkg.build.win.files, undefined);
assert.equal(lock.version, pkg.version);
assert.equal(lock.packages[""].version, pkg.version);
const packed = JSON.parse(asar.extractFile(archive, "package.json"));
assert.equal(packed.version, pkg.version);
assert.equal(packed.displayVersion, pkg.displayVersion);
assert.equal(packed.main, pkg.main);
const sourceNames = [];
function verifySource(directory) {
  for (const file of fs.readdirSync(directory, { withFileTypes: true })) {
    const filename = path.join(directory, file.name);
    if (file.isDirectory()) verifySource(filename);
    else {
      const relative = path.relative(root, filename);
      assert.deepEqual(asar.extractFile(archive, relative), fs.readFileSync(filename), relative);
      sourceNames.push(relative.replaceAll("\\", "/"));
    }
  }
}
verifySource(path.join(root, "src"));
assert.deepEqual(entries.filter(name => name.startsWith("src/") && !asar.statFile(archive, name.replaceAll("/", path.sep)).files).sort(), sourceNames.sort());
assert.ok(entries.some(name => /node_modules\/semver\/LICENSE/i.test(name)), "Dependency license missing");
const exe = fs.readFileSync(path.join(output, "win-unpacked", pkg.build.productName + ".exe"));
assert.equal(exe.toString("ascii", 0, 2), "MZ");
const pe = exe.readUInt32LE(0x3c);
assert.equal(exe.readUInt32LE(pe), 0x4550);
assert.equal(exe.readUInt16LE(pe + 4), 0x8664, "Application is not x64");
const channel = pkg.version.includes("-") ? `${pkg.build.publish.channel}.yml` : "latest.yml";
const updateConfig = yaml.load(fs.readFileSync(path.join(output, "win-unpacked", "resources", "app-update.yml"), "utf8"));
assert.equal(updateConfig.owner, "Nahida728");
assert.equal(`${updateConfig.owner}/${updateConfig.repo}`, require('../src/brand').REPOSITORY);
assert.equal(updateConfig.channel, pkg.build.publish.channel);
assert.equal(updateConfig.releaseType, pkg.build.publish.releaseType);
const feed = yaml.load(fs.readFileSync(path.join(output, channel), "utf8"));
assert.equal(feed.version, pkg.version);
assert.ok(feed.files?.length);
for (const file of feed.files) {
  assert.equal(path.basename(file.url), file.url);
  const bytes = fs.readFileSync(path.join(output, file.url));
  assert.equal(bytes.length, file.size);
  assert.equal(crypto.createHash("sha512").update(bytes).digest("base64"), file.sha512);
}
const prefix = `${require('../src/brand').ASSET_PREFIX}-${pkg.version}`;
const names = [`${prefix}-portable-x64.exe`, `${prefix}-setup-x64.exe`, `${prefix}-setup-x64.exe.blockmap`, channel];
const artifacts = names.map(name => {
  const bytes = fs.readFileSync(path.join(output, name));
  return { name, bytes: bytes.length, sha256: crypto.createHash("sha256").update(bytes).digest("hex") };
});
fs.writeFileSync(path.join(output, `SHA256SUMS-v${pkg.version}.txt`), artifacts.map(file => `${file.sha256}  ${file.name}`).join("\n") + "\n");
const result = { version: pkg.version, architecture: "x64", sourceFiles: sourceNames.length, exactSourceBytes: true,
  forbiddenFiles: forbidden, verifiedUpdateFeed: channel,
  asarSha256: crypto.createHash("sha256").update(fs.readFileSync(archive)).digest("hex"), artifacts };
fs.writeFileSync(path.join(output, `verified-artifacts-${pkg.version}.json`), JSON.stringify(result, null, 2) + "\n");
console.log(JSON.stringify(result, null, 2));

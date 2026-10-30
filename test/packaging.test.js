const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const packageJson = require(path.join(__dirname, "..", "package.json"));

test("development guidance and repository files are excluded from packaged apps", () => {
  assert.deepEqual(packageJson.build.files, ["src/**/*", "package.json"]);
  assert.equal(packageJson.build.win.files, undefined);
  assert.equal(packageJson.build.beforePack, "./scripts/filter-packaged-docs.cjs");
  for (const entry of packageJson.build.files) {
    assert.doesNotMatch(entry, /AGENTS?\.md|README|test|scripts/i);
  }
});

test("prerelease packages publish their matching update channel", () => {
  if (packageJson.version.includes("-")) {
    assert.equal(packageJson.build.publish.channel, packageJson.version.split("-")[1].split(".")[0]);
    assert.equal(packageJson.build.publish.releaseType, "prerelease");
  } else if (!packageJson.version.includes("-")) {
    assert.notEqual(packageJson.build.publish.channel, "beta");
    assert.equal(packageJson.build.publish.releaseType, "release");
  }
});

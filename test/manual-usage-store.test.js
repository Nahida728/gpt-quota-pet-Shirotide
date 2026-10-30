const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { readManualUsage, saveManualUsage } = require("../src/manual-usage-store");

function fixture(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "cqm-manual-store-"));
  t.after(() => {
    assert.ok(directory.startsWith(path.join(os.tmpdir(), "cqm-manual-store-")));
    fs.rmSync(directory, { recursive: true, force: true });
  });
  return path.join(directory, "manual-usage.json");
}
const entry = { provider: "Vendor", model: "model", inputTokens: 1000000, outputTokens: 100, inputPrice: 2, outputPrice: 8 };

test("manual usage survives cold reads and recovers corrupt or missing primary from backup", t => {
  const file = fixture(t);
  const first = saveManualUsage(file, { version: 1, entries: [entry] });
  saveManualUsage(file, { ...first, entries: [...first.entries, { ...entry, inputTokens: 2000000 }] });
  assert.equal(readManualUsage(file).entries.length, 2);
  fs.writeFileSync(file, "{broken");
  assert.deepEqual(readManualUsage(file), first);
  const corrupt = fs.readdirSync(path.dirname(file)).find(name => name.includes(".corrupt-"));
  assert.equal(fs.readFileSync(path.join(path.dirname(file), corrupt), "utf8"), "{broken");
  fs.unlinkSync(file);
  assert.deepEqual(readManualUsage(file), first);
});

test("overflow, invalid saves and unrecoverable files cannot replace manual usage or its backup", t => {
  const file = fixture(t);
  const ledger = saveManualUsage(file, { version: 1, entries: [entry] });
  saveManualUsage(file, ledger);
  const primary = fs.readFileSync(file), backup = fs.readFileSync(file + ".bak");
  for (const value of [{ version: 1, entries: Array(501).fill(entry) }, { version: 1, entries: [{}] }, {}]) {
    assert.throws(() => saveManualUsage(file, value));
    assert.deepEqual(fs.readFileSync(file), primary);
    assert.deepEqual(fs.readFileSync(file + ".bak"), backup);
  }
  fs.writeFileSync(file, "{broken");
  fs.writeFileSync(file + ".bak", "{broken backup");
  assert.throws(() => saveManualUsage(file, ledger));
  assert.equal(fs.readFileSync(file, "utf8"), "{broken");
  assert.equal(fs.readFileSync(file + ".bak", "utf8"), "{broken backup");
});

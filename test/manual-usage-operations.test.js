const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { readManualUsage, saveManualUsage, changeManualUsage } = require("../src/manual-usage-store");
const { groupManualUsage } = require("../src/manual-usage-operations");

function fixture(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "cqm-manual-operations-"));
  t.after(() => {
    assert.ok(directory.startsWith(path.join(os.tmpdir(), "cqm-manual-operations-")));
    fs.rmSync(directory, { recursive: true, force: true });
  });
  return path.join(directory, "manual-usage.json");
}
const entry = (provider = "A", model = "B", extra = {}) => ({ provider, model, mode: "exact", inputTokens: 1000000,
  cachedInputTokens: 200000, outputTokens: 100000, inputPrice: 2, cachedPrice: .2, outputPrice: 8, ...extra });
const models = ledger => groupManualUsage(ledger).flatMap(provider => provider.models);
const get = (ledger, provider = "A", model = "B") => models(ledger).find(row => row.provider === provider && row.model === model);
const target = (ledger, action, changes = {}, provider = "A", model = "B") => {
  const current = get(ledger, provider, model);
  return { action, targetId: current.id, revision: current.revision, entry: entry(provider, model, changes) };
};

test("cache writes remain an input subset with their own price across save, increment and edit", t => {
  const { resolveEntry } = require("../src/usage-ledgers");
  const file = fixture(t);
  const row = { provider: "4Router", model: "claude-haiku-5-5", mode: "exact", inputTokens: 1000000,
    cachedInputTokens: 300000, cacheWriteInputTokens: 100000, outputTokens: 50000,
    inputPrice: .1, cachedPrice: .01, cacheWritePrice: .125, outputPrice: .5 };
  let ledger = changeManualUsage(file, { action: "create", entry: row });
  assert.equal(resolveEntry(ledger.entries[0]).estimatedCostUsd, .1005);
  assert.equal(resolveEntry(ledger.entries[0]).totalTokens, 1050000);
  const old = get(ledger, "4Router", "claude-haiku-5-5");
  ledger = changeManualUsage(file, { action: "increment", targetId: old.id, revision: old.revision, entry: row });
  assert.equal(ledger.entries[0].cacheWriteInputTokens, 200000);
  assert.equal(resolveEntry(ledger.entries[0]).estimatedCostUsd, .201);
  assert.deepEqual(readManualUsage(file), ledger);
  const current = get(ledger, "4Router", "claude-haiku-5-5");
  const raw = fs.readFileSync(file), backup = fs.readFileSync(file + ".bak");
  ledger = changeManualUsage(file, { action: "replace", targetId: current.id, revision: current.revision, entry: current.draft });
  assert.deepEqual(fs.readFileSync(file), raw);
  assert.throws(() => changeManualUsage(file, { action: "increment", targetId: current.id, revision: current.revision,
    entry: { ...row, cacheWriteInputTokens: 900000 } }), /MANUAL_INVALID/);
  assert.deepEqual(fs.readFileSync(file), raw); assert.deepEqual(fs.readFileSync(file + ".bak"), backup);
});

test("provider models can be extended, incremented at new prices, and directly replaced without changing other providers", t => {
  const file = fixture(t);
  let ledger;
  for (const model of ["B", "C", "D", "E", "F"]) ledger = changeManualUsage(file, { action: "create", entry: entry("A", model) });
  ledger = changeManualUsage(file, { action: "create", entry: entry("Other", "B") });
  assert.deepEqual(groupManualUsage(ledger).map(provider => [provider.provider, provider.models.length]), [["A", 5], ["Other", 1]]);
  ledger = changeManualUsage(file, target(ledger, "increment", {
    inputTokens: 500000, cachedInputTokens: 100000, outputTokens: 50000, inputPrice: 4, cachedPrice: .4, outputPrice: 16
  }));
  const added = get(ledger);
  assert.deepEqual([added.inputTokens, added.cachedInputTokens, added.outputTokens, added.totalTokens], [1500000, 300000, 150000, 1650000]);
  assert.equal(added.entries.length, 2);
  assert.equal(added.estimatedCostUsd, 4.88); // original $2.44 + new $2.44; no repricing of the original batch
  const unrelated = ledger.entries.filter(row => row.provider !== "A" || row.model !== "B");
  ledger = changeManualUsage(file, target(ledger, "replace", { inputTokens: 600000, cachedInputTokens: 100000, outputTokens: 50000 }));
  assert.equal(get(ledger).totalTokens, 650000);
  assert.equal(get(ledger).estimatedCostUsd, 1.42);
  assert.equal(get(ledger).entries.length, 1);
  assert.deepEqual(ledger.entries.filter(row => row.provider !== "A" || row.model !== "B"), unrelated);
  assert.deepEqual(readManualUsage(file), ledger); // a fresh disk read, not the renderer snapshot
});

test("stale updates, duplicates and invalid inputs preserve both disk generations", t => {
  const file = fixture(t);
  let ledger = changeManualUsage(file, { action: "create", entry: entry() });
  const stale = target(ledger, "increment");
  ledger = changeManualUsage(file, target(ledger, "increment"));
  assert.equal(get(ledger).entries.length, 1); // same-price exact batches compact safely
  assert.equal(get(ledger).totalTokens, 2200000);
  ledger = changeManualUsage(file, target(ledger, "increment", { requestCount: 1 }));
  assert.equal(get(ledger).entries.length, 2); // keep known request evidence apart from unknown historical counts
  assert.equal(get(ledger).entries[1].requestCount, 1);
  const primary = fs.readFileSync(file), backup = fs.readFileSync(file + ".bak");
  const rejected = [stale, { ...stale, action: "replace" }, { ...stale, action: "remove" },
    { action: "create", entry: entry(" a ", "b") },
    target(ledger, "increment", { inputTokens: "-1" }),
    target(ledger, "increment", { cachedInputTokens: 2000000 }),
    target(ledger, "replace", { inputPrice: "bad" }),
    target(ledger, "replace", { outputPrice: 10001 }),
    { action: "defaults", defaults: { cacheHitRate: 120 } }];
  for (const change of rejected) {
    assert.throws(() => changeManualUsage(file, change), /MANUAL_/);
    assert.deepEqual(fs.readFileSync(file), primary);
    assert.deepEqual(fs.readFileSync(file + ".bak"), backup);
  }
  ledger = changeManualUsage(file, { action: "defaults", defaults: { inputShare: 80 } });
  assert.deepEqual(ledger.defaults, { inputShare: 80, cacheHitRate: 50 });
  assert.deepEqual(ledger.entries, readManualUsage(file).entries);
});

test("legacy mixed batches stay unchanged on an untouched edit; estimates and capacity remain bounded", t => {
  const file = fixture(t);
  let ledger = saveManualUsage(file, { version: 1, entries: [entry(), entry("A", "B", {
    mode: "estimate", totalTokens: 2000000, inputShare: 80, cacheHitRate: 50, inputPrice: 4, cachedPrice: .4, outputPrice: 16
  })] });
  saveManualUsage(file, ledger);
  const primary = fs.readFileSync(file), backup = fs.readFileSync(file + ".bak"), old = get(ledger);
  assert.equal(models(ledger).length, 1);
  ledger = changeManualUsage(file, { action: "replace", targetId: old.id, revision: old.revision, entry: old.draft });
  assert.equal(ledger.entries.length, 2);
  assert.deepEqual(fs.readFileSync(file), primary);
  assert.deepEqual(fs.readFileSync(file + ".bak"), backup);
  ledger = changeManualUsage(file, target(ledger, "increment", { mode: "estimate", totalTokens: 2000000, inputShare: 80, cacheHitRate: 50 }));
  assert.equal(get(ledger).totalTokens, old.totalTokens + 2000000);
  assert.equal(get(ledger).estimatedCostUsd, old.estimatedCostUsd + 4.96);
  assert.ok(get(ledger).estimated);
  assert.deepEqual(readManualUsage(file), ledger);

  ledger = saveManualUsage(file, { version: 1, entries: Array.from({ length: 500 }, (_, i) => entry("Full", "m" + i)) });
  ledger = changeManualUsage(file, target(ledger, "increment", {}, "Full", "m0"));
  assert.equal(ledger.entries.length, 500);
  const fullPrimary = fs.readFileSync(file), fullBackup = fs.readFileSync(file + ".bak");
  for (const change of [{ action: "create", entry: entry("New", "new") }, target(ledger, "increment", { inputPrice: 3 }, "Full", "m0")]) {
    assert.throws(() => changeManualUsage(file, change), /MANUAL_LIMIT/);
    assert.deepEqual(fs.readFileSync(file), fullPrimary);
    assert.deepEqual(fs.readFileSync(file + ".bak"), fullBackup);
  }
});

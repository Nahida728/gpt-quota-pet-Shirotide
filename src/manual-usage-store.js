const fs = require("node:fs");
const { normalizeManualLedger, MAX_ENTRIES } = require("./usage-ledgers");
const { writeJsonAtomically } = require("./store");
const { applyManualUsageChange } = require("./manual-usage-operations");

const MAX_BYTES = 4 * 1024 * 1024;

function validateLedger(value) {
  if (!value || value.version !== 1 || !Array.isArray(value.entries) || value.entries.length > MAX_ENTRIES) {
    throw new Error("Invalid manual usage ledger");
  }
  const normalized = normalizeManualLedger(value);
  if (normalized.entries.length !== value.entries.length || Buffer.byteLength(JSON.stringify(normalized)) > MAX_BYTES) {
    throw new Error("Invalid manual usage entries");
  }
  return normalized;
}

function readGeneration(filename) {
  if (fs.statSync(filename).size > MAX_BYTES) throw new Error("Manual usage file too large");
  return validateLedger(JSON.parse(fs.readFileSync(filename, "utf8")));
}

function readManualUsage(filename) {
  const backup = filename + ".bak";
  const primaryExists = fs.existsSync(filename);
  if (primaryExists) {
    try { return readGeneration(filename); } catch {}
  }
  if (fs.existsSync(backup)) {
    // Validate the backup before moving or replacing any primary bytes.
    const recovered = readGeneration(backup);
    if (primaryExists) fs.renameSync(filename, filename + ".corrupt-" + require("node:crypto").randomUUID());
    writeJsonAtomically(filename, recovered);
    return recovered;
  }
  if (primaryExists) throw new Error("Manual usage recovery unavailable");
  return normalizeManualLedger({});
}

function saveManualUsage(filename, value) {
  // Reject overflow instead of silently dropping the last user-entered row.
  const next = validateLedger(value);
  const previous = readManualUsage(filename);
  if (fs.existsSync(filename)) writeJsonAtomically(filename + ".bak", previous);
  writeJsonAtomically(filename, next);
  return next;
}

function changeManualUsage(filename, change) {
  // Read the current generation and apply one model-scoped operation. A stale
  // renderer may never replace unrelated providers or overwrite a newer model.
  const previous = readManualUsage(filename);
  const next = validateLedger(applyManualUsageChange(previous, change, { id: "m-" + require("node:crypto").randomUUID() }));
  if (JSON.stringify(next) === JSON.stringify(previous)) return previous;
  if (fs.existsSync(filename)) writeJsonAtomically(filename + ".bak", previous);
  writeJsonAtomically(filename, next);
  return next;
}

module.exports = { readManualUsage, saveManualUsage, changeManualUsage };

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const MAX_INSTANCES = 64;
const MAX_METADATA_BYTES = 256 * 1024;

function uniquePaths(paths) {
  const found = new Map();
  for (const value of paths) {
    if (typeof value !== "string" || !path.isAbsolute(value)) continue;
    let resolved = path.resolve(value);
    try { resolved = fs.realpathSync.native(resolved); } catch {}
    const key = process.platform === "win32" ? resolved.toLowerCase() : resolved;
    if (!found.has(key)) found.set(key, resolved);
  }
  return [...found.values()];
}

function readInstancePaths(file) {
  try {
    if (fs.statSync(file).size > MAX_METADATA_BYTES) return {};
    const value = JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/, ""));
    // Never retain instance identities, relay configuration, auth or launch data.
    return { home: value.codexHome, sqliteHome: value.sqliteHome };
  } catch { return {}; }
}

function discoverCodexSources({ home = os.homedir(), env = process.env } = {}) {
  const homes = [path.join(home, ".codex"), env.CODEX_HOME];
  const sqliteHomes = [env.CODEX_SQLITE_HOME];
  const registries = [
    path.join(home, ".codex-session-delete", "codex-multi"),
    path.join(home, ".codex-multi"),
    ...(env.LOCALAPPDATA ? [path.join(env.LOCALAPPDATA, "CodexPlusPlus", "multi")] : [])
  ];
  // Custom launchers can supply additional homes without exposing credentials.
  for (const value of String(env.CODEX_MONITOR_HOMES || "").split(path.delimiter)) homes.push(value.trim());
  for (const registry of registries) {
    let entries;
    try { entries = fs.readdirSync(registry, { withFileTypes: true }); } catch { continue; }
    for (const entry of entries.filter(item => item.isDirectory()).slice(0, MAX_INSTANCES)) {
      const instance = path.join(registry, entry.name);
      const metadata = readInstancePaths(path.join(instance, "instance.json"));
      homes.push(metadata.home, path.join(instance, "codex-home"));
      sqliteHomes.push(metadata.sqliteHome, path.join(instance, "sqlite-home"));
    }
  }
  const codexHomes = uniquePaths(homes).slice(0, MAX_INSTANCES + 2);
  return {
    homes: codexHomes,
    sqliteHomes: uniquePaths([...sqliteHomes, ...codexHomes]),
    sessionRoots: uniquePaths(codexHomes.flatMap(root => [path.join(root, "sessions"), path.join(root, "archived_sessions")])),
    registries: uniquePaths(registries)
  };
}

function configuredSessionRoots({ sessionsRoot, archivedSessionsRoot, sessionRoots } = {}) {
  if (Array.isArray(sessionRoots) && sessionRoots.length) return uniquePaths(sessionRoots);
  if (!sessionsRoot && !archivedSessionsRoot) return null;
  const primary = sessionsRoot || path.join(os.homedir(), ".codex", "sessions");
  return uniquePaths([primary, archivedSessionsRoot || path.join(path.dirname(primary), "archived_sessions")]);
}

module.exports = { discoverCodexSources, configuredSessionRoots, uniquePaths };

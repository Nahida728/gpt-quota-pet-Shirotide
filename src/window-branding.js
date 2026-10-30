const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

// Windows caches shell icons by path. Give updated artwork its own path while
// retaining the app identity that owns existing shortcuts and stored data.
function taskbarIconPath(iconPath, userData) {
  const bytes = fs.readFileSync(iconPath);
  const digest = crypto.createHash('sha256').update(bytes).digest('hex').slice(0, 16);
  const directory = path.join(userData, 'icons');
  const filename = path.join(directory, `shirotide-${digest}.ico`);
  fs.mkdirSync(directory, { recursive: true });
  if (!fs.existsSync(filename) || !fs.readFileSync(filename).equals(bytes)) fs.writeFileSync(filename, bytes);
  return filename;
}

function applyWindowBranding(window, iconPath, displayName, relaunchArguments) {
  window.setIcon(iconPath);
  // This is a Windows command-line property, not a shell invocation. Quote
  // embedded quotes and trailing backslashes using CommandLineToArgvW rules.
  const quote = value => '"' + String(value).replace(/(\\*)"/g, '$1$1\\"').replace(/(\\*)$/, '$1$1') + '"';
  if (process.platform === 'win32') window.setAppDetails({
    appId: 'com.codex.quota-monitor', appIconPath: iconPath, appIconIndex: 0,
    relaunchDisplayName: displayName, relaunchCommand: relaunchArguments.map(quote).join(' ')
  });
}

module.exports = { taskbarIconPath, applyWindowBranding };

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const root = path.join(__dirname,"..","src");
const html = fs.readFileSync(path.join(root,"renderer","index.html"),"utf8");
const css = fs.readFileSync(path.join(root,"renderer","workbench.css"),"utf8");
const renderer = fs.readFileSync(path.join(root,"renderer","renderer.js"),"utf8");
const shell = fs.readFileSync(path.join(root,"renderer","workbench.js"),"utf8");
const main = fs.readFileSync(path.join(root,"main.js"),"utf8");
const preload = fs.readFileSync(path.join(root,"preload.js"),"utf8");

test("every retained business binding resolves to a unique element",()=>{
 const array=renderer.slice(renderer.indexOf("const elements ="),renderer.indexOf("].map(id =>"));
 const ids=[...html.matchAll(/id="([^"]+)"/g)].map(match=>match[1]);
 assert.equal(new Set(ids).size,ids.length,"Duplicate IDs in the page tree");
 for(const match of array.matchAll(/"([A-Za-z][A-Za-z0-9]+)"/g))assert.ok(ids.includes(match[1]),"Missing element: "+match[1]);
});
test("desktop shell contains six independent pages and one refresh action",()=>{
 assert.deepEqual([...html.matchAll(/data-page="([^"]+)"/g)].map(match=>match[1]),["overview","usage","tasks","quota","updates","settings"]);
 assert.equal([...html.matchAll(/id="refreshButton"/g)].length,1);
 assert.match(shell,/querySelectorAll\("\.workspace-page\[data-page\]"\)/);
 assert.doesNotMatch(html,/floating-orb|top-dock-tab|drag-edge|collapseButton/);
});
test("frameless resizable desktop window keeps native caption controls and no shaping",()=>{
 assert.match(main,/frame: false, transparent: false/);assert.match(main,/resizable: true, movable: true, maximizable: true/);
 assert.match(main,/titleBarStyle: "hidden"/);assert.match(main,/titleBarOverlay:/);
 assert.match(css,/-webkit-app-region:drag/);assert.match(css,/-webkit-app-region:no-drag/);
 assert.doesNotMatch(main,/setShape|will-resize|setMaximumSize|startSystemWindowMove|isTopDock/);
 assert.match(main,/getNormalBounds\(\)/);assert.match(main,/isMinimized\(\)/);
 assert.match(main,/requestSingleInstanceLock\(\)/);
 assert.doesNotMatch(preload,/setCollapsed|revealTopDock|setPositionLocked|beginOrbGesture/);
});
test("quota, token, task and permanent history views remain reachable",()=>{
 for(const id of ["fiveHourPanel","weeklyPanel","reservePanel","tokenUsageModal","tokenCostModal","activeTaskModal","subscriptionModal","resetCreditList","receivedResetHistoryList","consumedResetHistoryList","officialResetHistoryList","clientUpdateHistoryList","checkpointStatistics","taskPerformanceScope"])
  assert.ok(html.includes('id="'+id+'"'),id);
 assert.match(html,/data-panel="usage:trend"/);assert.match(html,/data-panel="usage:cost"/);assert.match(html,/data-panel="tasks:all"/);
 assert.match(html,/data-panel="quota:subscription"/);assert.match(html,/data-panel="quota:official"/);
});
test("shared state keeps accounting denominators and completion outcomes",()=>{
 assert.match(renderer,/usage\.lifetimeTokens\s*\/\s*workDays/);assert.match(renderer,/cost\.estimatedCostUsd\s*\/\s*workDays/);
 assert.match(renderer,/function confirmAllCompletedTasks/);assert.match(renderer,/completedTaskCount/);assert.match(renderer,/manualInterruptedTaskCount/);assert.match(renderer,/abnormalInterruptedTaskCount/);
 assert.match(renderer,/function syncWorkbench/);assert.match(renderer,/function renderTaskDrawer/);assert.match(renderer,/noMatchingTasks/);
});
test("charts resize to their container and respect reduced motion",()=>{
 assert.match(renderer,/getBoundingClientRect\(\)/);assert.match(renderer,/new ResizeObserver/);
 assert.match(renderer,/prefers-reduced-motion: reduce/);assert.match(renderer,/window\.Workbench\.visible\(elements.tokenUsageChart\)/);
 assert.match(html,/data-token-period="day"/);assert.match(html,/data-token-period="week"/);assert.match(html,/data-token-period="month"/);
 assert.match(css,/grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/);assert.match(css,/@media \(max-width:1199px\)/);
 assert.doesNotMatch(css,/text-overflow:\s*ellipsis|width:\s*460px|height:\s*690px/);
});
test("background composition and persistence are bounded and independent of window size",()=>{
 assert.match(preload,/validateBackground/);assert.match(main,/fs\.fsyncSync\(handle\)/);
 assert.match(main,/safeRemoveBackground/);assert.match(renderer,/normalize|cropAspectRatio/);
 assert.doesNotMatch(renderer,/canvas\.width = 460|naturalWidth <= 460|460 \/ 690/);
 assert.match(html,/id="applyAppearance"/);assert.match(html,/id="cancelAppearance"/);assert.match(html,/id="useWholeBackground"/);
});
test("remaining overlays retain security, focus and bounded motion",()=>{
 assert.match(main,/contextIsolation: true/);assert.match(main,/nodeIntegration: false, sandbox: true/);
 assert.match(html,/default-src 'self'; style-src 'self'; script-src 'self'; img-src 'self' data:/);
 assert.match(renderer,/secondaryModalQueue/);assert.match(renderer,/setWorkspaceInert/);assert.match(renderer,/event.key === "Tab"/);
 assert.match(css,/secondary-dialog-enter/);assert.match(css,/secondary-dialog-exit/);assert.match(css,/prefers-reduced-motion:reduce/);
});

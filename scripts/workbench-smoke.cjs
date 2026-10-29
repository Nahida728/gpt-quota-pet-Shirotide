// Development-only renderer exercise. Uses synthetic data and a hidden window.
const { app, BrowserWindow } = require("electron");
const fs = require("node:fs");
const path = require("node:path");
const { spawn } = require("node:child_process");
const root = path.resolve(__dirname, "..");
const port = 43125;
const previewDir=path.join(root,"docs","previews");
fs.mkdirSync(previewDir,{recursive:true});
let server, win;
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const evaluate = source => win.webContents.executeJavaScript(source);
const routes = [["overview"], ["usage", "ledger"], ["usage", "trend"], ["usage", "cost"], ["usage", "pricing"], ["tasks", "running"], ["tasks", "pending"], ["tasks", "statistics"], ["quota", "credits"], ["quota", "subscription"], ["quota", "official"], ["quota", "forecast"], ["updates"], ["settings", "general"], ["settings", "sources"], ["settings", "diagnostics"], ["settings", "about"]];

app.whenReady().then(async () => {
  const errors = [], results = [];
  try {
    server = spawn(process.execPath, [path.join(__dirname, "renderer-preview-server.js")], { env: { ...process.env, ELECTRON_RUN_AS_NODE: "1", PREVIEW_PORT: String(port) }, windowsHide: true, stdio: ["ignore", "pipe", "pipe"] });
    await new Promise((resolve, reject) => { server.stdout.once("data", resolve); server.once("error", reject); server.once("exit", code => reject(new Error("Preview server exited " + code))); });
    win = new BrowserWindow({ width:1360, height:900, useContentSize:true, show:false, frame:false, titleBarStyle:"hidden", titleBarOverlay:{color:"#f3f8fc",symbolColor:"#245466",height:52}, resizable:true, webPreferences:{ offscreen:true, sandbox:true, contextIsolation:true, nodeIntegration:false } });
    win.webContents.on("console-message", (_event, details) => { if (details.level === "error" || details.level === 3) errors.push(details.message); });
    win.webContents.on("render-process-gone", () => errors.push("Renderer process exited"));
    for (const language of ["zh", "en"]) {
      await win.loadURL(`http://127.0.0.1:${port}/?fixed=1&lang=${language}&fiveHour=1&reserve=1&tasks=4&completed=1&credits=9`);
      for (let i=0; i<40; i++) { if (await evaluate("workbenchReady && Boolean(latestSnapshot)")) break; await delay(100); }
      if (!await evaluate("workbenchReady && Boolean(latestSnapshot)")) throw new Error("Renderer did not finish initialization");
      for (let i=0; i<40; i++) { if (await evaluate("elements.loadingLayer.classList.contains('is-hidden')")) break; await delay(100); }
      if (!await evaluate("elements.loadingLayer.classList.contains('is-hidden')")) throw new Error("Splash did not dismiss");
      const before = await evaluate("JSON.stringify([latestSnapshot.tokenUsage,latestSnapshot.tokenCost,activeTaskRecords])");
      for (const size of [[1360,900],[1000,680]]) {
        win.setContentSize(...size);
        for (const [page,tab] of routes) {
          await evaluate(`window.Workbench.navigate(${JSON.stringify(page)},${JSON.stringify(tab || null)});`);
          await delay(110);
          const result = await evaluate(`(() => {
            const visible=e=>Boolean(e.getBoundingClientRect().width && e.getBoundingClientRect().height && !e.closest('[hidden]'));
            const clipped=[];
            for(const e of document.querySelectorAll('strong,small,span,p,h1,h2,h3,button,select,input,.quota-reset')){
              if(!visible(e)||e.children.length||!e.textContent.trim()||e.closest('.table-scroll,.visually-hidden'))continue;
              const style=getComputedStyle(e);
              if(e.clientWidth>0 && e.scrollWidth>e.clientWidth+2 && !['auto','scroll'].includes(style.overflowX))clipped.push({id:e.id||e.className,text:e.textContent.slice(0,70),axis:'x'});
              if(e.clientHeight>0 && e.scrollHeight>e.clientHeight+2 && !['auto','scroll'].includes(style.overflowY))clipped.push({id:e.id||e.className,text:e.textContent.slice(0,70),axis:'y'});
            }
            const missing=[...document.querySelectorAll('[data-i18n],[data-label-key]')].map(e=>e.dataset.i18n||e.dataset.labelKey).filter(key=>!i18n[language][key]);
            const pageCount=[...document.querySelectorAll('.workspace-page[data-page]')].filter(e=>!e.hidden).length;
            return {clipped,missing,pageCount,overflow:document.documentElement.scrollWidth>innerWidth+1||document.body.hidden};
          })()`);
          results.push({language,size,page,tab,...result});
          const shot = name => process.argv.includes("--capture") && delay(560).then(async () => fs.writeFileSync(path.join(previewDir, name), (await win.webContents.capturePage()).toPNG()));
          if (language === "zh" && size[0] === 1360 && page === "overview") await shot("tidemark-overview-zh.png");
          if (language === "zh" && size[0] === 1360 && page === "usage" && tab === "ledger") await shot("tidemark-ledger-zh.png");
          if (language === "en" && size[0] === 1000 && page === "overview") await shot("tidemark-overview-en-1000.png");
          if (language === "en" && size[0] === 1000 && page === "usage" && tab === "ledger") await shot("tidemark-ledger-en-1000.png");
        }
      }
      await evaluate("window.Workbench.navigate('tasks','running');document.querySelector('[data-task-detail-id]')?.click();");
      if (!await evaluate("!elements.taskDetailDrawer.hidden")) throw new Error("Task drawer did not open");
      await evaluate("closeTaskDrawer();elements.taskSearch.value='no-task-can-match-this';renderActiveTaskDetails();");
      if (!await evaluate("elements.activeTaskList.querySelectorAll('.active-task-item').length === 0")) throw new Error("Task search did not filter");
      await evaluate("elements.taskSearch.value='';window.Workbench.navigate('tasks','pending');confirmAllCompletedTasks();");
      const after = await evaluate("JSON.stringify([latestSnapshot.tokenUsage,latestSnapshot.tokenCost,activeTaskRecords])");
      if (before !== after) throw new Error("Navigation or confirmation modified numeric records");
      await evaluate("window.Workbench.navigate('settings','general');document.getElementById('cardOpacity').value=93;document.getElementById('cardOpacity').dispatchEvent(new Event('input'));document.getElementById('cancelAppearance').click();");
      if (!await evaluate("JSON.stringify(backgroundAppearance)===JSON.stringify(savedAppearance)")) throw new Error("Appearance cancel did not restore state");
      await evaluate("openConnectionStatus();"); await delay(280);
      if (!await evaluate("!elements.connectionStatusModal.hidden")) throw new Error("Connection dialog did not open");
      await evaluate("closeConnectionStatus();"); await delay(350);
      await evaluate("openStatScope(document.querySelector('[data-stat-scope=\"token-daily-cost\"]'));openConnectionStatus();");
      if(!await evaluate("elements.connectionStatusModal.hidden && !elements.statScopeModal.hidden"))throw new Error("Diagnostic overlays stacked");
      await evaluate("closeStatScope();");await delay(360);
      if(!await evaluate("!elements.connectionStatusModal.hidden && document.querySelector('.workspace').inert"))throw new Error("Queued dialog focus isolation failed");
      await evaluate("closeConnectionStatus();");await delay(360);
    }
    await win.loadURL(`http://127.0.0.1:${port}/?fixed=1&lang=en&offline=1&fiveHour=0&reserve=0&tasks=2&completed=1&bg=1`);
    await delay(500);
    const offline = await evaluate(`(() => {
      const first=!elements.connectionStatusModal.hidden;
      closeConnectionStatus();
      renderOffline(latestSnapshot);renderOffline(latestSnapshot);
      return {first,once:automaticOfflineAlertShown,localUsage:Boolean(elements.lifetimeTokenValue.textContent),stillPages:document.querySelectorAll('.workspace-page[data-page]').length===6};
    })()`);
    const failures=results.filter(r=>r.clipped.length||r.missing.length||r.pageCount!==1||r.overflow);
    fs.writeFileSync(path.join(root,'.tmp-ui','workbench-results.json'),JSON.stringify({results,offline,errors},null,2));
    console.log(JSON.stringify({views:results.length,failingViews:failures.length,issues:[...new Set(failures.flatMap(r=>r.clipped.map(c=>JSON.stringify(c))))],missing:[...new Set(failures.flatMap(r=>r.missing))],pageFailures:failures.filter(r=>r.pageCount!==1||r.overflow).map(r=>({page:r.page,tab:r.tab,language:r.language,size:r.size})),offline,errors},null,2));
    if (errors.length || results.some(r=>r.clipped.length||r.missing.length||r.pageCount!==1||r.overflow) || Object.values(offline).some(value=>!value)) app.exitCode=1;
  } catch (error) { console.error(error.stack); app.exitCode=1; }
  finally { server?.kill(); win?.destroy(); app.exit(app.exitCode || 0); }
});

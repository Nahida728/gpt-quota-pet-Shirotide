// Launch the real portable with isolated retained data; no installation/screenshots.
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const { createQuotaStateStore } = require('../src/store');
const { readManualUsage } = require('../src/manual-usage-store');
const { ASSET_PREFIX } = require('../src/brand');
const root = path.resolve(__dirname, '..'), pkg = require('../package.json');
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'shirotide-release-'));
const seed = path.join(root, '.tmp-ui/preview-profile');
const source = path.join(seed, 'quota-state.json');
const stateFile = path.join(profile, 'quota-state.json');
const sourceBytes = fs.readFileSync(source);
assert.ok(sourceBytes.length <= 64 * 1024 * 1024);
fs.writeFileSync(stateFile, sourceBytes);
const fingerprint = state => JSON.stringify([state.tokenCostSnapshot, state.taskPerformanceRecords,
  state.receivedResetHistory, state.consumedResetHistory, state.codexClientUpdateHistory, state.communityResetHistory]);
const first = createQuotaStateStore(stateFile), expected = fingerprint(first.data);
first.set('releaseAudit', true, { forceBackup: true });
assert.equal(fingerprint(createQuotaStateStore(stateFile).data), expected);
fs.writeFileSync(stateFile, '{}');
assert.equal(fingerprint(createQuotaStateStore(stateFile).data), expected);
for (const name of ['manual-usage.json', 'manual-usage.json.bak']) {
  if (fs.existsSync(path.join(seed, name))) fs.copyFileSync(path.join(seed, name), path.join(profile, name));
}
const manualBefore = readManualUsage(path.join(profile, 'manual-usage.json'));
fs.writeFileSync(path.join(profile, 'settings.json'), JSON.stringify({ language: 'zh', alwaysOnTop: false,
  desktopWindow: { x: 60, y: 30, width: 1200, height: 800 }, desktopSettingsVersion: 2, closeBehavior: 'tray',
  petMode: false, petSettings: { sound: false } }));
const exe = path.join(root, 'release', `${ASSET_PREFIX}-${pkg.version}-portable-x64.exe`);
const mainPort = 9355;
const launch = () => spawn(exe, [`--user-data-dir=${profile}`, `--inspect=${mainPort}`], { windowsHide: true, stdio: 'ignore' });
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
let child, socket, sequence = 0, owned = false;
async function connect() {
  for (let attempt = 0; attempt < 160; attempt++) {
    try {
      const target = (await (await fetch(`http://127.0.0.1:${mainPort}/json/list`)).json())[0];
      if (target) {
        socket = new WebSocket(target.webSocketDebuggerUrl);
        await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }); });
        await delay(1000); return;
      }
    } catch {}
    await delay(250);
  }
  throw Error('Isolated portable did not start');
}
function evaluate(expression) {
  const id = ++sequence;
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(Error('Runtime gate timed out')), 30000);
    const handler = event => {
      const m = JSON.parse(event.data); if (m.id !== id) return;
      clearTimeout(timer); socket.removeEventListener('message', handler);
      if (m.error || m.result?.exceptionDetails) reject(Error((m.error?.message || m.result.exceptionDetails.exception?.description)+' during '+expression.slice(0,110)));
      else resolve(m.result?.result?.value);
    };
    socket.addEventListener('message', handler);
    socket.send(JSON.stringify({ id, method: 'Runtime.evaluate', params: { expression, awaitPromise: expression.includes("async"), returnByValue: true } }));
  });
}
const infoExpression = `(()=>{const load=process.mainModule.require.bind(process.mainModule);const {app,BrowserWindow}=load('electron');const w=BrowserWindow.getAllWindows().find(w=>/renderer\\/index\\.html$/.test(w.webContents.getURL()));if(!w)return null;w.webContents.setBackgroundThrottling(false);const p=w.webContents.getLastWebPreferences();return {pid:process.pid,packaged:app.isPackaged,version:app.getVersion(),profile:app.getPath('userData'),executable:process.execPath,bounds:w.getBounds(),maximum:w.getMaximumSize(),minimized:w.isMinimized(),sandbox:p.sandbox,contextIsolation:p.contextIsolation,nodeIntegration:p.nodeIntegration,asar:load('node:crypto').createHash('sha256').update(load('original-fs').readFileSync(load('node:path').join(process.resourcesPath,'app.asar'))).digest('hex')}})()`;
const inRenderer = source => evaluate(`globalThis.__releaseRendererGate=(async()=>{const {BrowserWindow}=process.mainModule.require('electron');const w=BrowserWindow.getAllWindows().find(w=>/renderer\\/index\\.html$/.test(w.webContents.getURL()));return w.webContents.executeJavaScript(${JSON.stringify(source)})})()`);
const inPet = source => evaluate(`globalThis.__releasePetGate=(async()=>{const {BrowserWindow}=process.mainModule.require('electron');const w=BrowserWindow.getAllWindows().find(w=>/pet\\/index\\.html$/.test(w.webContents.getURL()));return w.webContents.executeJavaScript(${JSON.stringify(source)})})()`);
async function shutdown() {
  await evaluate("setTimeout(()=>process.mainModule.require('electron').app.quit(),50);true");
  socket.close(); socket = null; owned = false;
  for (let i = 0; i < 80; i++) { try { await fetch(`http://127.0.0.1:${mainPort}/json/list`); } catch { return; } await delay(100); }
  throw Error('Isolated portable did not quit');
}
(async()=>{
  try {
    child = launch(); await connect();
    let native;
    for (let i = 0; i < 100; i++) { native = await evaluate(infoExpression).catch(error=>{if(error.message.includes("Promise was collected"))return null;throw error;}); if (native) break; await delay(100); }
    assert.equal(native.version, pkg.version); assert.equal(native.packaged, true);
    assert.equal(path.resolve(native.profile), path.resolve(profile)); owned = true;
    assert.ok(native.sandbox && native.contextIsolation && !native.nodeIntegration);
    console.log(JSON.stringify({bounds:native.bounds,maximum:native.maximum,minimized:native.minimized}));
    // Electron/Windows may round outer/min-max bounds by a few DIPs at fractional scaling.
    assert.ok(native.maximum[0]<=1204 && native.maximum[1]<=804);
    assert.ok(Math.abs(native.bounds.width-native.maximum[0])<=2 && Math.abs(native.bounds.height-native.maximum[1])<=2);
    assert.equal(native.asar, require(path.join(root,'release',`verified-artifacts-${pkg.version}.json`)).asarSha256);
    let ready = false;
    for (let i = 0; i < 120; i++) { ready = await inRenderer("typeof workbenchReady !== 'undefined' && workbenchReady"); if (ready) break; await delay(150); }
    assert.ok(ready);
    console.log('Portable version/ASAR gate passed');
    const ledger = await inRenderer('window.codexMonitor.readManualUsage()');
    assert.deepEqual(ledger, manualBefore);
    const presentation = await inRenderer(`(async()=>{
      const original={tasks:activeTasks,pending:pendingTasks,available:activeTasksAvailable,language};
      for(const node of document.querySelectorAll('[aria-modal="true"]'))if(!node.hidden){cancelSecondaryModalTransition(node);node.hidden=true;}
      secondaryModalQueue.length=0;setWorkspaceInert(false);
      const task={id:'release-layout',projectName:'Shirotide task',startedAt:Date.now()/1000-30,elapsedSeconds:30,estimatedCostUsd:.12,models:[{model:'gpt-6.2-sol',inputTokens:1000,cachedInputTokens:800,outputTokens:100,estimatedCostUsd:.12}],telemetry:{serviceTier:'Standard'}};
      pendingTasks=[];
      const results=[];
      for(const locale of ['zh','en']){
        language=locale;applyLanguage();Workbench.navigate('overview','main',{focus:false});
        const pending={...task,id:'release-pending',outcome:'completed',endedAt:task.startedAt,completedAt:Date.now()-30000};
        renderActiveTasks({available:true,tasks:[task],latestTask:task,pendingTasks:[pending,{...pending,id:'release-other'},{...pending,id:'release-overflow'}],
          lastMeasuredFirstToken:{ms:305000,endedAt:task.startedAt,projectName:pending.projectName}});
        const rows=[...elements.activeTaskPreviewList.querySelectorAll('.active-task-preview-row')];
        const preview=rows.length===3&&rows.slice(1).every(row=>row.classList.contains('is-completed'))&&!elements.activeTaskMoreIndicator.hidden&&
          elements.activeTaskPreviewList.getBoundingClientRect().bottom<=elements.activeTaskMoreIndicator.getBoundingClientRect().top+1;
        const timing=elements.latestTaskFirstTokenLabel.textContent===t('taskPreviousFirstToken')&&
          elements.latestTaskFirstToken.textContent===formatTaskDuration(305)&&
          elements.latestTaskStreamingDuration.textContent===t('taskTimingNotLogged')&&
          elements.latestTaskServiceTier.textContent==='Standard';
        renderTaskPerformance({...task,telemetry:{...task.telemetry,streamingDurationMs:8400}});
        const recordedDuration=elements.latestTaskStreamingDuration.textContent==='8.4s'&&
          elements.latestTaskStreamingLabel.textContent===t('taskStreamingDuration');
        lastStreamingTiming={ms:25500,kind:'output-span',endedAt:task.startedAt,projectName:pending.projectName};
        renderTaskPerformance({...task,telemetry:{...task.telemetry,totalTokens:1100,reasoningOutputTokens:95}});
        const previousSpan=elements.latestTaskStreamingDuration.textContent==='25.5s'&&
          elements.latestTaskStreamingLabel.textContent===t('taskLastOutputSpan')&&
          elements.latestTaskTokens.title.includes(t('taskReasoningIncluded',{tokens:formatTokenCount(95)}));
        lastStreamingTiming=null;
        elements.activeTaskCard.click();
        const allTasks=document.body.dataset.tab==='all'&&elements.taskFilter.value==='all'&&
          elements.activeTaskList.querySelectorAll('.active-task-item').length===4;
        activeTasks=[{...task,telemetry:{...task.telemetry,totalTokens:1100,reasoningOutputTokens:95,
          streamingDurationKind:'output-span',streamingDurationMs:25500}},
          {...task,id:'release-layout-2',taskKind:'subagent'}];pendingTasks=[];
        Workbench.navigate('tasks','running',{focus:false});renderActiveTaskDetails();
        const cards=[...elements.activeTaskList.querySelectorAll('.active-task-item')];
        const source=cards[0].querySelector('[data-task-detail-id]');source.focus();source.click();
        await new Promise(resolve=>setTimeout(resolve,60));
        const modal=elements.taskDetailModal,dialog=modal.querySelector('.task-detail-dialog'),rect=dialog.getBoundingClientRect();
        const detailStats=[...elements.taskDetailContent.querySelectorAll('.active-task-item-stats > div')];
        const reasoningDetail=detailStats.some(node=>node.children[0].textContent===t('taskReasoningTokens')&&node.children[1].textContent===formatTokenCount(95));
        const current={locale,preview,timing,recordedDuration,previousSpan,reasoningDetail,allTasks,cards:cards.length,sameRow:Math.abs(cards[0].getBoundingClientRect().top-cards[1].getBoundingClientRect().top)<1,
          modal:!modal.hidden&&modal.getAttribute('aria-modal')==='true',centered:Math.abs(rect.left+rect.width/2-innerWidth/2)<2,
          focused:document.activeElement===elements.taskDetailClose,inert:document.querySelector('.workspace').inert,
          transition:getComputedStyle(elements.taskDetailClose).transitionDuration};
        document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
        await new Promise(resolve=>setTimeout(resolve,350));
        current.closed=modal.hidden;current.restored=document.activeElement===source;current.unblocked=!document.querySelector('.workspace').inert;
        results.push(current);
      }
      activeTasks=original.tasks;pendingTasks=original.pending;activeTasksAvailable=original.available;language=original.language;applyLanguage();
      return results;
    })()`);
    console.log(JSON.stringify({presentation}));
    for (const row of presentation) for (const key of ['preview','timing','recordedDuration','previousSpan','reasoningDetail','allTasks','sameRow','modal','centered','focused','inert','closed','restored','unblocked']) assert.equal(row[key],true,`${row.locale}:${key}`);
    const trend = await inRenderer(`(()=>{
      const old=latestSnapshot;
      const dailyUsageBuckets=Array.from({length:35},(_,i)=>({startDate:new Date(Date.UTC(2026,9,i+1)).toISOString().slice(0,10),tokens:10000}));
      latestSnapshot={tokenUsage:{available:true,scope:'account',lifetimeTokens:350000,totalWorkDays:35,dailyUsageBuckets},
        tokenCost:{available:true,estimatedCostUsd:35,localUsage:{totalWorkDays:7},models:[{model:'gpt-6.2-sol',inputTokens:35000,
          outputTokens:0,estimatedCostUsd:35,priced:true,pricing:{vendor:'OpenAI'}}]}};
      Workbench.navigate('usage','trend',{focus:false});tokenPeriod='day';renderTokenUsageModal();
      const result={days:tokenChartSeries.length,avgTokens:elements.tokenModalDailyAverage.textContent===formatTokenCount(10000),
        avgCost:elements.tokenModalDailyCost.textContent===ledgerCost(10,false),height:elements.tokenUsageChart.getBoundingClientRect().height};
      latestSnapshot=old;return result;
    })()`);
    assert.equal(trend.days,35);
    assert.ok(trend.avgTokens && trend.avgCost && trend.height > 300, JSON.stringify(trend));
    assert.deepEqual(await inRenderer('window.codexMonitor.readManualUsage()'),manualBefore);
    console.log('Bilingual modal/ledger gate passed');
    if(process.argv.includes('--screenshots')) {
      const directory=path.join(root,'docs/screenshots');fs.mkdirSync(directory,{recursive:true});
      let screenshotReady=false;
      for(let i=0;i<240;i++) {
        screenshotReady=await inRenderer('Boolean(latestSnapshot) && elements.loadingLayer.classList.contains("is-hidden")');
        if(screenshotReady)break;await delay(250);
      }
      assert.ok(screenshotReady,'Wait for the actual workspace, not the splash');
      for(const locale of ['zh','en']) {
        await inRenderer(`(async()=>{language=${JSON.stringify(locale)};await codexMonitor.setLanguage(language);applyLanguage();Workbench.navigate('overview','main',{focus:false});syncWorkbench();})()`);
        await delay(500);
        const destination=path.join(directory,`workspace-${locale}.png`);
        await evaluate(`globalThis.__releaseCaptureGate=(async()=>{const load=process.mainModule.require.bind(process.mainModule);const w=load('electron').BrowserWindow.getAllWindows().find(w=>/renderer\\/index\\.html$/.test(w.webContents.getURL()));const shot=await w.webContents.capturePage(undefined,{stayHidden:true,stayAwake:true});load('node:fs').writeFileSync(${JSON.stringify(destination)},shot.toPNG());return true})()`);
      }
      for(const locale of ['zh','en']) {
        await inRenderer(`(async()=>{language=${JSON.stringify(locale)};await codexMonitor.setLanguage(language);applyLanguage();await codexMonitor.enterPetMode();})()`);
        const destination=path.join(directory,locale==='zh'?'pet-zh.png':'pet.png');
        await evaluate(`globalThis.__releaseCaptureGate=(async()=>{const load=process.mainModule.require.bind(process.mainModule);const p=load('electron').BrowserWindow.getAllWindows().find(w=>/pet\\/index/.test(w.webContents.getURL()));await p.webContents.executeJavaScript('gptPet.tap()');await new Promise(r=>setTimeout(r,300));const s=await p.webContents.executeJavaScript('gptPet.read()');const a=s.layout.actor,b=s.layout.bubble;const x=Math.floor(Math.min(a.x,b.x)-12),y=Math.floor(Math.min(a.y,b.y)-12),right=Math.ceil(Math.max(a.x+a.width,b.x+b.width)+12),bottom=Math.ceil(Math.max(a.y+a.height,b.y+b.height)+12);const shot=await p.webContents.capturePage({x,y,width:right-x,height:bottom-y},{stayHidden:true,stayAwake:true});load('node:fs').writeFileSync(${JSON.stringify(destination)},shot.toPNG());return true})()`);
      }
    }
    assert.equal(await inRenderer('codexMonitor.enterPetMode()'),true);
    const petSqueeze = await inPet(`(async()=>{
      const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
      const button=document.getElementById('pet'), bubble=document.getElementById('bubble'), art=document.getElementById('bubbleVisual');
      const canvas=document.getElementById('petCanvas'), ctx=canvas.getContext('2d');
      const spriteHeight=()=>{
        const pixels=ctx.getImageData(0,0,canvas.width,canvas.height).data;
        let top=canvas.height,bottom=-1;
        for(let y=0;y<canvas.height;y++)for(let x=0;x<canvas.width;x++)if(pixels[(y*canvas.width+x)*4+3]>100){
          top=Math.min(top,y);bottom=y;break;
        }
        return bottom<top?0:bottom-top+1;
      };
      gptPet.tap();await wait(450);
      const rest={bubble:art.getBoundingClientRect().height,button:bubble.getBoundingClientRect().height,sprite:spriteHeight()};
      button.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true}));await wait(300);
      const pressed={bubble:art.getBoundingClientRect().height,button:bubble.getBoundingClientRect().height,sprite:spriteHeight()};
      button.dispatchEvent(new KeyboardEvent('keyup',{key:'Enter',bubbles:true}));await wait(850);
      const released=art.getBoundingClientRect().height;
      const visible=!bubble.hidden;
      bubble.click();await wait(100);const switchesToChatter=!document.getElementById('chatter').hidden;
      bubble.click();await wait(100);
      return {visible,pixels:rest.sprite>0&&pressed.sprite>0,spriteSquashed:pressed.sprite<rest.sprite*.95,
        bubbleSquashed:pressed.bubble<rest.bubble*.95,hitStable:pressed.button===rest.button,
        settled:Math.abs(released-rest.bubble)<1,clickIntact:switchesToChatter&&bubble.hidden};
    })()`);
    for (const [key, value] of Object.entries(petSqueeze)) assert.equal(value,true,`pet:${key}`);
    await shutdown(); child = launch(); await connect();
    let cold;
    for(let i=0;i<100;i++){cold=await evaluate(infoExpression).catch(error=>{if(error.message.includes("Promise was collected"))return null;throw error;});if(cold)break;await delay(100);}
    assert.equal(path.resolve(cold.profile),path.resolve(profile));owned=true;assert.notEqual(cold.pid,native.pid);
    assert.deepEqual(readManualUsage(path.join(profile,'manual-usage.json')),manualBefore);
    await shutdown();
    const result={version:pkg.version,rootPid:native.pid,coldPid:cold.pid,executable:native.executable,realLedgerBytes:sourceBytes.length,manualEntries:manualBefore.entries.length,
      archiveRecovery:true,coldRestart:true,manualPreserved:true,packagedAsarMatch:true,presentation,trend,petSqueeze};
    fs.writeFileSync(path.join(root,'release',`smoke-${pkg.version}-audit.json`),JSON.stringify(result,null,2));
    console.log(JSON.stringify(result,null,2));
  }catch(error){console.error(error.stack);process.exitCode=1;if(socket&&owned)await shutdown().catch(()=>{});}
  finally{socket?.close();child?.unref();}
})();

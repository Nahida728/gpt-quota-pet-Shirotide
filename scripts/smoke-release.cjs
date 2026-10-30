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
  desktopWindow: { x: 60, y: 30, width: 1200, height: 800 }, desktopSettingsVersion: 2, closeBehavior: 'tray', petMode: false }));
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
      const task={id:'release-layout',projectName:'Shirotide task',startedAt:Date.now()/1000-30,elapsedSeconds:30,estimatedCostUsd:.12,models:[{model:'gpt-6.1-sol',inputTokens:1000,cachedInputTokens:800,outputTokens:100,estimatedCostUsd:.12}]};
      activeTasks=[task,{...task,id:'release-layout-2',taskKind:'subagent'}];pendingTasks=[];activeTasksAvailable=true;
      const results=[];
      for(const locale of ['zh','en']){
        language=locale;applyLanguage();Workbench.navigate('tasks','running',{focus:false});renderActiveTaskDetails();
        const cards=[...elements.activeTaskList.querySelectorAll('.active-task-item')];
        const source=cards[0].querySelector('[data-task-detail-id]');source.focus();source.click();
        await new Promise(resolve=>setTimeout(resolve,60));
        const modal=elements.taskDetailModal,dialog=modal.querySelector('.task-detail-dialog'),rect=dialog.getBoundingClientRect();
        const current={locale,cards:cards.length,sameRow:Math.abs(cards[0].getBoundingClientRect().top-cards[1].getBoundingClientRect().top)<1,
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
    for (const row of presentation) for (const key of ['sameRow','modal','centered','focused','inert','closed','restored','unblocked']) assert.equal(row[key],true,`${row.locale}:${key}`);
    assert.deepEqual(await inRenderer('window.codexMonitor.readManualUsage()'),manualBefore);
    console.log('Bilingual modal/ledger gate passed');
    if(process.argv.includes('--screenshots')) {
      const directory=path.join(root,'docs/screenshots');fs.mkdirSync(directory,{recursive:true});
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
    await shutdown(); child = launch(); await connect();
    let cold;
    for(let i=0;i<100;i++){cold=await evaluate(infoExpression).catch(error=>{if(error.message.includes("Promise was collected"))return null;throw error;});if(cold)break;await delay(100);}
    assert.equal(path.resolve(cold.profile),path.resolve(profile));owned=true;assert.notEqual(cold.pid,native.pid);
    assert.deepEqual(readManualUsage(path.join(profile,'manual-usage.json')),manualBefore);
    await shutdown();
    const result={version:pkg.version,rootPid:native.pid,coldPid:cold.pid,executable:native.executable,realLedgerBytes:sourceBytes.length,manualEntries:manualBefore.entries.length,
      archiveRecovery:true,coldRestart:true,manualPreserved:true,packagedAsarMatch:true,presentation};
    fs.writeFileSync(path.join(root,'release',`smoke-${pkg.version}-audit.json`),JSON.stringify(result,null,2));
    console.log(JSON.stringify(result,null,2));
  }catch(error){console.error(error.stack);process.exitCode=1;if(socket&&owned)await shutdown().catch(()=>{});}
  finally{socket?.close();child?.unref();}
})();

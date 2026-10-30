const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { EventEmitter } = require('node:events');
const { PetController } = require('../src/pet-controller');
const { placePet } = require('../src/pet-state');

test('flight translates one fixed-size carrier and coalesces obsolete native positions', async () => {
  const display = { workArea: { x: 0, y: 0, width: 1511, height: 902 } };
  const screen = Object.assign(new EventEmitter(), { getAllDisplays: () => [display], getPrimaryDisplay: () => display,
    getDisplayNearestPoint: () => display, getCursorScreenPoint: () => ({ x: 800, y: 300 }), dipToScreenPoint: p => p });
  const ipc = Object.assign(new EventEmitter(), { handle() {} }), frames = new Map(), shapes = [], messages = [], moves = [];
  let runner, writes = 0, now = 0, seq = 0;
  const layout = placePet({ x: 800, y: 300 }, {}, [display]);
  let bounds = { ...layout.bounds };
  const window = { isDestroyed: () => false, isVisible: () => true, getBounds: () => bounds,
    getNativeWindowHandle: () => Buffer.alloc(8), setBounds: next => { writes++; bounds = next; }, destroy() {},
    getTitle: () => 'GPT-白汐小宠物', setIgnoreMouseEvents() {}, setShape: value => shapes.push(value),
    webContents: { send: (name, value) => {
      messages.push({ name, value });
      if (name === 'pet:flight') runner.start(value);
      if (name === 'pet:motion' && !value.flying) runner.cancel();
    } } };
  const controller = new PetController({ screen, ipcMain: ipc, store: { get: () => ({}), set() {} },
    getLanguage: () => 'zh', getSnapshot: () => null, getTasks: () => null,
    moveWindow: (_handle, point) => { moves.push(point); bounds = { ...bounds, ...point }; return true; } });
  controller.window = window; controller.loaded = controller.active = true; controller.layout = layout; controller.shape();
  const sandbox = { window: { PetPhysics: require('../src/pet-physics') }, document: { addEventListener() {} },
    performance: { now: () => now }, requestAnimationFrame: cb => { frames.set(++seq, cb); return seq; }, cancelAnimationFrame: id => frames.delete(id) };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../src/renderer/pet/pet-flight.js'), 'utf8'), sandbox);
  const pet = { style: {}, classList: { add() {}, remove() {} } }, poses = [];
  const send = (name, value) => ipc.emit(name, { sender: window.webContents }, value);
  runner = sandbox.window.PetFlight.create(pet, { flightProgress: value => send('pet:flight-progress', value),
    flightEnd: value => send('pet:flight-end', value), flightHover: value => send('pet:flight-hover', value) }, () => {}, (...pose) => poses.push(pose));
  try {
    const nativeSize = [bounds.width, bounds.height], localActor = { ...layout.actor };
    controller.startFlight({ vx: 1800, vy: -1200 });
    for (let i = 0; i < 60; i++) {
      const callbacks = [...frames.values()]; frames.clear(); now += 16; callbacks.forEach(cb => cb(now));
    }
    assert.equal(moves.length, 0, 'Native moves are deferred and coalesced');
    await new Promise(setImmediate);
    assert.equal(moves.length, 1, 'Only the newest queued pose is applied');
    assert.equal(writes, 0, 'No resize/rebase on release or during flight');
    assert.deepEqual([bounds.width, bounds.height], nativeSize);
    assert.deepEqual(controller.layout.actor, localActor);
    assert.ok(poses.every(pose => pose[0] === localActor.x && pose[1] === localActor.y));
    assert.equal(pet.style.transform, undefined); assert.equal(pet.style.left, undefined);
    assert.equal(messages.some(message => message.name === 'pet:surface'), false, 'No blank-paint handshake');
    const point = runner.cancel(); send('pet:catch', point);
    assert.equal(controller.flight, null); assert.equal(frames.size, 0); assert.equal(writes, 0);
    const beforeShapes = shapes.length;
    for (let i = 0; i < 20; i++) {
      send('pet:tap');
      assert.equal(controller.bubble.phase, 'quota', 'Repeated pet squeezes only refresh quotas');
    }
    send('pet:interact'); assert.equal(controller.bubble.phase, 'chat');
    send('pet:interact'); assert.equal(controller.bubble, null);
    send('pet:interact'); assert.equal(controller.bubble, null, 'A stale bubble click cannot reopen it');
    assert.equal(writes, 0); assert.equal(shapes.length, beforeShapes);
  } finally { controller.dispose(); }
});

test('rapid spring presses settle to a single neutral canvas pose', () => {
  let seq = 0, now = 0;
  const frames = new Map(), classes = new Set();
  let pose;
  const sandbox = { window: {}, matchMedia: () => ({ matches: false }),
    requestAnimationFrame: callback => { frames.set(++seq, callback); return seq; }, cancelAnimationFrame: id => frames.delete(id) };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../src/renderer/pet/pet-feel.js'), 'utf8'), sandbox);
  const feel = sandbox.window.PetFeel.create({ classList: { add: n => classes.add(n), remove: n => classes.delete(n) } }, value => { pose = value; });
  feel.press(); feel.release();
  for (let i = 0; i < 180; i++) {
    if (i < 12 && i % 3 === 0) { feel.press(); feel.release(); }
    const callbacks = [...frames.values()]; frames.clear(); now += 1000 / 60; callbacks.forEach(callback => callback(now));
    assert.ok(Number.isFinite(pose.scaleX) && Number.isFinite(pose.scaleY));
  }
  assert.equal(classes.has('is-interacting'), false);
  assert.equal(pose.scaleX, 1); assert.equal(pose.scaleY, 1); assert.equal(pose.dy, 0); assert.equal(pose.engaged, false);
  assert.equal(frames.size, 0);
});

test('pet painter clears the complete alpha bitmap before each changed pose', () => {
  let seq = 0, now = 0;
  const frames = new Map(), operations = [];
  const context = Object.fromEntries(['setTransform', 'save', 'translate', 'scale', 'restore', 'clearRect', 'drawImage']
    .map(name => [name, (...args) => operations.push({ name, args })]));
  const canvas = { width: 0, height: 0, style: {}, getContext: () => context };
  const sandbox = { window: { devicePixelRatio: 1.5, innerWidth: 300, innerHeight: 540, addEventListener() {} },
    matchMedia: () => ({ matches: false }), requestAnimationFrame: cb => { frames.set(++seq, cb); return seq; },
    cancelAnimationFrame: id => frames.delete(id) };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../src/renderer/pet/pet-painter.js'), 'utf8'), sandbox);
  const painter = sandbox.window.PetPainter.create(canvas);
  const tick = () => { const callbacks = [...frames.values()]; frames.clear(); now += 1000 / 60; callbacks.forEach(cb => cb(now)); };
  const source = { x: 0, y: 0, width: 1159, height: 1254 };
  painter.setLayout({ x: 16, y: 250, width: 236, height: 256 }, source, 1);
  painter.setImage({}); painter.setActive(true); tick();
  painter.setPosition(80, 100, true); painter.setPose({ scaleX: 1.05, scaleY: .9, dy: 5, engaged: true });
  assert.equal(painter.setLayout({ x: 16, y: 250, width: 236, height: 256 }, source, 1), false, 'Old state cannot replay the launch point');
  tick();
  assert.deepEqual(Array.from(operations.filter(op => op.name === 'translate').at(-1).args), [150, 272.52]);
  assert.equal(operations.filter(op => op.name === 'drawImage').length, 2);
  for (let i = 0; i < operations.length; i++) if (operations[i].name === 'drawImage') {
    const previousDraw = operations.slice(0, i).map(op => op.name).lastIndexOf('drawImage');
    const clear = operations.slice(previousDraw + 1, i).find(op => op.name === 'clearRect');
    assert.deepEqual(Array.from(clear.args), [0, 0, 450, 480]);
  }
  painter.setActive(false);
  assert.equal(frames.size, 0);
  assert.equal(operations.at(-1).name, 'clearRect');
});

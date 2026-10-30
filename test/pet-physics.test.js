const test = require('node:test');
const assert = require('node:assert/strict');
const { releaseVelocity, advanceFlight } = require('../src/pet-physics');

test('throw velocity uses recent native moves, rejects a held pause, and caps fast flings', () => {
  const samples = [{ x: 0, y: 0, at: 0 }, { x: 100, y: 100, at: 100 }, { x: 160, y: 70, at: 150 }];
  assert.deepEqual(releaseVelocity(samples, 160), { vx: 1200, vy: -600 });
  assert.deepEqual(releaseVelocity(samples, 240), { vx: 0, vy: 0 });
  assert.deepEqual(releaseVelocity([{ x: 0, y: 0, at: 0 }, { x: 900, y: -900, at: 10 }], 10), { vx: 3600, vy: -3600 });
});

test('fast throws collide at every work-area edge, remain inside negative displays, and settle', () => {
  const area = { x: -1280, y: -100, width: 1280, height: 800 }, size = { width: 237, height: 256 };
  const impacts = new Set();
  for (const velocity of [{ vx: 3600, vy: -3600 }, { vx: -3600, vy: 3600 }]) {
    let body = { x: -700, y: 100, ...velocity };
    for (let i = 0; i < 1600 && !body.resting; i++) {
      const result = advanceFlight(body, i === 0 ? 2 : .016, area, size);
      body = result.body; result.hits.forEach(hit => impacts.add(hit.axis));
      assert.ok(body.x >= area.x && body.x + size.width <= area.x + area.width && body.y >= area.y && body.y + size.height <= area.y + area.height);
      assert.ok(Number.isFinite(body.vx) && Number.isFinite(body.vy));
    }
    assert.equal(body.resting, true);
    assert.equal(body.vx, 0); assert.equal(body.vy, 0);
    assert.equal(body.y + size.height, area.y + area.height, 'Visible feet rest on the edge without transparent collision padding');
  }
  assert.deepEqual([...impacts].sort(), ['x', 'y']);
});

test('visible artwork reaches all four edges before bouncing', () => {
  const area = { x: -100, y: 30, width: 700, height: 600 }, size = { width: 220, height: 256 };
  for (const [axis, x, y, vx, vy, edge] of [
    ['x', area.x + 1, 100, -1000, 0, area.x],
    ['x', area.x + area.width - size.width - 1, 100, 1000, 0, area.x + area.width - size.width],
    ['y', 0, area.y + 1, 0, -1000, area.y],
    ['y', 0, area.y + area.height - size.height - 1, 0, 1000, area.y + area.height - size.height]
  ]) {
    const result = advanceFlight({ x, y, vx, vy }, .002, area, size);
    assert.equal(result.body[axis], edge);
    assert.ok(result.hits.some(hit => hit.axis === axis));
  }
});

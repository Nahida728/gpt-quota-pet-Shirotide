(function exposePetPhysics(root) {
// DIP-space flight only. Native dragging never uses this simulation.
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
function releaseVelocity(samples, now) {
  const recent = samples.filter(p => Number.isFinite(p.at) && now - p.at <= 110 && now >= p.at);
  if (recent.length < 2 || now - recent.at(-1).at > 65) return { vx: 0, vy: 0 };
  const first = recent[0], last = recent.at(-1), dt = (last.at - first.at) / 1000;
  if (dt < .008) return { vx: 0, vy: 0 };
  return { vx: clamp((last.x - first.x) / dt, -3600, 3600), vy: clamp((last.y - first.y) / dt, -3600, 3600) };
}
function advanceFlight(body, seconds, area, size) {
  // The visible art alone owns collisions; spring canvas padding is not a wall.
  const minX = area.x, minY = area.y;
  const maxX = Math.max(minX, area.x + area.width - size.width);
  const maxY = Math.max(minY, area.y + area.height - size.height);
  const next = { ...body }, hits = [];
  let remaining = clamp(seconds, 0, .05);
  while (remaining > 0) {
    const dt = Math.min(1 / 240, remaining); remaining -= dt;
    next.vx *= Math.exp(-.65 * dt);
    next.vy = next.vy * Math.exp(-.35 * dt) + 1250 * dt;
    next.x += next.vx * dt; next.y += next.vy * dt;
    if (next.x < minX || next.x > maxX) {
      const speed = Math.abs(next.vx);
      next.x = clamp(next.x, minX, maxX);
      next.vx = (next.x === minX ? 1 : -1) * speed * .74;
      next.vy *= .94; hits.push({ axis: 'x', speed });
    }
    if (next.y < minY || next.y > maxY) {
      const speed = Math.abs(next.vy);
      next.y = clamp(next.y, minY, maxY);
      next.vy = (next.y === minY ? 1 : -1) * speed * .66;
      next.vx *= .86;
      if (next.y === maxY && speed < 95) next.vy = 0;
      if (speed >= 95) hits.push({ axis: 'y', speed });
    }
  }
  next.resting = next.y >= maxY - .1 && Math.abs(next.vy) < 1 && Math.abs(next.vx) < 24;
  if (next.resting) { next.vx = next.vy = 0; next.y = maxY; }
  return { body: next, hits };
}
const api = { releaseVelocity, advanceFlight };
if (typeof module === 'object' && module.exports) module.exports = api;
else root.PetPhysics = Object.freeze(api);
})(typeof window === 'object' ? window : globalThis);

(function exposePetFlight(root) {
  function create(pet, api, impact, updatePosition = () => {}) {
    let flight, frame = 0, pointer, hit;
    const point = () => flight ? { id: flight.id, x: flight.body.x, y: flight.body.y } : undefined;
    const hover = () => {
      if (!flight) return;
      const { body, size } = flight;
      const next = Boolean(pointer && pointer.x >= body.x && pointer.x <= body.x + size.width &&
        pointer.y >= body.y && pointer.y <= body.y + size.height);
      if (next !== hit) { hit = next; api.flightHover({ id: flight.id, hit }); }
    };
    const cancel = (report = false) => {
      const end = point();
      cancelAnimationFrame(frame); frame = 0;
      if (flight) {
        updatePosition(flight.actor.x, flight.actor.y, false);
      }
      pet.classList.remove('is-flying');
      flight = null; hit = undefined;
      if (report && end) api.flightEnd(end);
      return end;
    };
    const step = now => {
      frame = 0; if (!flight) return;
      const result = root.PetPhysics.advanceFlight(flight.body, (now - flight.at) / 1000, flight.area, flight.size);
      flight.body = result.body; flight.at = now;
      // The canvas and hit target retain fixed local coordinates. Main moves
      // the existing carrier with SWP_NOSIZE, coalescing obsolete positions.
      api.flightProgress(point());
      const strongest = result.hits.reduce((best, value) => !best || value.speed > best.speed ? value : best, null);
      if (strongest) impact(strongest.axis, Math.min(1, strongest.speed / 1800));
      hover();
      if (result.body.resting || now - flight.began >= 6500) { cancel(true); return; }
      frame = requestAnimationFrame(step);
    };
    const trackPointer = event => { if (Number.isFinite(event.screenX) && Number.isFinite(event.screenY)) pointer = { x: event.screenX, y: event.screenY }; hover(); };
    document.addEventListener('mousemove', trackPointer);
    document.addEventListener('mouseleave', trackPointer);
    return {
      get active() { return Boolean(flight); },
      start(message) {
        cancel();
        const now = performance.now();
        flight = { ...message, body: { ...message.body }, origin: { ...message.body }, at: now, began: now, progressAt: now };
        pointer = message.pointer || null;
        updatePosition(message.actor.x, message.actor.y, true);
        pet.classList.add('is-flying'); hover(); frame = requestAnimationFrame(step);
      },
      cancel
    };
  }
  root.PetFlight = Object.freeze({ create });
})(window);

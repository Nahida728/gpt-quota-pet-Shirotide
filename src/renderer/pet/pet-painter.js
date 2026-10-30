(function exposePetPainter(root) {
  function create(canvas) {
    const context = canvas.getContext('2d', { alpha: true });
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let image, actor, art, active = false, dragging = false, flying = false;
    let pose = { scaleX: 1, scaleY: 1, dy: 0, engaged: false };
    let frame = 0, lastPaint = '', ratio = 1, layoutRevision = -1;
    const clear = () => { context.setTransform(1, 0, 0, 1, 0, 0); context.clearRect(0, 0, canvas.width, canvas.height); };
    const resize = () => {
      ratio = root.devicePixelRatio || 1;
      const width = Math.ceil(((actor?.width || 0) + 64) * ratio), height = Math.ceil(((actor?.height || 0) + 64) * ratio);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width; canvas.height = height; lastPaint = '';
      }
    };
    const paint = now => {
      frame = 0; resize();
      if (!active || !actor || !image) { clear(); return; }
      const breath = dragging || flying || pose.engaged || reduced.matches ? 0
        : Math.round((Math.cos(now * Math.PI * 2 / 5600) - 1) * ratio * 4) / (ratio * 4);
      const key = [actor.x, actor.y, actor.width, actor.height, pose.scaleX, pose.scaleY, pose.dy, breath].join(':');
      if (key !== lastPaint) {
        // One alpha surface owns all pet pixels. Always erase the entire old
        // frame; DOM image layers and their old-position textures are absent.
        clear(); context.setTransform(ratio, 0, 0, ratio, 0, 0);
        context.save();
        const ox = actor.width / 2, oy = actor.height * .92;
        context.translate(32 + ox, 32 + oy + pose.dy + breath);
        context.scale(pose.scaleX, pose.scaleY);
        context.imageSmoothingEnabled = true; context.imageSmoothingQuality = 'high';
        context.drawImage(image, art.x, art.y, art.width, art.height, -ox, -oy, actor.width, actor.height);
        context.restore(); lastPaint = key;
      }
      if (pose.engaged || !dragging && !flying && !reduced.matches) frame = requestAnimationFrame(paint);
    };
    const wake = () => { if (!frame) frame = requestAnimationFrame(paint); };
    root.addEventListener('resize', () => { resize(); if (active) wake(); else clear(); });
    return {
      setImage(value) { image = value; lastPaint = ''; wake(); },
      prime() {
        cancelAnimationFrame(frame); frame = 0;
        const wasActive = active; active = true; paint(performance.now()); active = wasActive;
        if (!wasActive) { cancelAnimationFrame(frame); frame = 0; }
      },
      setLayout(value, source, revision) {
        if (revision <= layoutRevision) return false;
        layoutRevision = revision; actor = { ...value }; art = source;
        canvas.style.left = (actor.x - 32) + 'px'; canvas.style.top = (actor.y - 32) + 'px';
        canvas.style.width = (actor.width + 64) + 'px'; canvas.style.height = (actor.height + 64) + 'px';
        lastPaint = ''; wake(); return true;
      },
      setActive(value) { active = Boolean(value); if (active) wake(); else { cancelAnimationFrame(frame); frame = 0; clear(); lastPaint = ''; } },
      setPose(value) { pose = value; wake(); },
      setDragging(value) { dragging = value; wake(); },
      setPosition(x, y, inFlight) { if (!actor || flying === inFlight) return; flying = inFlight; wake(); }
    };
  }
  root.PetPainter = Object.freeze({ create });
})(window);

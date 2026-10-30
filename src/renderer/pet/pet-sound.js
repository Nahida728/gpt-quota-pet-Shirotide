(function exposePetDuck(root) {
  function create(enabled) {
    const down = new Audio('../assets/pet-duck-press.mp3');
    const up = new Audio('../assets/pet-duck-release.mp3');
    for (const voice of [down, up]) { voice.preload = 'auto'; voice.volume = .55; voice.load(); }
    let releaseTimer;
    const stop = voice => { voice.pause(); voice.currentTime = 0; };
    const cancel = () => { clearTimeout(releaseTimer); stop(down); stop(up); };
    const play = voice => { try { voice.currentTime = 0; voice.play().catch(() => {}); } catch {} };
    return {
      press() { cancel(); if (enabled()) play(down); },
      release() {
        if (!enabled()) { cancel(); return; }
        // Match the upstream two-part squeak. Quick releases join the end of
        // the press sample; a new press cancels the previous scheduled release.
        const remaining = !down.paused && Number.isFinite(down.duration)
          ? Math.max(0, down.duration - down.currentTime - .03) : 0;
        clearTimeout(releaseTimer);
        if (remaining > 0) releaseTimer = setTimeout(() => { if (enabled()) play(up); }, remaining * 1000);
        else play(up);
      },
      cancel
    };
  }
  root.PetDuck = Object.freeze({ create });
})(window);

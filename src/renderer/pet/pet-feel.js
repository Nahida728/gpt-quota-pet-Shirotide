(function exposePetFeel(root) {
  function create(pet, updatePose) {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let compression = 0, velocity = 0, held = false, frame = 0, previousTime = 0, axis = 'y';
    const paint = () => {
      const q = Math.max(-.32, Math.min(1.2, compression));
      const wide = 1 + q * .075, short = 1 - q * .13;
      updatePose({ scaleX: axis === 'x' ? short : wide, scaleY: axis === 'x' ? wide : short,
        dy: axis === 'y' ? q * 7 : 0, engaged: held || Math.abs(compression) >= .001 || Math.abs(velocity) >= .015 });
    };
    const reset = () => {
      cancelAnimationFrame(frame); frame = 0; previousTime = 0;
      compression = velocity = 0; held = false;
      pet.classList.remove("is-interacting"); paint();
    };
    const step = now => {
      frame = 0;
      let remaining = previousTime ? Math.min(.032, (now - previousTime) / 1000) : 1 / 120;
      previousTime = now;
      while (remaining > 0) {
        const dt = Math.min(1 / 120, remaining), target = held ? 1 : 0;
        const stiffness = held ? 900 : 400, damping = held ? 42 : 14;
        velocity += ((target - compression) * stiffness - velocity * damping) * dt;
        compression += velocity * dt; remaining -= dt;
      }
      paint();
      if (!held && Math.abs(compression) < .001 && Math.abs(velocity) < .015) { reset(); return; }
      // A held pet rests without burning frames. Release wakes this same spring.
      if (held && Math.abs(compression - 1) < .001 && Math.abs(velocity) < .015) { compression = 1; velocity = 0; paint(); return; }
      frame = requestAnimationFrame(step);
    };
    const wake = () => { if (!frame) { previousTime = 0; frame = requestAnimationFrame(step); } };
    return {
      press() {
        if (reduced.matches) return;
        axis = 'y'; held = true; pet.classList.add("is-interacting");
        // Keep pose and velocity between rapid presses rather than restarting a
        // keyframe or waiting for a main-process native move to return.
        velocity = Math.min(14, velocity + 9); paint(); wake();
      },
      release() {
        if (reduced.matches) { reset(); return; }
        held = false;
        // Very short taps still complete a visible squeeze before springing up.
        if (compression < .6 && velocity > 0) velocity = Math.min(16, velocity + 4);
        wake();
      },
      impact(direction, strength) {
        if (reduced.matches || held) return;
        axis = direction === 'x' ? 'x' : 'y';
        pet.classList.add('is-interacting');
        velocity += 4 + Math.max(0, Math.min(1, strength)) * 9;
        paint(); wake();
      },
      reset
    };
  }
  root.PetFeel = Object.freeze({ create });
})(window);

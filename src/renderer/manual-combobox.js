// Editable suggestions: names are never limited to the built-in catalog.
(function exposeManualCombobox(global) {
  const controls = new Map();
  function closeAll() { controls.forEach(control => control.close()); }
  function attach(input, label) {
    if (controls.has(input.id)) return controls.get(input.id);
    input.removeAttribute("list"); input.setAttribute("role", "combobox");
    input.setAttribute("aria-autocomplete", "list"); input.setAttribute("aria-expanded", "false");
    const popup = document.createElement("div"); popup.className = "manual-suggestions";
    popup.id = input.id + "Suggestions"; popup.setAttribute("role", "listbox"); popup.setAttribute("popover", "manual");
    document.body.append(popup); input.setAttribute("aria-controls", popup.id);
    let values = [], filtered = [], active = -1, opened = false;
    const close = () => {
      if (opened && popup.hidePopover) popup.hidePopover();
      opened = false; popup.classList.remove("is-open"); input.setAttribute("aria-expanded", "false"); input.removeAttribute("aria-activedescendant");
    };
    const position = () => {
      if (!opened) return;
      const r = input.getBoundingClientRect(), below = innerHeight - r.bottom - 12, above = r.top - 12;
      const upwards = below < 160 && above > below;
      const maxHeight = Math.max(72, Math.min(240, upwards ? above : below));
      popup.style.width = r.width + "px"; popup.style.maxHeight = maxHeight + "px";
      popup.style.left = Math.max(8, Math.min(innerWidth - r.width - 8, r.left)) + "px";
      popup.style.top = (upwards ? Math.max(8, r.top - Math.min(popup.scrollHeight, maxHeight) - 5) : r.bottom + 5) + "px";
    };
    const highlight = index => {
      active = index;
      [...popup.children].forEach((node, i) => node.setAttribute("aria-selected", String(i === index)));
      const option = popup.children[index];
      if (option && filtered.length) { input.setAttribute("aria-activedescendant", option.id); option.scrollIntoView({ block: "nearest" }); }
    };
    const choose = value => { if (input.readOnly || input.disabled) return; input.value = value; close(); input.dispatchEvent(new Event("input", { bubbles: true })); input.dispatchEvent(new Event("change", { bubbles: true })); close(); input.focus(); };
    const draw = () => {
      const query = input.value.trim().toLocaleLowerCase();
      filtered = values.filter(value => value.toLocaleLowerCase().includes(query)).slice(0, 250); active = -1;
      popup.replaceChildren();
      if (!filtered.length) { const empty = document.createElement("div"); empty.className = "suggestion-empty"; empty.textContent = label("manualNoSuggestions"); popup.append(empty); }
      for (const [index, value] of filtered.entries()) {
        const option = document.createElement("div"); option.id = popup.id + "-" + index;
        option.setAttribute("role", "option"); option.setAttribute("aria-selected", "false"); option.textContent = value;
        option.addEventListener("pointerdown", event => { if (event.button === 0) { event.preventDefault(); choose(value); } });
        popup.append(option);
      }
      position();
    };
    const open = () => {
      if (input.closest("[hidden]") || input.readOnly || input.disabled) { close(); return; }
      if (!opened) { closeAll(); opened = true; popup.classList.add("is-open"); if (popup.showPopover) popup.showPopover(); }
      input.setAttribute("aria-expanded", "true"); draw();
      // Secondary panels animate into place; one bounded correction keeps the
      // top-layer list anchored after the entrance without a polling loop.
      setTimeout(position, 280);
    };
    input.addEventListener("focus", open); input.addEventListener("click", open);
    input.addEventListener("input", open);
    input.addEventListener("blur", () => setTimeout(() => { if (document.activeElement !== input) close(); }, 0));
    input.addEventListener("keydown", event => {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault(); if (!opened) open();
        if (filtered.length) highlight((active + (event.key === "ArrowDown" ? 1 : -1) + filtered.length) % filtered.length);
      } else if (event.key === "Enter" && opened && active >= 0) { event.preventDefault(); choose(filtered[active]); }
      else if (event.key === "Escape" && opened) { event.preventDefault(); event.stopPropagation(); close(); }
      else if (event.key === "Tab") close();
    });
    popup.addEventListener("wheel", event => event.stopPropagation(), { passive: true });
    document.addEventListener("pointerdown", event => { if (event.target !== input && !popup.contains(event.target)) close(); });
    document.addEventListener("scroll", event => { if (opened && !popup.contains(event.target)) position(); }, true);
    window.addEventListener("resize", position);
    const control = { close, update(next) {
      values = [...new Set(next.filter(value => typeof value === "string" && value.trim()).map(value => value.slice(0, 80)))];
      input.placeholder = label("manualFreeText"); if (opened) draw();
    } };
    controls.set(input.id, control); return control;
  }
  global.ManualCombobox = { attach, closeAll };
})(window);

const api = window.gptPet;
const pet = document.getElementById("pet"), portrait = document.getElementById("portrait");
const bubble = document.getElementById("bubble");
const quotaContent = document.getElementById("quotaContent"), chatter = document.getElementById("chatter");
let state, press = null, moving = false, lastSerial = 0;
let pointer, lastPointerHit, layoutVersion = -1;
const painter = window.PetPainter.create(document.getElementById('petCanvas'));
const feel = window.PetFeel.create(pet, pose => painter.setPose(pose));
const duck = window.PetDuck.create(() => state?.active && state?.preferences.sound);
const flight = window.PetFlight.create(pet, api, (axis, strength) => feel.impact(axis, strength),
  (x, y, flying) => painter.setPosition(x, y, flying));
function syncPointerHit() {
  if (!state || press || moving || flight.active) return;
  const inside = rect => pointer && pointer.x >= rect.x && pointer.x <= rect.x + rect.width && pointer.y >= rect.y && pointer.y <= rect.y + rect.height;
  const hit = Boolean(state.active && (inside(state.layout.actor) || state.bubble && inside(state.layout.bubble)));
  if (hit !== lastPointerHit) { lastPointerHit = hit; api.hover(hit); }
}
document.addEventListener('mousemove', event => { pointer = { x: event.clientX, y: event.clientY }; syncPointerHit(); });
document.addEventListener('mouseleave', () => { pointer = null; syncPointerHit(); });
const copy = {
  zh: { pet: "GPT-白汐，拖动移动，点按显示额度，右键打开工作台", nextChat: "切换为碎碎念", close: "关闭气泡",
    quota: "GPT-白汐 · Codex 额度", offline: "离线", five: "5 小时剩余", week: "一周剩余", paused: "已暂停", unavailable: "暂不可用" },
  en: { pet: "GPT-Shirotide. Drag to move, tap for quotas, right-click for workspace", nextChat: "Show a little thought", close: "Close bubble",
    quota: "GPT-Shirotide · Codex quota", offline: "Offline", five: "5-hour left", week: "Weekly left", paused: "Paused", unavailable: "Unavailable" }
};
const t = (key, n) => copy[state?.language === "en" ? "en" : "zh"][key].replace("{n}", n ?? "");
function render(next) {
  if (!next?.layout) return;
  state = next;
  if (!state.active) flight.cancel();
  painter.setActive(state.active);
  if (!state.active || !state.preferences.sound) duck.cancel();
  const { actor, bubble: rect } = state.layout;
  bubble.classList.toggle("is-below", state.layout.top);
  // Quota/task updates cannot replay the flight's original coordinates after
  // it has settled locally. Only a new main-process layout revision may rebase.
  if (!flight.active && state.layoutVersion > layoutVersion) {
    for (const [node, bounds] of [[pet, actor], [bubble, rect]]) {
      for (const [key, value] of Object.entries(bounds)) node.style[key === "x" ? "left" : key === "y" ? "top" : key] = value + "px";
    }
    painter.setLayout(actor, state.art, state.layoutVersion); layoutVersion = state.layoutVersion;
  }
  // The visible alpha bounds, not the transparent square canvas, define size.
  // Both source axes use one scale; pressing animates the wrapper separately.
  document.documentElement.lang = state.language === "en" ? "en" : "zh-CN";
  document.title = state.language === "en" ? "GPT-Shirotide Companion" : "GPT-白汐小宠物";
  document.getElementById("petStage").setAttribute("aria-label", state.language === "en" ? "GPT-Shirotide Companion" : "GPT-白汐小宠物");
  pet.setAttribute("aria-label", t("pet")); pet.removeAttribute("title");
  document.body.classList.toggle("is-working", state.summary.running > 0);
  document.body.classList.toggle("is-hidden", !state.active);
  bubble.hidden = !state.bubble;
  if (!state.bubble) return;
  const { kind, serial } = state.bubble;
  const chatting = state.bubble.phase === "chat";
  quotaContent.hidden = chatting; chatter.hidden = !chatting;
  const lines = window.PetChatter.lines;
  chatter.textContent = lines[(state.bubble.chatterIndex || 0) % lines.length][state.language === "en" ? "en" : "zh"];
  bubble.setAttribute("aria-label", t(chatting ? "close" : "nextChat"));
  const s = state.summary, value = number => number === null ? "—" : `${number}%`;
  document.getElementById("fiveLabel").textContent = t("five");
  document.getElementById("weekLabel").textContent = t("week");
  document.getElementById("fiveValue").textContent = s.fiveHourPaused ? t("paused") : value(s.fiveHour);
  document.getElementById("weekValue").textContent = value(s.weekly);
  for (const [id, number] of [["five", s.fiveHour], ["week", s.weekly]]) {
    document.getElementById(id + "Progress").style.width = (number ?? 0) + "%";
    document.getElementById(id + "Value").classList.toggle("is-text", number === null);
  }
  const status = document.getElementById("quotaStatus");
  status.textContent = s.online ? (s.weekly === null ? t("unavailable") : "") : t("offline");
  if (serial !== lastSerial) {
    lastSerial = serial;
    if (kind === "completed") { document.body.classList.remove("celebrating"); void pet.offsetWidth; document.body.classList.add("celebrating"); }
  }
}
pet.addEventListener("pointerdown", event => {
  if (event.button !== 0 || !event.isPrimary || moving || press) return;
  event.preventDefault();
  api.catch(flight.cancel());
  press = { id: event.pointerId, x: event.clientX, y: event.clientY };
  pet.setPointerCapture(event.pointerId); feel.press(); duck.press();
});
pet.addEventListener("pointermove", async event => {
  if (!press || press.id !== event.pointerId || Math.hypot(event.clientX - press.x, event.clientY - press.y) < 4) return;
  const id = press.id; press = null; moving = true;
  // Only classification happens in the renderer. Windows owns the whole move;
  // no cursor polling or pointer-driven native bounds writes are involved.
  feel.reset(); duck.cancel(); painter.setDragging(true); pet.classList.add("is-dragging");
  if (pet.hasPointerCapture(id)) pet.releasePointerCapture(id);
  try { await api.gesture(); }
  finally { moving = false; painter.setDragging(false); pet.classList.remove("is-dragging"); lastPointerHit = undefined; }
});
pet.addEventListener("pointerup", event => {
  if (!press || press.id !== event.pointerId) return;
  const id = press.id; press = null;
  if (pet.hasPointerCapture(id)) pet.releasePointerCapture(id);
  feel.release(); duck.release(); api.tap(); lastPointerHit = undefined;
});
for (const type of ["pointercancel", "lostpointercapture"]) pet.addEventListener(type, event => {
  if (press?.id === event.pointerId) { press = null; feel.reset(); duck.cancel(); }
});
pet.addEventListener("contextmenu", event => { event.preventDefault(); api.catch(flight.cancel()); api.menu(); });
pet.addEventListener("keydown", event => {
  if (event.key === "Enter" || event.key === " ") { event.preventDefault(); if (!event.repeat) { api.catch(flight.cancel()); feel.press(); duck.press(); } }
  if (event.key === "ContextMenu" || event.key === "F10" && event.shiftKey) { event.preventDefault(); api.menu(); }
});
pet.addEventListener("keyup", event => {
  if (event.key === "Enter" || event.key === " ") { event.preventDefault(); feel.release(); duck.release(); api.tap(); }
});
bubble.addEventListener("click", () => api.interact());
bubble.addEventListener("keydown", event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); api.interact(); } });
document.addEventListener("keydown", event => { if (event.key === "Escape") { flight.cancel(true); api.dismiss(); } });
document.addEventListener("visibilitychange", () => {
  document.body.classList.toggle("is-hidden", !state?.active);
  if (!state?.active) { press = null; feel.reset(); }
});
api.onState(render);
api.onFlight(value => flight.start(value));
api.onMotion(motion => {
  if (!motion.flying) flight.cancel();
  if (!motion.flying && !press) feel.reset();
});
(async () => {
  render(await api.read());
  await portrait.decode();
  painter.setImage(portrait);
  painter.prime();
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  api.ready();
})();

(function exposeWorkbench(global) {
  const routes = Object.freeze({ overview: ["main"], usage: ["trend", "cost", "pricing"], tasks: ["running", "pending", "statistics"], quota: ["credits", "subscription", "official", "forecast"], updates: ["timeline"], settings: ["general", "sources", "diagnostics", "about"] });
  const titleKeys = { overview: "navOverview", usage: "navUsage", tasks: "navTasks", quota: "navQuota", updates: "navUpdates", settings: "settingsTitle" };
  let current = { page: "overview", tab: "main" };
  let options = {}, modelsSignature = "", sources = [], pricing = null, pricingLanguage = null;
  const scrolls = new Map();
  const rememberedTabs = {};
  const get = id => document.getElementById(id);
  function remember(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} }
  function restore(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } }
  function visible(node) { return Boolean(node && !node.closest("[hidden]")); }

  function localize() {
    const t = options.t;
    if (!t) return;
    get("pageTitle").textContent = t(titleKeys[current.page]);
    get("pageSubtitle").textContent = t(current.page === "overview" ? "overviewSubtitle" : "pageSubtitle");
    for (const item of document.querySelectorAll(".nav-item")) item.title = t(item.dataset.labelKey || titleKeys[item.dataset.route]);
    get("sourceCount").textContent = t("sourceCount", { count: sources.length });
    drawSources();
    if (pricing && pricingLanguage !== document.documentElement.lang) drawPricing();
  }

  function navigate(page, tab, { focus = true } = {}) {
    if (!routes[page]) return;
    const selected = routes[page].includes(tab) ? tab : rememberedTabs[page] || routes[page][0];
    const content = get("workspaceContent");
    scrolls.set(current.page + ":" + current.tab, content.scrollTop);
    current = { page, tab: selected };
    rememberedTabs[page] = selected;
    for (const panel of document.querySelectorAll(".workspace-page[data-page]")) panel.hidden = panel.dataset.page !== page;
    for (const panel of document.querySelectorAll("[data-panel]")) {
      const [owner, view] = panel.dataset.panel.split(":");
      panel.hidden = owner !== page || (view !== selected && view !== "all");
    }
    document.querySelectorAll(".nav-item").forEach(item => {
      const active = item.dataset.route === page;
      item.classList.toggle("is-active", active);
      if (active) item.setAttribute("aria-current", "page"); else item.removeAttribute("aria-current");
    });
    document.querySelectorAll('[role="tab"]').forEach(item => {
      const active = item.dataset.route === page && item.dataset.tab === selected;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-selected", String(active));
      item.tabIndex = active ? 0 : -1;
    });
    document.body.dataset.page = page;
    document.body.dataset.tab = selected;
    remember("cqm2.navigation", current);
    localize();
    options.onNavigate?.(current);
    content.scrollTop = scrolls.get(page + ":" + selected) || 0;
    if (focus) get("pageTitle").focus({ preventScroll: true });
  }

  function init(config) {
    options = config;
    document.addEventListener("click", event => {
      const route = event.target.closest("[data-route]");
      if (!route) return;
      event.preventDefault(); navigate(route.dataset.route, route.dataset.tab);
    });
    document.addEventListener("keydown", event => {
      const tab = event.target.closest('[role="tab"]');
      if (!tab || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      const tabs = [...tab.parentElement.querySelectorAll('[role="tab"]')];
      let index = tabs.indexOf(tab) + (event.key === "ArrowRight" ? 1 : -1);
      if (event.key === "Home") index = 0;
      if (event.key === "End") index = tabs.length - 1;
      const next = tabs[(index + tabs.length) % tabs.length];
      event.preventDefault(); navigate(next.dataset.route, next.dataset.tab, { focus: false }); next.focus();
    });
    get("refreshSources").addEventListener("click", loadSources);
    get("diagnoseConnection").addEventListener("click", () => options.onDiagnose?.());
    const saved = restore("cqm2.navigation", current);
    navigate(routes[saved?.page] ? saved.page : "overview", saved?.tab, { focus: false });
    loadSources(); loadPricing();
  }

  async function loadSources() {
    get("refreshSources").disabled = true;
    try { sources = await global.codexMonitor.readSources?.() || []; }
    catch { get("sourcesList").textContent = options.t("sourcesUnavailable"); return; }
    finally { get("refreshSources").disabled = false; }
    localize();
  }

  function drawSources() {
    const list = get("sourcesList");
    list.replaceChildren();
    if (!sources.length) { list.textContent = options.t("sourcesEmpty"); return; }
    for (const source of sources) {
      const row = document.createElement("article"); row.className = "source-item";
      const title = document.createElement("strong"); title.textContent = source.name;
      const state = document.createElement("span"); state.textContent = options.t(source.sessions > 0 ? "sourceReadable" : "sourceNoSessions", { count: source.sessions });
      row.append(title, state); list.append(row);
    }
  }

  async function loadPricing() {
    try { pricing = await global.codexMonitor.readPricing?.(); if (pricing) drawPricing(); }
    catch { get("pricingCatalogSummary").textContent = options.t("pricingUnavailable"); }
  }

  function drawPricing() {
    pricingLanguage = document.documentElement.lang;
    const root = get("pricingCatalogSummary");
    const previousQuery = root.querySelector('input[type="search"]')?.value || "";
    root.replaceChildren();
    const note = document.createElement("p"); note.textContent = options.t("pricingSummary", { date: pricing.date, count: pricing.models.length }); root.append(note);
    const search = document.createElement("input"); search.type = "search"; search.placeholder = options.t("pricingSearch"); search.setAttribute("aria-label", options.t("pricingSearch"));
    search.value = previousQuery;
    const scroll = document.createElement("div"); scroll.className = "table-scroll";
    const table = document.createElement("table"); table.className = "pricing-table";
    const header = document.createElement("thead"), headerRow = document.createElement("tr");
    for (const key of ["pricingModel", "modelPricingVendorLabel", "modelCostInput", "modelCostCached", "pricingWrite", "modelCostOutput", "pricingSource"]) {
      const th = document.createElement("th"); th.textContent = options.t(key); th.scope = "col"; headerRow.append(th);
    }
    header.append(headerRow); table.append(header);
    const body = document.createElement("tbody"); table.append(body); scroll.append(table); root.append(search, scroll);
    const format = value => Number.isFinite(value) ? "$" + new Intl.NumberFormat("en-US", { maximumFractionDigits: 6 }).format(value) : "—";
    const draw = () => {
      body.replaceChildren();
      for (const price of pricing.models.filter(price => (price.model + " " + price.vendor).toLowerCase().includes(search.value.trim().toLowerCase()))) {
        const row = document.createElement("tr");
        for (const value of [price.model, price.vendor, format(price.input), format(price.cachedInput), format(price.cacheWrite), format(price.output)]) {
          const td = document.createElement("td"); td.textContent = value; row.append(td);
        }
        const td = document.createElement("td"), button = document.createElement("button"); button.className = "text-button"; button.textContent = options.t("pricingSource");
        button.addEventListener("click", () => global.codexMonitor.openPricingSource?.(price.source)); td.append(button); row.append(td); body.append(row);
      }
    };
    search.addEventListener("input", draw); draw();
  }

  function sync(snapshot, format) {
    const cost = snapshot?.tokenCost || {};
    get("homeRunningValue").textContent = get("activeTaskCount").textContent;
    const source = get("quotaSection");
    const signature = source.innerHTML;
    const mirror = get("quotaPageBars");
    if (mirror.dataset.signature !== signature) {
      mirror.replaceChildren(...[...source.children].map(node => {
        const clone = node.cloneNode(true); clone.removeAttribute("id");
        clone.querySelectorAll("[id]").forEach(item => item.removeAttribute("id")); return clone;
      }));
      mirror.dataset.signature = signature;
    }
    const models = (cost.models || []).filter(model => model.model !== "unknown").slice().sort((a,b) => (b.estimatedCostUsd || 0) - (a.estimatedCostUsd || 0)).slice(0,4);
    const nextSignature = JSON.stringify([document.documentElement.lang, cost.available, models]);
    if (nextSignature !== modelsSignature) {
      modelsSignature = nextSignature;
      const list = get("overviewModelList"); list.replaceChildren();
      const maximum = Math.max(1, ...models.map(model => model.estimatedCostUsd || 0));
      for (const model of models) {
        const row = document.createElement("button"); row.className = "overview-model-row"; row.dataset.route = "usage"; row.dataset.tab = "cost";
        const name = document.createElement("strong"); name.textContent = model.model;
        const bar = document.createElement("span"); bar.className = "model-mini-bar"; bar.style.setProperty("--share", (model.estimatedCostUsd || 0) / maximum * 100 + "%");
        const value = document.createElement("span"); value.textContent = model.priced ? format.usd(model.estimatedCostUsd)
          : options.t(model.missingPriceComponents?.length ? "modelCostRateUnavailable" : model.pricingPending ? "modelCostPricingPending" : "modelCostUnpriced");
        row.append(name, bar, value); list.append(row);
      }
      if (!models.length) list.textContent = options.t("modelCostEmpty");
    }
    get("sourceScanSummary").textContent = options.t("sourceScanSummary", { count: cost.filesScanned || 0, state: options.t(cost.truncated ? "tokenLocalPartial" : "tokenLocalComplete") });
  }

  global.Workbench = { init, navigate, localize, sync, visible, remember, restore, get current() { return { ...current }; } };
})(window);

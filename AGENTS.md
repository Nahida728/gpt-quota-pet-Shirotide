# 工作方式

- 优先实现和修复。默认只运行本次改动直接相关、能发现真实风险的少量定向检查；不默认运行全套回归、重复已通过的检查、反复截图或新增大批测试。
- 只有具体故障或高风险边界才扩展验证。涉及存档、货币、认证与发布时，保留数据安全及版本、哈希、签名门禁；明确说明未验证的部分。

# Codex Quota Monitor — Contributor Rules

This file is the persistent engineering contract for Codex and human contributors.
Read it before changing the project. Update it whenever a new invariant, failure
mode, or regression is discovered.

## Scope and packaging

- This is a Windows x64 Electron desktop application, not a website.
- The production UI is one persistent frameless Windows workspace with opaque
  content on a transparent native surface so its rounded outer corners stay clear.
  On 2026-10-30 the user chose a fixed 1200 × 800 DIP surface, limited only by
  smaller display work areas. Cards and native outline share a 12 DIP radius.
- `AGENTS.md` is development-only. It must be committed to the repository but
  must never be included in portable, installer, unpacked, or ASAR output.
- Keep `build.files` as an explicit allowlist containing only `src/**/*` and
  `package.json`. Do not replace it with a broad glob.
- Never add a negative-only `build.win.files` list: Windows platform patterns
  override the application allowlist and can accidentally package development
  files. Filter nested dependency README/AGENTS files in the bounded beforePack
  collector hook before ASAR integrity is calculated; retain dependency licenses.
- Normalize both Windows and POSIX separators when inspecting ASAR entry lists.
  Use native paths for ASAR extraction and compare packaged source bytes.
- `README.md`, `AGENTS.md`, tests, preview scripts, source-control metadata, logs,
  and temporary files must remain outside packaged apps.
- `test/packaging.test.js` protects this rule. After a release build, also inspect
  `app.asar` rather than trusting configuration alone.

## Product contract

The monitor must:

- Show the 5-hour quota, remaining percentage, and scheduled recovery.
- Show the weekly quota, remaining percentage, and scheduled recovery.
- Show the GPT Reserve weekly quota as a third compact bar when the independent
  `gpt-reserve` app-server bucket is present; never infer it from Codex usage.
- Handle the official special state in which the 5-hour window is not returned.
- Show every available reset credit, with localized type and its own expiry.
- Detect newly received reset credits without treating the first run as an event.
- Permanently retain newly received reset-credit history and expose it together
  with the current available-credit list in a clickable detail view.
- distinguish a user-consumed reset credit from an official remote reset.
- Permanently retain detected user-consumed reset-credit history and expose its
  count, observation time, and safely identifiable credit details in the reset
  detail view.
- Retain validated website reset announcements and show the latest on the card;
  never display or restore retired local inferred non-natural reset records.
- Detect both a Codex client update ready to install and a newly installed version.
- Permanently retain observed installed-version changes and expose them as a
  clickable client update timeline.
- Show the account lifetime Token total and cumulative days with recorded work.
- Show daily-average Tokens and daily-average API-equivalent cost using the same
  cumulative work-day denominator, without inventing calendar-day activity.
- Show an animated Token usage bar chart switchable between daily, weekly, and
  monthly aggregation.
- Make a recognized Codex subscription plan clickable and show cumulative work
  days, subscription expiry, and a live countdown to the next renewal.
- Estimate the standard API-equivalent USD cost of locally recorded Codex model
  calls and show model-level input, cached input, output, and cache-hit details.
- Show all currently active local Codex tasks, live elapsed time, and each
  project's API-equivalent cost in a clickable detail view.
- Retain a newly completed task in that detail view until the user confirms it
  or returns to Codex, and permanently retain the longest duration and highest
  single-task API-equivalent cost as monotonic records.
- Distinguish completed, manually interrupted, and abnormally interrupted tasks;
  stop their clocks at the last evidenced terminal point and alert once when an
  abnormal interruption is first observed.
- Permanently retain numeric task totals for count, elapsed time, estimated cost,
  outcome counts, averages, longest duration, and highest single-task cost.
- In secondary Token/task analytics only, put a clickable circular coverage
  marker beside every statistic whose source cannot fully cover all account
  activity. Do not add those markers to the main card. Its bilingual dialog must
  state the exact included population, exclusions, denominator, and current
  truncation or missing-duration limitation.
- Report Codex online only when the local app-server can reach the OpenAI service
  and return quota data.
- Show a localized red-glass connection dialog on the first offline detection of
  each app session, with client, sign-in, API-key mode, network, VPN, firewall,
  proxy, OpenAI-service, and timeout checks.
- Keep the breathing connection light clickable. It opens a green normal-status
  dialog while online and reopens the red diagnostic dialog while offline.
- Support complete Chinese and English UI.
- Support click-to-upload and drag-to-upload backgrounds, manual fixed-ratio
  cropping, and background opacity.
- Support standard native movement, taskbar access, optional always-on-top,
  tray hide/show and configurable close. The user-selected fixed size disables
  resizing, maximizing and full screen.
- Use a white and sky-cyan palette with user images behind frosted white cards.
- Provide six pages: overview, usage/cost, tasks, quotas/resets, client updates,
  and settings. All existing data and history actions remain reachable.
- Top docking, the old floating orb, fixed small-window mode and position locking
  remain retired. On 2026-10-30 the user explicitly requested a GPT pet mode;
  this is the authorized exception, not a return of the old orb/dock code.

Preserve data and business behavior during visual changes. The retired window
modes above are the explicit user-authorized exception.

## Architecture

- `src/main.js`
  - Electron lifecycle, desktop window state, tray, native dialogs, settings
    IPC, background persistence.
- `src/preload.js`
  - Minimal sandboxed bridge. Keep the exposed API narrow.
- `src/quota-service.js`
  - Coordinates app-server reads, stored baselines, event detection, and client
    update status.
- `src/quota-normalizer.js`
  - Normalizes server rate-limit windows and reset-credit details.
- `src/codex-update-service.js`
  - Reads the installed Store package version and only the Codex Windows Store
  updater status lines needed to detect pending updates.
- `src/token-usage.js`
  - Normalizes account Token summaries and daily buckets, restores the last safe
    snapshot when needed, and performs deterministic day/week/month aggregation.
- `src/codex-cost-usage.js`
  - Reads only model and Token-count events from bounded local Codex rollouts,
    de-duplicates replayed counters, and calculates standard API-equivalent cost.
- `src/codex-active-tasks.js`
  - Identifies active turns from explicit lifecycle events and exposes only the
    project basename, elapsed time, normalized model usage, and estimated cost.
- `src/codex-window-focus.js`
  - Finds only a visible window owned by the installed OpenAI Codex Store
    package and brings it to the foreground for the completed-task handoff.
- `src/refresh-policy.js`
  - Pure active/idle refresh timing and lightweight task-probe wake-up policy.
- `src/store.js`
  - Local JSON persistence.
- `src/renderer/index.html`
  - Semantic UI structure.
- `src/renderer/styles.css`
  - Entry stylesheet importing the responsive white/cyan workbench styles.
- `src/renderer/renderer.js`
  - i18n dictionaries, rendering, interactions, crop workflow, refresh state.
- `src/renderer/crop-geometry.js`
  - Pure crop geometry.
- `test/`
  - Node tests for quota/event logic, update logic, crop geometry, layout,
    localization, and packaging.
- `scripts/renderer-preview-*`
  - Local visual-regression preview only; never package it.

Renderer security settings are non-negotiable:

- `contextIsolation: true`
- `nodeIntegration: false`
- `sandbox: true`
- A restrictive Content Security Policy
- No credentials, API keys, tokens, raw app-server payloads, or conversation
  content exposed to or logged by the renderer

## Desktop window and layout invariants (2.0)

### GPT desktop pet (2.0.0-beta.2, user requested)

- Keep the workspace alive. Lazily create one transparent, sandboxed pet
  window; hide the workspace only after the image decodes and the pet acknowledges
  two painted frames. On restore, show the same workspace and hide the pet. Never
  use snapshots, interpolate native bounds or alter the saved desktop bounds.
- The pet uses one transparent master PNG. Its default 256 DIP size is based on
  visible alpha bounds, excluding transparent canvas margins. Scale both source
  axes by one factor. Draw the same master with numeric poses; never regenerate separate states.
  The bubble uses the reference's licensed frame geometry, recolored, at 256 DIP
  width with two stacked quota rows. Keep quota and chatter content inside it.
- Store only pet preferences, mode and the visible character's absolute anchor in
  settings. Clamp/snap that anchor after movement settles, including negative
  display coordinates and removed monitors. Shape only the portrait and a visible
  speech bubble; hidden transparent bubble space must not block other apps.
- Classify pet pointer intent locally with a four-DIP movement threshold. Taps
  update the bubble immediately and must never invoke a native move loop. Only
  a drag queues one PostMessage system move with an IsWindow-validated decoded
  HWND. Never call blocking SendMessage through FFI: its modal loop re-enters
  Electron/V8 and can crash. Await WM_EXITSIZEMOVE/moved asynchronously and clean
  up the hook on completion/disposal. Check VK_LBUTTON so a released drag cannot attach to the cursor. Never
  poll the cursor or drive setBounds/setPosition from pointer movement.
- Press and release feed a bounded renderer spring that retains velocity across
  rapid taps. Reset all squash/stretch before handing a drag to Windows. Native
  movement must show the unmodified aspect ratio; animations never block input.
- On 2026-10-30 the user explicitly authorized pet throwing and screen bounces.
  Keep one fixed narrow native carrier and fixed local sprite coordinates for
  idle, native dragging and flight. Reserve transparent space for a bubble above
  or below, passing unused space through with sender-validated hover toggles.
  Physical collision and settled clamps use the visible art rectangle with no
  16/20-DIP inset. Source art bounds exclude the near-transparent alpha fringe
  below 8/255; the 32-DIP spring canvas margin never participates in collisions.
  A permanent full-screen transparent window made Codex lag; temporary expansion
  displaced old pixels, and clearing/acknowledging that resize made the pet blink.
  Full-screen flight surfaces and clear-frame handshakes are retired.
- Renderer RAF owns the bounded post-release simulation, with gravity, damping,
  speed/time-step caps and work-area collisions. Coalesce numeric world-position
  reports to one newest native move per main event-loop turn. This is the
  authorized post-release motion exception: translate the existing HWND with
  SetWindowPos + SWP_NOSIZE/NOZORDER/NOACTIVATE/NOOWNERZORDER/NOSENDCHANGING.
  Convert DIP origins with screen.dipToScreenPoint. Never resize, remount, change
  opacity, discard bitmap contents, replay pointer deltas or drive native drag
  from JS. Size-preserving physical translation avoids fractional-DPI size drift.
  Cancel native-move queues and flight timers on catch, hide, settings/display
  changes or disposal. Catch freezes the actual displayed carrier, not a future
  predicted pose. Persist only settled anchors; never touch workspace bounds.
- A single small alpha canvas owns character pixels. Its backing bitmap covers
  only the character and spring padding, not unused bubble space. Clear that
  bitmap and redraw the same master for changed poses; do not create a second
  transformed DOM sprite. Native translation retains this exact bitmap and local
  actor origin, so flight start/end do not need a blank frame or coordinate rebase.
  Prepaint the decoded source before the initial two-frame readiness acknowledgment.
  Main layout revisions prevent old task/quota updates replaying geometry.
- Keep press/release and collision spring poses responsive, preserve uniform
  base scale and master orientation, and remove squeeze before native dragging.
  No hover animation swap, animated blur filter, native snapshot or extra window.
  Local original yellow-duck press/release audio respects mute and cancels on drag.
- Deduplicate state/shape/bounds publications. Active state owns animation
  suspension; showInactive may report document.hidden for a visible surface.
  Hidden workspace data stays cached without rebuilding charts, task/model DOM;
  restore the latest snapshot once when that workspace becomes visible again.
- App, taskbar, tray and sidebar icons derive from one generated mascot icon
  master. Keep the existing appId/userData identity. Native ICO contains explicit
  16–256px images; the renderer PNG is inside the application allowlist.
  Splash uses the local mascot GIF with a static reduced-motion fallback, never
  the retired SVG tide mark. Source masters/build scripts stay outside ASAR.
  Windows taskbar branding also explicitly sets each window's AppUserModel icon
  to a content-addressed ICO inside userData/icons. Reusing the old icon path
  can retain cached shell artwork even after the window/tray image changes.
- Pet presses only open/refresh 5-hour/weekly quotas, including repeated squeezes.
  Only clicking the bubble switches quotas -> random chatter -> closed. Keep
  their sender-validated IPC actions separate, including keyboard activation.
  Never restore the workspace on any left-click count or double-click.
  Restoration is an explicit native context-menu/tray action. No bubble header
  or X; each shown phase closes after seven seconds. Chatter avoids immediate
  repeats and uses the bilingual community-derived pool in pet-chatter.js.
- Keep backgroundThrottling false on the transparent pet: showInactive can leave
  document.hidden true while the native surface is visible and otherwise stop
  its paint. Explicitly pause hidden/inactive animations instead.
- First complete task read is the notification baseline. Pet notices use only
  new, complete, deduplicated completion evidence; old/interrupted tasks do not
  celebrate. Pet IPC exposes only quota/task numbers, never raw snapshots or
  project/conversation/authentication data, and accepts gestures only from its
  own webContents. Use the existing background readers; no new quota polling.
- Verify native press/release, long drag, edge snap, rapid/double clicks without
  workspace restoration, right-click restore, bubble dismissal and tray hide/show.
  Verify that returning restores navigation and the fixed workspace bounds and that
  the pet's transparent space does not intercept the desktop. Honor reduced motion
  and keep sounds optional and initially off.

- Keep one persistent workspace BrowserWindow with frame: false, transparent: true,
  backgroundColor: #00000000, hasShadow: false,
  resizable: false, maximizable: false, fullscreenable: false and thickFrame: false.
  Minimum/maximum dimensions match the 1200 × 800 DIP target (or the smaller
  work area). A will-resize guard prevents accidental system resizing. The user's
  rounded-window request permits one bounded rounded region from window-shape.js.
  Build it from GetWindowRect physical pixels and the shared 12 DIP radius; do
  not reuse DIP scanline rectangles as a native-pixel mask. Reapply after native
  show/restore, renderer load and settled display/bounds changes, once the native
  operation finishes. Skip minimized HWND bounds and let Windows own successful
  SetWindowRgn regions. Never add polling, mode-switch surfaces or pointer-driven
  bounds loops. A native region alone did not round the opaque compositor surface
  on the user's machine. The native workspace must also be transparent, with a
  transparent document canvas, a root clip-path and an opaque workbench inside
  the shared radius. A transparency option change requires recreating the window;
  hot-loading a helper cannot change the existing surface. Native corner appearance
  remains subject to user verification.
- Use renderer caption buttons in one inset rounded rectangular group; the
  Windows titleBarOverlay is retired because its close hover was clipped at the
  rounded window edge. Each button owns its full hover/pressed background and is
  no-drag. Closing uses a sender-validated narrow IPC and BrowserWindow.close(),
  honoring the configured tray/quit behavior. Maximize is disabled by the fixed-size
  contract. Only toolbar free space and brand use
  native app-region: drag; every button, input and connection control is no-drag.
  Keep workspace-toolbar itself no-drag; its page-identity child owns the free
  heading drag area. A draggable toolbar behind the separately positioned caption
  group swallowed native mouse input even though DOM hit testing found the right
  button. CSS z-index and button no-drag alone did not resolve that overlap.
  Place the caption group after the workbench in DOM order. Live style injection
  must override the existing stylesheet: the default author-origin insertCSS did
  not replace the imported toolbar drag rule in the preview. Inspect the effective
  region rather than assuming a successful injection changed native hit testing.
  No custom edge drag strips or orb gesture bridge. Keep single-instance protection, tray and
  the bounded package-verified Codex focus handoff.
- Keep caption controls above renderer overlays and reserve toolbar space for
  their full group. Hover fills the whole rounded button, including its bottom
  edge; no native overlay may cover it. Tray artwork follows the system-integrated
  theme independently of the app's light theme.
- Restore position from desktopWindow, separate from old windowBounds; ignore old
  large sizes and maximized state. Clamp to valid work areas including high-DPI
  and removed monitors. Never save minimized bounds. Smaller work areas may lower
  the fixed dimensions so controls remain reachable.
- The overview occupies one screen without page scrolling. Trend/latest task are
  the first analytics row; model composition/Codex tasks/reset signals are below.
  The client update card lives in the sidebar above the instance entry. Secondary
  pages retain scrolling. Bound main-card lists and expose all records in details.
- Migrate window/appearance settings only. Keep appId, userData, quota-state,
  persistent model ledger, archive generations and business counters unchanged.
- Six pages share one state/snapshot stream. Task cards use a compact grid with
  at least two columns at the normal workspace width. Goal/model details open a
  centered modal, including pending tasks, with the shared queue, focus trap,
  Escape/backdrop close and focus restoration. Never use a right-side drawer.
  Set opening focus synchronously after revealing it; RAF can be suspended when
  an otherwise healthy native window is occluded. Motion never gates keyboard use.
  Diagnostics, coverage, background composition and abnormal-task
  acknowledgement are bounded overlays with keyboard focus management.
- Scope page selection to .workspace-page[data-page]. The body's current-page
  metadata is not a page: hiding it during navigation blanks the whole app.
- Keep the three independent quotas, reset histories, forecast limitations,
  version timeline, subscription countdown, token accounting, model pricing,
  task outcomes/confirmation and telemetry fields available in both languages.
- Compress card padding and summary heights rather than reducing readable text.
  Use shared SVG symbols with consistent stroke, viewBox and decorative semantics.
- Overview ledger tiles use two metric columns below 1500 DIP. Verify real
  billion-scale Token totals and four-digit USD amounts stay on one line at
  1200/1360 DIP; synthetic short values and overflow-only checks miss split digits.
- Never use overflow:auto/scroll on numeric metric fields. It creates nested
  horizontal or vertical scrollbars even for dashes and percentages at fractional
  scaling. Reflow their parent grid instead and keep the field overflow visible.
- Account and combined headlines share the exact same Codex Token/cost base;
  combined adds attributed local third-party usage and manual additions. With
  neither attributed usage nor manual entries both headlines are equal. Other local model counters are a separately labeled
  population and cannot replace either base. Model composition allocates the
  existing Codex projection by observed model weights, preserving Token and
  currency totals, then merges manual rows by model name. This is an allocation
  estimate, not measured account per-model usage.
- On 2026-10-30 the user attributed exactly z-ai/glm-5.3-free,
  qwen/qwen3.8-max-free and glm-5.3-flash to TokenRouter. These live local models
  appear in that provider's group and combined third-party totals, while keeping
  their recorded counts, per-call API-equivalent costs and maker pricing intact.
  Never copy their snapshots into the manual ledger, infer ownership of other
  routes from a shared maker, or count their cached input a second time. Automatic
  records are read-only; edits to a mixed row explicitly affect its manual part.
- Streaming duration and Standard/Fast/UltraFast are explicit evidence fields.
  Never subtract first-token latency from whole-turn time or infer tier from
  throughput. Whitelist safe tier aliases; missing fields remain unavailable.
- Compact task tails retain modern/legacy usage format identity. Interval
  telemetry uses separate cumulative baselines and the cost reader's evidenced
  mirror deduplication, including rollback of a confirmed first mirrored pair.
  A cross-format baseline offset is not a counter reset. Count numeric usage
  preceding the first model context in task telemetry, but leave its cost
  unpriced; never silently drop it or assign a later model retroactively.
- Save appearance and background opacity as one atomic settings transaction,
  committing memory only after disk succeeds. Resolve derived glass-alpha
  variables on the same workbench element that owns --card-opacity. Preserve
  unrelated settings and background assets across cold starts.
- Branding keeps the established appId and codex-quota-monitor userData path.
  Native previews use a persistent isolated profile, seeded only when missing;
  a fresh empty scan must not masquerade as a user's retained historical ledger.
- Sidebar and toolbar stay outside the scrolling content area. Wider windows
  use multi-column grids; narrower ones reflow without shrinking text. Tables
  may scroll inside their own container. Important copy never uses ellipsis.
- User background remains continuous behind all pages, cards and drawers. Keep
  readable foreground contrast independently from image strength. Bound blur
  layers, stop hidden charts and respect reduced motion/transparency.
- Resizing uses actual chart-container dimensions. Refreshes preserve navigation,
  sort/filter state, scroll position, selected task and focus. UI actions must not
  recalculate or clear retained numeric records.
- Coverage markers remain in secondary usage/task analysis, not overview cards.
  Model price catalogs display unavailable rates as unavailable rather than zero.
- Offline is a remote-quota state. Local indexing or task activity cannot imply
  online. Keep the last safe display and permanent histories available offline.

After native window changes verify title movement, blocked resizing/maximizing,
minimize, taskbar/tray restore, rounded outline and a second launch.
Verify 1200 × 800 and smaller work areas, 125/150/200% scaling,
monitor removal and readable Chinese/English with light/dark custom backgrounds.
Never claim native interaction verification from static source checks alone.

## Quota normalization

- Identify quota windows by `windowDurationMins`, not by `primary`/`secondary`
  order or object position.
- The 5-hour target is approximately 300 minutes.
- The weekly target is approximately 10,080 minutes.
- Retain a small duration tolerance for server variation.
- Missing 5-hour data with valid weekly data is an official paused/disabled
  special state, not offline, not missing weekly data, and not itself a reset.
- Preserve the most recent complete reset-credit details when a same-count server
  response temporarily contains only a count.
- Validate numeric timestamps and percentages before rendering or comparing them.

## Reset-credit and event rules

### Newly received credits

- The first successful snapshot establishes the baseline and must not report old
  credits as newly received.
- Prefer stable item IDs for comparison.
- When an item ID is absent, use a deterministic fingerprint of normalized reset
  metadata so an unchanged credit is not repeatedly reported.
- A later unseen identity may create a new-credit event.
- The UI notice is retained for seven days.
- Persist the seen baseline in `quota-state.json`.
- Append detected grants to permanent `receivedResetHistory` with the observation
  time, count, and normalized credit details.
- Migrate the legacy `lastNewResetAt` and `lastNewResetCount` values into one
  permanent history entry without inventing unavailable item details.
- Display received history newest-first and do not clear it merely because a
  later quota read is offline.

### User manual resets

A user-triggered reset normally restores quota while consuming at least one
available reset credit. If the available count decreases across the same snapshots:

- require an early full-quota recovery pattern, complete before/after credit
  details, and exact stable identities for every disappeared credit;
- retain the first strongly evidenced decrease only as a pending candidate and
  require the next successful complete snapshot to keep every disappeared
  identity absent before classifying it as a manual reset;
- discard the candidate when the next successful snapshot rebounds above the
  candidate count, because transient incomplete/zero responses are not usage;
- preserve credit-consumption evidence across transient list omissions;
- show that it was excluded;
- never append it to official-reset history;
- do not let simultaneous quota recovery override the consumed-credit evidence.
- append one permanent `consumedResetHistory` record per unique credit identity,
  with the observation time,
  consumed count, before/after available counts, and exact missing credit details
  only when both item lists are complete;
- never record count-only decreases, incomplete credit lists, repeated
  disappearances of the same identity, or decreases without a matching early
  quota recovery; exclude complete comparisons when every disappeared credit
  reached its expiry;
- treat pre-evidence-version manual-reset records as invalid in recovery because
  older clients permanently recorded transient list omissions; immutable archive
  files may remain on disk, but those invalid entries must not re-enter the UI;
- preserve and reconcile that history across primary state and archive
  generations, and force an immutable archive when a new usage event is added.

### Official remote reset display

- User-requested contract for v1.3.0-beta: official reset display and history use
  only validated public website announcements. Do not append inferred account
  resets or expose legacy local inference history.
- Persist officialResetSource=community so archive reconciliation cannot restore
  retired local records. Keep immutable archive files and credit grant/consumption
  history intact. Local early-recovery comparisons are still needed solely to
  validate credit consumption; they must never produce official-reset records.
- Public announcements do not prove that this account reset. Keep links, source
  freshness, samples and experimental probability limitations visible.

### Community checkpoints and Reserve fallback (v1.3.0-beta)

- Read only pinned HTTPS public endpoints from codex-reset.com and the inert
  JSON data from codexresettracker.com, with timeouts and byte limits. Never
  evaluate remote scripts. Accept confirmed global resets only; exclude grants,
  previews and speculative feed labels. Validate official-source links.
- Community announcements are a separate permanent history, never reconstructed
  account-local resets. They remain available after offline periods and archive
  recovery. Show source freshness, retrieval time and population separately.
- Prefer the fresh checkpoint's experimental 24/48-hour forecast; disclose its
  sample size and experimental limitation. Historical median estimates are a
  labeled fallback. Hide probabilities after 24 hours without a source check or
  with fewer than three intervals. First fetch is not a new account reset.
- Reserve may be omitted by the CLI even with supportsLunaReserve. The main
  process may read the installed client's official usage route with existing
  ChatGPT authentication. Keep credentials exclusively inside the bounded reader;
  never return or persist identity fields, credentials or raw responses. Support
  SSE usage.snapshot and the ordinary usage route; throttle unsupported SSE.
- Only an independent exact gpt-reserve bucket supplies Reserve. A missing bucket
  stays unavailable; never substitute the main quota or synthesize a percentage.
- Recognize modern final_answer lifecycle evidence and whitespace in JSON lines.
  On Windows, NTFS mtime can remain stale while an open log is appended. Use
  the newest validated in-log timestamp together with mtime for inactivity;
  never mark a long running task abnormal from stale filesystem metadata alone.
  Collect preceding terminal turns even when a later turn starts between polls.
  A missing task needs two complete reads before an inferred terminal notice;
  truncated reads and rebounding tasks must never trigger that inference.
- Read only bounded goal status/budget counters from the read-only goals database,
  omitting objectives. Recognize session_meta subagent.thread_spawn and parent IDs.
  Managed goal steps have their own outcome counter and do not alert as abnormal.
  Retain actual manually interrupted and abnormal outcomes with terminal evidence.
- The task dialog supports context/status filtering, persistent sorting and one
  action confirming all completed rows. Confirming does not alter numeric records
  or dismiss running/interrupted rows. Verify controls and close buttons in both
  languages; fixed-window movement and state recovery remain mandatory.
- GPT-6.1 Sol pricing uses the official Standard card dated 2026-10-10:
  USD/million input 2, cached input 0.10, cache write 2.5, output 10; beyond
  272K input use 2x input classes and 1.5x output. Pricing-only changes must preserve compatible schema-6 and schema-7
  numeric ledgers. Missing historical prices show pending recalculation until a
  user-requested full scan; never discard recorded Tokens to add a price.

Keep these states distinct:

- `update-ready`: Codex has found and downloaded/staged a newer Store update.
- `updated`: the installed Store package version increased.
- `current`: a valid check reports no pending or newly installed update.
- `unavailable`: installed/update status cannot be determined safely.

Pending update rules:

- Read the installed `OpenAI.Codex` or compatible `OpenAI.ChatGPT` Store package
  version locally.
- Parse only lines tagged `[windows-store-updater]`.
- A positive pending signal requires the updater result to include
  `canSilentlyDownload=true`, `completed=true`, and `hasUpdate=true`.
- The log's checked/build version must match the installed version.
- The target/manifest version must be newer than the installed version.
- Persist the pending target across monitor restarts.
- Clear it only after that version is installed or a later explicit updater result
  for the same installed version says no update.
- Detecting a higher installed version creates an installed-update notice retained
  for seven days.
- The first observed installed version is a baseline, not an update event.
- Each later higher installed version appends one permanent timeline record with
  the previous version, new version, and the time this monitor first observed it.
- Migrate the legacy single installed-update record into the timeline, de-duplicate
  adjacent refreshes, and never create timeline entries for rollbacks.

Performance and privacy:

- Keep the updater scan bounded by file count, bytes, and age.
- Keep the 15-minute scan cache unless a tested reason requires changing it.
- Do not scan or store conversation bodies, prompts, account credentials, or
  unrelated log contents.
- Do not use `winget`, arbitrary web releases, filename guesses, or account UI text
  as the authoritative latest-version source.
- A quota connection failure must not erase a valid local pending-update state.

The old implementation only compared installed versions and therefore missed the
client's visible “Update” button before installation. Do not regress to that model.

## Token usage analytics

- Read account usage only through the local app-server `account/usage/read`
  request with protocol `params: null`.
- Keep `summary.lifetimeTokens` as the separate official account total. Derive cumulative
  work days deterministically from normalized non-zero `dailyUsageBuckets`; do
  not infer either value from local conversations or quota percentages.
- Normalize `dailyUsageBuckets` by validated `YYYY-MM-DD` dates and non-negative
  integer Token counts. Treat the response as untrusted input.
- Daily aggregation fills missing dates with zero. Weekly aggregation starts on
  Monday. Monthly aggregation uses calendar months.
- The day/week/month chart switch must animate and remain keyboard accessible.
- The full Token chart draws every statistical node. Hovering a node shows its
  localized day, week range, or month plus the exact Token count; the tooltip
  must stay inside the chart boundary.
- API-equivalent cost pricing must cover the current native Codex catalog and
  historical native Codex model IDs that can remain in rollout history:
  `codex-mini-latest`, GPT-5/Codex/Codex-Mini, GPT-5.1 and its Codex variants,
  GPT-5.2/Codex, GPT-5.3-Codex, GPT-5.4/mini, GPT-5.5/Cyber, and the GPT-5.6
  family. Match official dated snapshot suffixes without treating arbitrary
  provider suffixes as an OpenAI model.
- Include GPT-6 Sol and Luna standard rates. Treat `gpt-reserve`/`gptreverse`
  cost as a user-requested GPT-5.6 Luna equivalent, not a published Reserve
  API price.
- `codex-auto-review` uses the documented GPT-5.3-Codex code-review rate.
- Models without a published standard API-equivalent rate, including research
  previews and third-party providers, remain visibly unpriced rather than
  borrowing a similarly named model's price.
- Recognized Codex++ routes for DeepSeek, GLM, Qwen, MiniMax, and Kimi may use
  checked-in vendor prices. Match bounded family/version tokens through explicit
  regular expressions so safe provider prefixes and routing/date suffixes do not
  hide a known model; never use a bare substring or price an unknown variant.
- Codex++ reports third-party uncached input and cached input as disjoint counts.
  Add disjoint counts for total input and cost splitting; explicit vendor cache fields or consistent total counters distinguish inclusive input. Do not calibrate
  recognized third-party usage against OpenAI account-usage buckets.
- A Token usage endpoint failure must not make an otherwise successful quota read
  appear offline. Preserve and clearly identify the last normalized Token usage
  snapshot instead.
- Expose only normalized summary numbers and dated Token buckets to the renderer.
  Never expose raw account responses, authentication data, prompts, conversation
  content, or unrelated thread metadata.
- `account/usage/read` does not expose a model breakdown. Model cost details come
  from a bounded scan of local Codex rollout JSONL files instead.
- Persist raw model aggregates by validated event date. The user requests the
  legacy pricing algorithm: use matching official daily buckets to cap native
  OpenAI model allocation in the displayed cost statistics, with a factor no
  larger than one. Keep third-party vendors independent. This is estimated
  allocation, not evidence that every adjustment is a replay. Never persist
  calibrated counters over the raw ledger. Remove confirmed duplicates only
  from matching rollout identities and usage-counter evidence.
- In model-cost details, `inputTokens` is total request input and already includes
  cached input. Label cached input as a subset and never present the two columns
  as additive or comparable to the official account lifetime Token total.
- The local cost total is a content-width inline summary with equal-size,
  vertically aligned label and amount. Model-card rate footers show prices, units
  and cache TTLs only; omit vendor prose, call counts and context-accounting notes
  from that line. Keep pricing calculations and unknown-price states intact.
- A Token-count event without a directly preceding valid model context is
  unattributed coverage, not an `unknown` model. Exclude it from model totals and
  estimated cost, retain only normalized aggregate coverage counts, and never
  guess its model from a later context.
- A genuinely incompatible counter schema may require a rebuild. Pricing-only
  changes are compatible and must retain recorded model Tokens. Schema 6 and 7
  share the same counter semantics and must reconcile without an automatic rebuild.
- Replay de-duplication spans the whole rollout file. A repeated complete
  cumulative-plus-last Token signature remains a duplicate across turn-context
  records; equal per-call usage with different cumulative counters remains a
  distinct call.
- Before parsing a rollout line, reject every record except `turn_context`, `token_usage_record` and
  `event_msg` records tagged `token_count`. From accepted records retain only the
  normalized model slug and Token counters. Never retain or expose prompts,
  messages, tool payloads, workspace paths, thread titles, or rollout filenames.
- De-duplicate replayed `token_count` records by their cumulative and last-usage
  counters before aggregation. Ignore synthetic counter events with no input,
  output, or cache-write usage.
- Estimate cost with the checked-in, dated standard OpenAI API price table. Use
  uncached input, cached input, cache-write input, and output rates separately;
  apply documented long-context multipliers per call where applicable.
- The estimate is not a Codex subscription charge. Third-party and otherwise
  unpriced model slugs remain visible but do not contribute to the USD total;
  unattributed events are coverage rather than a model card, and the UI must make
  partial pricing explicit.
- Cache ordinary production cost recovery for 30 seconds and task-history recovery
  for 60 seconds; manual cost rebuilds use bounded background passes instead; reuse the last normalized
  persisted snapshot across restarts and temporary scan failures. Do not rescan
  multi-gigabyte rollout history on every change notification.
- Cost aggregation must include readable rollout files from both
  `.codex/sessions` and `.codex/archived_sessions`. Moving a session into the
  Codex archive must not lower the cumulative API-equivalent estimate.
- De-duplicate the same stable rollout identity across active and archived roots
  during move/copy transitions, preferring the more complete readable copy so a
  session is neither double-counted nor partially replaced.
- Treat the total-byte scan limit as a per-pass work budget, never as the
  cumulative population. Persist a privacy-safe hashed rollout index containing
  only normalized model counters and merge unfinished batches on later reads;
  sessions that leave the current filesystem inventory must not erase previously
  observed cumulative usage.
- Scope replay-counter signatures to one rollout. Equal cumulative/last counters
  in two distinct rollouts are distinct usage evidence and must not be globally
  de-duplicated.
- Reconcile API-equivalent snapshots within compatible cost-ledger schemas.
  Merge compatible hashed rollout entries across immutable archives, but never
  restore an incompatible aggregate or use it as a migration floor; rebuild it
  from readable rollout files so corrected de-duplication can lower bad totals.
- Treat each successful `account/usage/read` response as one authoritative
  account snapshot. Replace the cached Token summary and daily buckets together;
  never take historical maxima or merge dated buckets across snapshots because
  backend corrections, account changes, or scope changes can otherwise preserve
  an inflated total indefinitely. Use only the newest complete stored snapshot
  when the endpoint is unavailable.
- A summary-only response without `dailyUsageBuckets` must not replace the
  latest complete dated snapshot; doing so makes legacy fee calibration jump
  back to inflated raw counters. An explicit valid empty/zero snapshot still
  replaces an older higher value. Do not merge account maxima or date buckets.

### Subscription details

- The plan shown in the online connection strip is a keyboard-accessible,
  clickable entry to a bilingual subscription-detail dialog.
- Use normalized non-zero account usage days for “assisted development days”;
  do not substitute calendar age, conversation counts, or local file dates.
- The public app-server account and rate-limit methods do not expose subscription
  expiry. Read only the signed ID-token payload's plan and subscription
  start/end/check timestamps from the bounded local Codex auth file.
- Never expose, persist, or log the ID token, access token, refresh token, API
  key, email, account ID, user ID, or unrelated claims.
- Validate the auth file size, JWT structure, claim namespace, plan enum, and
  timestamps. API-key login and malformed or missing claims are unavailable
  states, not guessed subscriptions.
- When Codex still reports a paid plan but the signed claim contains the previous
  billing period, project the next renewal using that period's calendar-month
  cadence and label the displayed date as estimated.
- Keep the renewal countdown live to the second while its dialog is open.

### Active task monitoring

- A task is active only when the most recent explicit lifecycle event in its
  rollout is `task_started`; `task_complete` and `turn_aborted` exclude it
  immediately. Do not infer active work from file modification time alone.
- Classify an explicit `turn_aborted` with reason `interrupted` as a manual
  interruption. Classify an observed active task that disappears without either
  a normal completion or manual-interruption event as abnormal; an unfinished
  task moved into the archive or superseded by a new task is also abnormal.
- Use the terminal event's duration/end timestamp when present. If an active task
  disappears without a terminal event, freeze it at its last observed elapsed
  time; never add the next refresh interval or continue its renderer timer.
- If a rollout still ends in `task_started` but has produced no filesystem or
  event evidence for 15 minutes, classify it as abnormally interrupted and
  freeze it at the last timestamp in that rollout. This prevents abandoned or
  crashed sessions from remaining active forever without relying on modification
  time as the sole evidence that a task started.
- Show the red-glass abnormal-interruption dialog once per newly observed event.
  Both completed and interrupted handoffs remain in the pending area until the
  user confirms them or returns to Codex.
- Support multiple simultaneous active rollouts and keep their timers updating
  through a visible-only renderer paint clock, without fixed one-second data polling.
- Tail reads must remain bounded by file count, age, bytes per turn, total bytes,
  and task count. Expand a tail only until the last lifecycle event is found.
- From active rollouts expose only the validated turn ID, project directory
  basename, start time, normalized model Token totals, and estimated cost. Never
  expose the full workspace path, prompt, task title, message, or tool payload.
- Active-task snapshots remain volatile. When a previously observed active task
  disappears from a complete, non-truncated read, expose one bounded completion
  handoff entry without continuing its timer or treating it as running.
- A completion handoff remains in renderer memory until its `Return to Codex` or
  `Confirm` action is used. `Return to Codex` must foreground only the trusted
  installed Codex Store window; both actions remove the completed entry.
- Reconstruct aggregate task history from readable rollout lifecycle and
  Token-count records in both `.codex/sessions` and
  `.codex/archived_sessions`, de-duplicating the same rollout identity during
  move/copy transitions. This recovery may be bounded and must say so internally.
- Persist monotonic numeric records for total terminal task count, total elapsed
  time, total API-equivalent cost, completed/manual/abnormal counts, longest
  duration, and highest single-task cost. A bounded hashed-rollout index may
  retain only these per-rollout numeric aggregates so changing scan windows can
  be merged without double counting. Do not persist task IDs, project names,
  paths, models, or pending handoff entries.
- Exclude legacy completions that provide neither a duration nor a completion
  timestamp from total/average elapsed-time calculations; still include them in
  total task and outcome counts. Never turn replay delay into task duration.
- Reconcile those numeric records by maximum value across the primary state and
  archive generations so a reset or older state cannot lower them. A newly
  recovered aggregate or terminal task forces an immutable archive immediately.
- If the monitor is always-on-top, returning to Codex may temporarily yield that
  native level. Restore the saved always-on-top preference only when the monitor
  is focused or shown again.
- Use filesystem changes and app-server notifications for synchronization. Batch
  local events for 180 ms, serialize readers, adaptively yield after slow reads,
  and coalesce remote reads with a 3-second minimum gap. Official non-push fields
  use 30/60-second fallback checks; do not claim per-token streaming support.
- Parse local usage in one background worker with a 128 MiB old-space limit,
  64 MiB history scan batches, an 8 MiB compact tail cache, and bounded queues.
  Reuse unchanged files and read appended bytes; never retain conversation text
  in compact complete-record caches. Freeze partial telemetry rather than inventing
  speeds. Retry failed workers with backoff and terminate them on exit.
- Coalesce live record persistence to 30 seconds, flush on exit, and immediately
  archive terminal outcomes. Historical recovery remains explicitly partial until
  indexed. Do not rescan multi-gigabyte history on every file event.
- Windows SQLite read-only queries emit change events for goals_1.sqlite-shm.
  Never use shared-memory notifications to schedule another read: that creates
  an endless self-refresh loop. Watch only the database and WAL for Goal changes.
- The main-card and per-task elapsed time visually pulses only while at least one
  task is active. Respect the operating system's reduced-motion preference.

## Background workflow (2.0)

- Click and drag/drop accept PNG, JPEG, WebP and GIF up to 20 MB. Validate encoded
  dimensions before native decoding: positive sizes, at most 16000 per side and
  40 megapixels. Decode GIF to a static frame. Validate IPC as untrusted input.
- Never require 460 × 690 images or fixed portrait exports. Composition supports
  current window, 16:9, 16:10 and original aspect, pointer and keyboard adjustment,
  plus an explicit use-entire-image action. Bounds stay inside the source.
- Retain a bounded normalized source and crop coordinates; keep the old asset
  until its replacement and settings have saved successfully. Only remove known
  application-owned background files inside userData, never arbitrary paths.
- Background defaults to contain without upscaling, with pixel-ratio-aware sizes.
  Never use unconditional cover or CSS transform scaling on small legacy images.
  Keep the entire upload by default; reframing is an explicit action. Enlargement
  requires an explicit allowUpscale choice, and every fit preserves aspect ratio.
- Fit, focal position, zoom, blur, white overlay and card opacity preview live.
  Apply commits appearance and Cancel restores it. Existing backgrounds continue
  to load after migration; missing originals are not reconstructed or invented.
- Changing window dimensions adapts layout/background without asking for recrop.
  Keep decode/display work bounded; CSS blur must not affect text opacity.

## Internationalization

Chinese and English are equally supported product modes.

- The Chinese product and window title is `Codex监测台`; the English title
  remains `Codex Quota Monitor`.
- Every user-visible string must have both `zh` and `en` entries.
- The dictionaries must expose exactly the same keys.
- Localize dynamic statuses, reset types, errors, dates, dialog text, tray menu
  text, tray tooltip, window title, `title` attributes, `aria-label` values, and
  region/dialog names.
- `data-i18n` covers static visible text; `applyLanguage()` must update dynamic and
  accessibility-only attributes.
- The language button intentionally shows the *target* language: `EN` in Chinese
  mode and `中` in English mode.
- Product/section marks such as `CODEX PULSE`, `RESET CREDITS`, and
  `BACKGROUND CROP` may remain English as intentional visual branding.
- Known API enums must use localized application copy before raw server titles.
  In particular, `resetType === "codexRateLimits"` maps to localized `fullReset`.
- Unknown server-provided proper names may be displayed verbatim only when no safe
  mapping exists.
- Run `test/localization.test.js` after adding, removing, or renaming any copy.
- Visually inspect the entire English window, every popover/dialog, online/offline,
  the 5-hour-paused state, long reset dates, and update states for clipping.

Historical language/readability failures:

- English mode retained Chinese button and region accessibility labels.
- The document/window title remained Chinese after switching to English.
- The tray tooltip remained Chinese.
- Some longer English copy was rendered as `...`.
- Typography was reduced until normal text became difficult to read.
- A raw server `Full reset` title bypassed Chinese localization.

## Tray and icon rules

- Use the current original-style Codex-derived desktop/tray assets.
- Do not redesign or replace the icon unless the user explicitly requests it.
- Keep dark- and light-theme tray variants.
- Single-clicking the tray icon toggles visibility.
- Closing the card hides it to the tray; quitting is a tray-menu action.
- Tray menu and tooltip must update immediately after language changes.
- Portable and installer builds have the same runtime features. They differ only
  in installation, shortcuts, and uninstall integration.

## State, privacy, and error handling

- Manual third-party usage uses a bounded atomic primary and validated `.bak`.
  Recover a missing/corrupt primary from backup before any save; retain corrupt
  bytes separately. If no valid generation can be read, reject writes. Reject
  more than 500 entries rather than truncating user records. Verify cold reads,
  backup recovery and failed-save preservation when changing this storage.
- Display manual usage by case-insensitive provider/model identity. Existing v1
  batches remain intact when grouped; adding a model must not duplicate an existing
  identity. Each provider offers model addition, and each model offers replacement
  of its total or incremental usage, with current/after previews.
- Increment batches retain their own rates and estimation semantics, without
  repricing history. Only exact batches with matching rates, known cached counts
  and compatible request-count evidence may compact. An unchanged aggregate edit
  must be a no-op; explicit replacement/deletion affects that model's batches only.
- Manual/imported cache-write Tokens are a subset of total input, distinct from
  cache reads. Retain their counts and rate through normalization, grouping,
  increments and edits; charge regular input only after subtracting reads/writes.
  Imported provider CNY bills stay separate from USD API-equivalent estimates;
  never convert implicitly. For unspecified cache TTL use the existing short-TTL
  estimate basis and retain the limitation in the import summary.
- New manual mutations run against the latest disk generation in the main process.
  Require the selected model's revision for replacement, increments and deletion;
  reject stale/replayed or invalid changes before touching primary/backup bytes.
  Partial default changes preserve other defaults and all provider records.

- Settings are stored in `settings.json`.
- Event baselines, reset history, credit detail cache, and client-update state are
  stored in `quota-state.json`.
- The last normalized Token usage summary and daily buckets are also stored in
  `quota-state.json` for temporary endpoint failures.
- The last normalized model Token totals and API-equivalent cost snapshot are
  stored in `quota-state.json`; rollout paths and raw records are never stored.
- Active-task snapshots and completion handoff entries are not stored; only the
  numeric longest-duration and highest-cost records are persisted.
- Keep versioned, immutable quota-state archives in the adjacent
  `quota-state.json.archive` directory. Archive at least every 15 minutes while
  state writes continue and immediately whenever a permanent history or the
  seen-credit identity set changes.
- Write the primary state and every archive through a same-directory temporary
  file or exclusive archive creation, flush the file before rename, and never
  overwrite an existing archive generation.
- On startup, inspect the primary state, interrupted-write temporary files, and a
  bounded set of newest archives. Ignore corrupt generations, reconcile all
  permanent monotonic histories, and repair the primary automatically.
- A missing, unreadable, truncated, syntactically invalid, or valid-but-reset
  primary file must not erase richer website-announcement, received-reset, or
  client-update history held by an archive. These histories and seen identities
  may only grow.
- Recovery must not block legitimate changes to volatile state, including an
  installed-version rollback baseline, clearing a completed pending update, or
  dropping stale reset-credit details.
- Retention counts only validated archives. Corrupt files must never cause valid
  recovery generations to be pruned.
- Offline startup must still expose website announcements, received-reset,
  and client-update histories to the renderer.
- Cropped background is stored in the Electron user-data directory.
- Write sensitive local state with restrictive file permissions where supported.
- Never ask the user for an OpenAI API key.
- Authentication belongs to the local Codex app-server.
- Do not persist raw protocol responses or app-server stderr.
- Offline handling must distinguish at least not-installed, not-signed-in,
  timeout/network failure, and generic connection failure where evidence allows.
- The offline connection dialog must continue to mention mainland-China VPN and
  network checks in both languages. It may auto-open only once per app session:
  periodic refreshes, language redraws, and later online/offline flapping must not
  reset that eligibility. The red breathing light can always reopen it manually.
- Avoid destructive state migrations. Preserve prior reset and update history.

## Testing matrix

Run focused desktop-settings, background-boundary/geometry, localization, renderer
navigation/layout and packaging checks for 2.0. Exercise real Chinese and English
across pages, task filters/confirmation/modal, charts, connection/coverage/crop
modals, offline and missing quota states. Confirm navigation and acknowledgement
leave token/cost/work-day/history counters unchanged. Do not re-run unrelated
service tests unless a concrete failure or changed business code warrants it.

Storage and monetary gates remain mandatory: preserve real ledger values through
cold start and archive recovery; inspect ASAR and built source bytes, architecture,
versions, SHA-256 and signature status. Test the new executable/process rather
than assuming a launch replaced an older single-instance process.

## Build and release checklist

1. Preserve unrelated user changes in a dirty worktree.
2. Never use destructive reset/checkout operations to clean the tree.
3. Update `package.json` and `package-lock.json` versions together when a new
   public version is required.
   Padded display versions use valid SemVer internally: 1.3.51 in package/lock
   metadata, with displayVersion/buildVersion and filenames set to 1.3.051.
4. Run `node --check` for changed JavaScript where useful.
5. Run the directly relevant targeted checks.
6. Complete the visual/manual matrix proportionate to the change.
7. Run `npm run build`.
8. Confirm portable and NSIS filenames and architectures.
9. Inspect the packaged ASAR:
   - required `src` files are present;
   - `AGENTS.md`, `README.md`, `test/`, `scripts/`, and repository metadata are
     absent.
10. Record output sizes and SHA-256 hashes.
11. Smoke-launch the newly built executable, not an older process or artifact.
12. Do not commit, push, create a GitHub release, or upload artifacts unless the
    user explicitly authorizes that external action.

## Change discipline

- Prefer small, evidence-backed changes over rewrites.
- Use the approved 2.0 white/cyan desktop design; preserve business behavior.
- Fix root causes; do not hide symptoms by shrinking text, forcing bounds every
  frame, expiring history, or suppressing state.
- Keep pure detection/geometry logic independently testable.
- Treat server schemas and Store updater logs as untrusted input.
- Bound filesystem scans and expensive work.
- If a reported issue cannot be reproduced, inspect persisted state, real local
  logs, and the current packaged version before changing detection heuristics.
- When a regression or new product rule is found, add:
  1. a focused test where automation is possible;
  2. a manual checklist item where native interaction is involved;
  3. a concise entry in this `AGENTS.md`.


## Persistent model ledger and self-updates (1.3.0)

- Do not re-read already indexed legacy sessions automatically, even when their
  metadata changes. Preserve the numeric record and offer an explicit full scan.
  New resumable records read appended bytes only. Archive moves and missing files
  retain their recorded totals. File-count and byte limits are per-pass budgets.
- Stream large JSONL lines using a whitelist projector; store only model/type/
  timestamp metadata, numeric counters, UTF-8 pending bytes and hashed replay
  signatures. Unknown object keys and conversation strings must be discarded
  before a persisted chunk boundary. Never retain line fragments or tool bodies.
- A manual full scan covers both session roots and keeps committed records visible
  until each replacement reaches EOF. Its new generation may legitimately lower
  corrected totals; older archives must not resurrect the previous generation.
  Resume persisted work after restart. Coalesce worker requests and use bounded
  64 MiB passes with adaptive rest time; never parse history on the main thread.
- The larger three-quota panel and latest-task board share one left/right row.
  Running turns take precedence over completed turns, even if a child started
  later than its live parent. Accept newer snapshots by observation time, never
  freeze telemetry by comparing only turn start times. Unchanged cached windows
  must advance whole-turn averages without parsing their counters again.
  The upper-right concurrent count includes all observed running main/subagent
  turns; its bilingual tooltip identifies subagent count. Mark incomplete counts
  as lower bounds and failed reads as unavailable, never a confirmed zero.
  A persisted paused/blocked/limited Goal can predate a new manual turn or live
  child. Only a timestamped Goal transition at/after the turn's start and latest
  evidence can stop it; subsequent log activity supersedes that transition.
  Keep millisecond precision so a new start later in the same second is not
  stopped by an earlier transition. Obtain the header version from local package
  metadata through settings IPC rather than a hardcoded renderer string.
  Set min-height: 0 on its grid children; wrapped telemetry must stay within
  the fixed row. Verify panel bounds and text bounds in both languages so the
  reset row cannot cover the Reserve progress bar when metrics are added.
  Latest-turn Tokens and interval telemetry update while running. Cache hit rate
  is cached input divided by input over observed calls, weighted across models;
  output is excluded and missing/zero input stays unavailable.
- Task details label goals and subagents, show the database's goal-wide numeric
  Tokens/time separately from current-turn elapsed time and model-level cost.
  Never expose the objective text or imply current-turn cost is lifetime goal cost.
- All UI copy is bilingual. Avoid decorative middle-dot strings. Wrap long names
  and durations or provide an explicit bounded scroll area. Check text bounds in
  every secondary view. Six reset rows require 188 px (6*28 + 5*4), not 186 px.
- Monitor self-updates use only Nahida728/gpt-quota-pet-Shirotide on GitHub. Stable
  installs exclude prereleases; beta installs can receive beta or stable upgrades.
  Never downgrade, accept draft releases, arbitrary URLs or asset-provided paths.
- NSIS uses electron-updater's verified update flow. Portable uses the exact x64
  asset and GitHub's SHA-256 digest, streamed size limits, a second pre-install
  hash check, and one hidden PowerShell handover copied outside ASAR. Paths come
  from the local bootstrap environment and user-data staging directory only.
- Replacing Electron binaries requires restarting the monitor. It must never stop
  Codex or its agents. Save state and position, wait for observed tasks to be idle
  before automatic installation, and allow an explicit restart/update action.
  Keep the previous portable executable for rollback and restore it on failed
  replacement/launch. Network failures must preserve an already verified update.
- Release asset names are ASCII and include the SemVer version. Publish latest.yml (beta.yml for beta channels)
  and the setup blockmap alongside the setup, portable, and SHA-256 manifest.
  Keep build.files as the src/package allowlist and inspect actual ASAR contents.
- Set the publisher's channel and releaseType explicitly for prerelease builds.
  RC versions use rc/prerelease with rc.yml; beta versions use beta.yml. An
  inherited stable publisher can emit only latest.yml for a beta version; require
  beta.yml and verify the packaged app-update.yml before delivering a beta.

## Checkpoint synchronization (1.3.2)

- The live radar's explicit confirmed=true is confirmation evidence even when
  confidence=medium and reset_verification_status=pending. Accept it only for
  non-preview global resets with a validated official-post URL. Exclude explicit
  confirmed=false, banked grants and banked reset kinds; retain legacy high-confidence
  archive/verified records that lack the newer confirmation field.
- Revalidate public endpoints with no-cache requests. Manual refresh bypasses the
  one-minute reader cache, with one in-flight request and a five-second force guard.
  A manual request during a full read queues at most one forced follow-up.
- Publish normalized checkpoint data as soon as it resolves, independently of
  quota/cost reads. Older full snapshots must not roll back a newer checkpoint
  observation. Preserve prior public history on failures and archive recovery.
- Public sources currently use bounded checks, not push delivery; automatic checks
  take up to roughly one minute plus source/network delay. Do not claim streaming.

## Reset forecast dashboard and client timeline

- The main reset-odds card has one compact title/source row and two equal metric
  panels. Baseline panels show 24/48-hour odds with matching decorative meters;
  commitment mode uses the same panels for its signal and target countdown.
  Keep source/stale/unavailable status in the header and retain the details action.
- Validated Tibo promise/dated-commitment signals take priority over historical
  24/48-hour odds. Display the checkpoint's separate commitment percentage, never
  label it an official probability or insert a promise into confirmed reset history.
  Hide priority after one hour without a forecast check, 48 hours after the post,
  or evidence of a subsequent confirmed reset. Keep historical odds independent.
- Count down only to a validated announced window/target. The current checkpoint
  sometimes puts explicit deadline overrides in OBSERVATION_DEADLINES rather
  than its API. Extract only that inert JSON object from its pinned HTTPS
  /assets/<hex>/home-countdown.js route discovered through the pinned homepage;
  never evaluate code, follow redirects, guess EOD timezones, or use historical
  common hours. Cache the mapping by asset version. Missing timing stays explicit;
  reaching a target means awaiting confirmation, never automatic completion.
- The probability dialog is a forecast dashboard with commitment state, countdown,
  historical intervals/ranges, method and source freshness. Confirmed announcement
  history remains in reset management. Only changed clock text updates each second;
  pause presentation while the application is hidden.
- Client version baselines may already be ahead of the permanent timeline after
  archive reconciliation. A fresh installed-version observation must repair an
  evidenced gap from the last recorded version even if it equals the baseline.
  First observations and downgrades still produce no invented upgrade. Record
  recovery/observation time explicitly, not an assumed installation timestamp.
- Prefer OpenAI.Codex over legacy OpenAI.ChatGPT when both packages exist. Refresh
  installed versions at most once per minute; manual refresh may bypass the cache
  with a five-second force guard and shared in-flight read. Cache parsed updater
  events by file size/mtime rather than re-reading unchanged historical logs.
  Group client history by month/date, retain all records and user expansion state
  across unchanged snapshots, and keep the close action outside the scroll area.

## Ledger recovery and replayed task durations (1.3.3)

- State reads and writes share a 64 MiB bound. The old 4 MiB reader rejected
  valid writer-produced model ledgers after restart. Never silently replace an
  oversized valid ledger with an empty baseline; preserve the previous file if
  a write exceeds the recoverable bound. Fold recovery archives sequentially,
  cache their validation metadata, and bound uncached retention validation.
- Task records belong to a persisted task ledger generation. During recovery,
  a newer intact model-ledger lineage takes precedence over task totals from a
  reset scan caused by missing state. Preserve independent reset/version history.
  Later model-only full scans must not change the explicit task lineage marker.
- A replayed final_answer can carry its replay time while task_started retains
  the original started_at. Prefer the following explicit duration_ms completion
  record. A final answer without explicit duration can use timestamps only when
  the start timestamp matches started_at; otherwise its duration is unavailable.
  Repeated starts for the same active turn must not create extra tasks.
- For persistence changes, verify a real-size ledger across a cold restart,
  archive recovery, and one incremental update. Displayed API-equivalent cost
  is calibrated; compare it separately from the raw local cost ledger.

## Weekly projection and reset calendars

- Valid weekly predictions use gold text and a centered four-DIP gold marker.
  Its CSS particle drift is decorative, pointer-transparent and hidden with an
  unavailable prediction; reduced motion retains the marker without particles.
- Extrapolate weekly remaining quota only from observed percent deltas in the
  same 5-hour and weekly windows. Persist one bounded sampling baseline. Never
  use lifetime Tokens, earlier weekly consumption, or an assumed zero anchor.
  Window changes, counter decreases and a weekly renewal before the 5-hour
  recovery invalidate the estimate. Hide the marker offline or after expiry;
  explain the constant-consumption-ratio assumption and insufficient samples.
- Reset calendars group records by local calendar day. Official cells count
  validated website announcements; credit cells count granted/consumed credits.
  No-record cells mean missing observations, not confirmed absence of activity.
  Preserve all underlying history and source links; allow older-year selection.
- Keep each calendar bounded to at most 54 weeks, reuse unchanged DOM, and
  create selected-day details in batches. History scrolls inside a no-drag area;
  six current credits and the dialog close action remain reachable. Calendar
  selection supports keyboard arrows and exposes dates/counts to accessibility.
- Recovery timestamps for an unchanged quota window can alternate by one second.
  Compare them to the original sampling anchor with a bounded five-second
  tolerance, never to a continually shifted timestamp. Preserve samples through
  that jitter; an expired anchor, meaningful window change or counter decrease
  still invalidates them. Rounded weekly percentages may legitimately stay flat;
  explain that state rather than showing an unexplained sampling wait.
- Calendar day targets are at least 12 CSS pixels with three-pixel gaps. Do not
  compress a whole year into six-pixel targets to avoid horizontal scrolling.
  Keep month labels aligned and scroll the selected cell into view on keyboard
  navigation/year selection, within the current scrollable page.
- Integer percentage readings can cross a rounding boundary after very little
  actual consumption. Never extrapolate a one-point weekly change from a
  two-point 5-hour change into a definite exhausted weekly quota. Require at
  least 10 and 2 percentage points of observed 5-hour/weekly change, retain the
  baseline while waiting, and calculate conservative percentage-resolution
  bounds. Hide estimates spanning more than 10 points or estimating zero while
  the bounds still allow remaining quota. Explain both the observed deltas and
  the bounds in Chinese and English; these are not statistical confidence limits
  and do not remove the constant-consumption-ratio assumption.

## Multi-instance usage adapter (1.3.52)

- Discover the default home, CODEX_HOME/CODEX_SQLITE_HOME, bounded Codex++
  codex-multi instance metadata, and explicitly configured CODEX_MONITOR_HOMES.
  Resolve aliases and include each home's sessions and archived_sessions.
  Refresh discovered roots and event watches when instances appear. Separate
  SQLite homes supply only safe goal counters; never read conversation tables.
- A root's position in the root list never means archived. Classify archive
  roots by their actual role so additional running instances remain running.
- token_usage_record usage/thread_token_usage and legacy token_count
  last_token_usage/total_token_usage describe the same calls. Adapt both to one
  signature, scoped to a rollout; paired records count once, equal counters in
  independent sessions still count separately. Compact caches keep numeric
  counters only, never response IDs, titles, contents or provider credentials.
- Resumed logs can give the two formats different cumulative baselines. Exact
  cumulative signatures alone then double-count mirrored calls. Adapter version
  3 also requires two adjacent cross-format pairs with equal last usage,
  constant counter offsets, and per-format increments equal to the next call.
  Preserve the numeric first-pair correction across bounded reads and restarts;
  correct Tokens, daily buckets, request counts and price units together. Equal
  per-call counts with increments covering separate calls must still count.
- Support explicit disjoint vendor cache-read/cache-write fields and standard
  input/prompt/completion token aliases. Cache is a subset of normalized total
  input; reasoning is a subset of output. Never trust a weighted or inconsistent
  total_tokens as physical token volume. Unknown prices remain unpriced.
- A valid official account snapshot supplies the main account total, chart and
  work-day denominator, including a cached or downward-corrected snapshot. A
  local multi-provider ledger must never overwrite it. Show local input
  (including cache) plus output separately; only use explicitly labeled local
  fallback when the account summary is unavailable. Never add the two
  populations. Legacy native-model cost calibration is a separate display
  projection, not a replacement for the account total. Cost averages use that
  same projected local population's non-zero dates, never the account work-day
  denominator. Undated usage stays in local
  totals with averages unavailable rather than invented work days. Coverage
  controls are secondary-only and state exclusions and rebuild limits.
- Usage adapter versions 2 and 3 change counter semantics. Rebuild readable old
  entries automatically in bounded background passes under a new generation,
  retaining committed values until each replacement reaches EOF. This is a
  counter migration, not a pricing refresh. Missing old entries stay retained
  and explicitly unverified; they may contain old duplicates and must not be
  presented as exact totals or lower-bound costs. Archives must not resurrect
  corrected generations. Do not rewrite the installed monitor's ledger while
  validating an isolated preview.
- Restore legacy daily calibration and existing per-call pricing instead of
  a second historical/base-rate estimate engine. Cost-page model Tokens and
  amounts must come from the same projection. Preserve current model prices,
  third-party usage, unlisted official dates and undated records; a missing
  official date is not zero usage. Use deterministic integer allocation so
  native input columns plus unattributed input exactly meet a matched daily
  budget, with cache/write/output subset bounds retained.
- Calibration scales an already-priced original call; it must not reclassify
  a formerly long prompt as short because its allocated input is smaller.
  Unknown model prices or unrecoverable tier weights stay pending under the
  original pricing rules. Keep numeric archive evidence intact. Cached,
  background and explicit refresh paths must all use the same newest complete
  official account snapshot and never persist projected model counters.
- Verify concurrent default/Codex++ tasks against live local logs, paired and
  new-only records, archive copies, cold restart, partial ledger replacement,
  input/cache semantics, and the same-denominator bilingual detail view.
## Vendor pricing and numeric repricing (1.3.53)

- Keep dated, first-party source URLs with the current Standard/global text
  pricing catalog. Recognize only explicit model versions and bounded route,
  snapshot and thinking aliases. Unknown model variants and unavailable cache
  prices remain visibly pending; never borrow an adjacent model's rate.
- Claude Fable/Mythos, Opus, Sonnet and Haiku use their own rates. Sonnet 5.5
  cache reads are $0.10/MTok; Opus 5.5 reads are $0.20/MTok. Preserve separate
  default-short and evidenced long-TTL cache-write counters. Missing TTL uses
  the explicitly disclosed short-cache equivalent, never an inferred 1h charge.
- Apply context tiers per request, including cached input and cache writes in
  prompt length. Haiku 5.5 changes above 100,000 input Tokens, OpenAI above
  272,000, Gemini 3.1 Pro above 200,000, Grok at 200,000, and MiniMax M3 above
  512,000. Do not apply an OpenAI multiplier to every vendor or to a cumulative
  model total. Current Claude 4.6+ non-Haiku models keep standard 1M pricing.
- Persist only numeric pricing weights and the validated context-rule shape
  alongside model counters. Compatible price updates revalue those weights or
  provably linear aggregates without changing Tokens, ledger generation or
  usage adapter version. Unrecoverable exact per-request tier weights stay
  pending until an explicit full scan; do not invent a short/long distribution
  or a second base-rate estimate to fill it. A price refresh cannot clear
  compatible stored aggregates merely because their source directories are
  unavailable.
- Vendor Standard rates are API equivalents. DeepSeek uses its explicit peak
  list basis; do not infer holiday discounts. Disclose regional, accelerated,
  reseller, tool and timed-cache-storage exclusions. Unpublished cache rates
  display unavailable, not zero. Show sufficient decimal precision for rates.

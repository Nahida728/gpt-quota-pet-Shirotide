# Changelog / 更新日志

## 2.0.0-rc.2 — 2026-10-30

- 品牌升级为 GPT-白汐 / GPT-Shirotide，仓库更名为 `gpt-quota-pet-Shirotide`；统一新宠物图标、任务栏图标、GIF 开屏、中英文说明和 RC 更新通道。
- 任务中心改为紧凑多列卡片，保留状态、身份、模型、耗时、费用和确认入口；完整目标及模型明细改为居中弹窗，支持焦点约束、Esc、遮罩关闭与返回焦点。
- 补全按钮、图标操作和下拉建议的 hover 过渡，遵循减少动态效果设置。
- 桌宠支持等比显示、捏压弹簧、小黄鸭音效、原生拖动、抛出与边缘反弹；固定窄绘制窗口避免全屏透明层拖慢其他应用，移除透明碰撞留白。捏宠物仅刷新额度，点击气泡才切换碎碎念、再点关闭。
- 保留测试阶段的存档恢复、第三方供应商追加/增量/替换用量、统一 Token/API 等价基数、外观原子保存、长数字和无边框圆角控件修复。
- Upgrade GPT-Shirotide branding, mascot icons, taskbar artwork, GIF splash, bilingual documentation, repository URLs and RC update metadata.
- Compact multi-column task cards open a centered, keyboard-accessible detail modal. Preserve task outcomes, acknowledgements, goal counters and model usage.
- Smooth hover feedback across actions and menus. Keep reduced-motion support.
- Add proportional pet artwork, spring squeezes, duck audio, native dragging, throws and edge bounces on a fixed narrow surface. Exclude invisible collision padding. Squeezing refreshes quotas; only bubble clicks show chatter and then close it.
- Retain ledger recovery, model-scoped third-party edits, consistent accounting bases, atomic appearance persistence and rounded frameless controls. Existing appId and data directory remain unchanged. This is a prerelease; install it manually when upgrading from 1.x.

## 2.0.0-beta.2 — 2026-10-30

- 品牌更名为 GPT-白汐 / GPT-Shirotide。新增白发龙角桌面宠物，默认按可见区域等比显示为 256 DIP，可调大小、贴边、独立置顶、气泡和可选音效；保留原工作台、页面和历史数据。
- 气泡沿用参考项目的 MIT 授权图形，改为浅蓝紫配色、256 DIP 宽；五小时与一周额度上下排列。去掉标题和 X，额度 → 社区 GPT 口癖碎碎念 → 关闭，七秒自动关闭；连续点击和双击均不打开主窗口，右键菜单或托盘恢复。
- 点按立即驱动连续弹簧挤压回弹，快速连点保留当前形态和速度；只有越过移动阈值才进入系统拖动，拖动前恢复原比例。修复透明宠物在原生窗口可见但后台节流时无法绘制的问题。
- 右侧统计改为左侧相同的 Codex Token/API 等价基数加手动第三方记录；未添加第三方时左右一致，费用构成同步使用该基数。保留本机模型明细及原账本。
- 保持原数据目录标识，修复测试预览每次使用空目录造成的存档丢失假象；已有预览设置持续保留。手动用量沿用安全备份恢复，失败写入不清空记录。
- 供应商和模型允许任意名称，建议菜单改为可滚动的浅色列表。修复外观透明度变量作用域，外观与背景强度原子保存；长数字保持单行并按可用空间重排，数值字段内部不产生滚动条。
- 原生右上角控件使用透明底色和浅色应用主题，预留真实按钮区域，避免拖动区与内容覆盖原生点击和悬停效果。
- 按用户选择固定主窗口为 1200 × 800 DIP，禁用缩放和最大化；全局卡片与原生窗口外轮廓统一为 12 DIP 圆角。首页一屏排列，最近任务与 Codex 任务换位，客户端更新移至侧栏实例入口上方。
- 费用构成改为按模型分摊既有 Codex 基数并合并同名手动记录，不改变左右总计。最近任务增加明确记录的流式输出时长与 Standard/Fast/UltraFast 挡位；缺失显示“—”，英文指标按单词换行。
- Rename to GPT-Shirotide and add a proportionally scaled white-dragon desktop companion, compact texture bubbles, community catchphrases and a responsive press spring. Left clicks only cycle quotas/chatter/closed; use the menu or tray to restore. Align both ledger bases, retain data identity, fix atomic appearance persistence, long numbers and editable scrollable suggestions, and reserve native caption controls.

## 2.0.0-beta.1 — 2026-10-28

- 2026-10-30 审计修复：手动第三方用量在主文件缺失或损坏时从有效备份恢复，并保留损坏原件；无法恢复或超过 500 条时拒绝写入，避免静默清空或截断。保留版本号，重新构建本地审计包。
- Audit repair (2026-10-30): recover manual usage from a validated backup, retain corrupt originals, and reject unrecoverable or over-capacity writes instead of silently losing entries. Rebuild the existing beta version locally.
- 测试版显式使用 beta / prerelease 发布配置并生成 beta.yml，避免继承正式版更新通道。Explicitly use beta/prerelease update metadata for the beta build.
- 修复中等窗口宽度下首页大额 Token 和金额拆分数字的问题，保留字号并改为两列指标。Keep large overview values intact with two metric columns at medium window widths.

- 修复续接会话中新旧用量记录累计基线不同导致的重复入账；校验每次调用增量并同步纠正 Token、请求数和计价权重，支持断点扫描及存档恢复。首页保留官方账号统计，本机多开与第三方用量单列；无法重建的旧记录明确标为未核实。
- 费用统计恢复老版官方日桶校准：OpenAI 原生模型的 Token 与金额同步分摊，第三方独立累计，官方缺失日期及未注明日期保留原记录。校准标为模型分摊估计，不覆盖原始账本与永久历史。摘要成功但日桶缺失时保留最新完整账号快照，避免费用页跳回旧计数。

- 升级为无边框 Windows 大窗口工作台：可缩放、最大化、系统分屏、任务栏、托盘和安全的多屏位置恢复；移除吸顶、悬浮球、小窗口和位置锁定。
- 白色与天青色磨砂玻璃界面，重构总览、用量费用、任务、额度重置、更新及设置六页；双语响应式布局，详情页面与任务抽屉保留全部原有业务入口。
- 压缩侧栏、卡片、摘要与图表空白，统一共享 SVG 图标；无边框窗口保留原生窗口按钮与系统边缘缩放。
- 背景默认保留完整图片，按屏幕像素密度显示，小图放大需要明确启用；支持横版/原图构图、完整显示、焦点、缩放、模糊、白色遮罩与卡片透明度；预览应用/取消，源图与原背景安全保留。
- 保留多开实例与第三方用量适配、各家模型计价和永久历史；价目表可搜索并打开经白名单验证的官方来源。页面切换和任务确认不改变累计数值。
- Replace the fixed transparent card with a frameless resizable Windows workspace. Add six responsive bilingual pages, white/cyan glass surfaces, retained-source backgrounds, a task drawer and a searchable public price catalog. Preserve ledger generations, usage accounting and all permanent histories.
## 1.3.053 / 1.3.53 — 2026-10-28

- 补全 Claude 当前各系列及历史 Sonnet、GPT-6.1 Terra、Gemini、Grok、DeepSeek、GLM、MiniMax 等已公开标准文本计价，识别厂商路由、日期快照及明确变体。
- Claude 缓存读取、短期/长期写入分别计价；上下文阈值按厂商、型号和每次请求应用。单价显示保留六位小数，未公开的缓存单价不显示为免费。
- 历史数值账本可直接重算线性模型金额，并保存每次请求定价权重供以后调价；Token 数、调用次数和账本代际保持不变。无法恢复分档信息的旧记录明确等待全量重算。
- Add sourced vendor pricing, Claude cache TTL classes, per-request context tiers, safe numeric repricing and explicit Standard/global estimate scope. Preserve usage counters and the existing multi-instance adapter.

## 1.3.052 / 1.3.52 — 2026-10-28

- 修复 Token 与任务监测只覆盖默认 `.codex` 的问题，自动接入 `CODEX_HOME`、独立 SQLite 目录及 Codex++ 多开实例；运行与归档目录按角色识别。
- 同时读取新版 `token_usage_record` 和旧版 `token_count`，同一调用的新旧镜像只记一次，独立会话分别计数。
- 按输入（含缓存）加输出计算本机 Token，适配第三方独立缓存及标准输入/输出字段；停止用官方账号日桶缩减本机用量。官方账号累计保留为独立统计。
- 旧版计数账本按有界后台批次重建，可跨重启恢复。日均使用相同来源的工作日，缺少日期时不编造日均。
- Discover Codex++ and custom Codex homes for concurrent tasks and local usage. Deduplicate new/legacy usage mirrors, normalize provider cache fields, separate local physical Tokens from account totals, and resume counter migrations safely across restarts.


## 1.3.50 正式版 / Stable — 2026-10-13

### 中文

- 重置概率卡片优先显示检查站的 Tibo 承诺概率，明确目标时间时展示倒计时和金色“即将重置”提示。时间未定、等待确认、源数据过期及已确认重置分别处理，不将承诺写入已完成公告历史。
- 概率详情重构为独立看板：承诺状态、目标窗口、历史 24/48 小时概率及区间、样本与间隔统计、来源和检查时间。移除与重置管理重复的公告列表；倒计时仅更新变化文字，隐藏窗口时停止绘制。
- 客户端升级历史按月份折叠、按日期分组，突出版本与时间并保留展开状态。修复版本基线已更新但历史仍落后的漏记情况，补记采用发现时间。版本检查缓存缩短至一分钟，手动刷新可重新读取；缓存不变的更新日志，优先识别 Codex 包。
- 修复小样本导致周额度预测错误显示 0% 的问题。原计算把五小时额度变化 2 个百分点、周额度变化 1 个百分点直接外推，放大了整数读数跨越边界的误差。
- 预测现在要求同一窗口内五小时、周额度至少分别变化 10、2 个百分点，并计算读数误差下的剩余范围。范围超过 10 个百分点，或范围仍允许剩余额度却估算为 0% 时，隐藏刻线并说明原因。等待期间保留样本，提示展示已观察增量及可用的误差范围。

### English

- Prioritize the checkpoint's Tibo commitment probability on the reset card, with a countdown and gold “Reset soon” state when an explicit target exists. Distinguish unspecified timing, awaiting confirmation, stale sources and confirmed resets; promises never enter completed-reset history.
- Rebuild odds details as a forecast dashboard: commitment state, announced window, historical 24/48-hour probabilities and ranges, interval statistics, sources and check times. Remove the duplicated announcement list. Update only changed clock text and stop painting hidden windows.
- Group client upgrades by month/date with preserved expansion state. Repair timelines left behind an already advanced version baseline, using recovery time. Shorten version caching to one minute, allow manual revalidation, cache unchanged updater logs and prefer the Codex package.
- Fixed small samples incorrectly predicting 0% weekly quota remaining. Extrapolating a two-point 5-hour change and a one-point weekly change magnified the error of rounded percentages crossing a boundary.
- Estimates now require at least 10 and 2 percentage points of observed 5-hour and weekly change within the same window, with bounds for percentage resolution. Hide the marker when the range exceeds 10 points or still permits remaining quota despite a zero estimate. Retain samples while waiting and explain observed deltas and available bounds in the tooltip.

## 1.3.41 补丁 / Patch — 2026-10-13

### 中文

**错误来源**：1.3.4 按完全相等的恢复时间戳判断额度窗口。实际同一窗口的时间戳会前后变化 1 秒，采样基线因此反复被清空，预测经常停留在“采样中”。重置日历为了让全年格子同时显示，把点击区域压到了 6 像素。

**修复情况**

- 对原始采样窗口使用有界的 5 秒时间戳容差，保留微小波动下的样本。真正换窗口、额度回升或原始窗口到期时仍重新采样；不允许连续漂移扩大容差。
- 周额度读数尚未变化时显示“等待周额度变化”，提示中列出两种额度的已观察增量。百分比读数可能暂时无法显示小额消耗，不把它算作零消耗。
- 格子放大到 12 像素，间距增至 3 像素，全年记录在内部横向滚动。年份和键盘选择会定位到所选格子；详情、原始记录和来源保留。

### English

**Cause**: 1.3.4 required identical recovery timestamps to recognize the same quota window. One-second variations in actual responses repeatedly cleared the sampling anchor, leaving the estimate collecting samples. Fitting a full calendar year into one view also reduced day targets to six pixels.

**Fixes**

- Preserve samples through timestamp jitter with a bounded five-second tolerance against the original anchor. Real window changes, counter decreases and an expired anchor still restart sampling; successive shifts cannot extend the tolerance.
- Show “Awaiting weekly data” while the weekly percentage remains unchanged, with observed consumption deltas in the tooltip. Rounded percentages may hide small changes temporarily; no zero-consumption ratio is invented.
- Increase day cells to 12 pixels with three-pixel gaps and internal horizontal scrolling. Year and keyboard selection keep the selected cell visible. Details, original records and sources remain available.

## 1.3.4 — 2026-10-13

### 中文

- 周额度条新增预测刻线和预计剩余比例。根据同一轮 5 小时窗口内两种额度的消耗增量，估算用尽本轮 5 小时额度后的周额度余额。采样不足、窗口切换、额度回升或周额度提前恢复时隐藏预测；提示中说明计算依据和比例假设。
- 官方重置公告、收到的可储存重置次数、消耗记录改为全年日历格子。按天聚合，颜色深浅表示次数；可切换历史年份，点击查看时间、额度类型、余额变化和公告来源。
- 保留原有历史数据和可用重置列表。日历缓存相同数据，详情按需分批显示；历史区可滚动，六条可用记录存在时关闭按钮仍可达。

### English

- Added a weekly-quota marker and estimated remaining percentage after exhausting the current 5-hour quota, based on observed consumption deltas within the same window. Insufficient samples, window changes, counter decreases and an earlier weekly renewal suppress the estimate. The tooltip explains its inputs and constant-ratio assumption.
- Replaced official announcements and received/consumed banked-reset history with yearly calendar grids. Daily color intensity represents reset counts; year selection and day details retain timestamps, credit types, balance changes and source links.
- Retained existing history and available-credit details. Unchanged calendars are cached and day details load in batches. History scrolls within the dialog, keeping the close control reachable with six available credits.

## 1.3.3 紧急补丁 / Emergency patch — 2026-10-11

### 中文

**建议 1.3.2 及更早版本用户升级。** 修复升级重启后 API 等价金额下降、任务累计耗时异常增加的问题。

**错误来源**：状态写入器能保存超过 4 MiB 的账本，启动读取器却拒绝这些文件，连同有效归档一起跳过，导致历史统计从头扫描。任务扫描器又提前使用旧会话回放的 `final_answer` 时间戳计算耗时，把回放前的数天间隔计入任务，忽略了随后提供的正确完成耗时。这些问题在 1.3.2 重启后暴露；该版本没有调整模型价格。

**修复情况**

- 状态读写统一采用 64 MiB 上限，超限写入保留原文件；有效的大账本可从不可变归档恢复。
- 恢复任务账本时识别原有数据代次，排除状态丢失后错误重扫产生的累计值，同时保留重置和客户端更新历史。
- 优先使用明确的完成耗时。缺少完成耗时的回放记录标记为耗时未知，不再把回放时间算成工作时间。
- 逐份合并归档，缓存校验结果并限制每次额外校验数量，避免把全部大账本同时载入内存或在每次写入时重复解析。

恢复保留已经扫描的旧会话数值，增量读取后续追加记录。完整会话重扫仍由用户手动启动。恢复范围取决于本机保留的有效账本及归档，缺失的历史不能凭空补齐。

### English

**Recommended for users of 1.3.2 and earlier.** Fixed API-equivalent cost falling after an upgrade restart and cumulative task duration increasing unexpectedly.

**Cause**: The writer could save ledgers above 4 MiB, but the startup reader rejected both those files and their valid archives, restarting historical scans. The task scanner also used a replayed `final_answer` timestamp before reading the explicit completion duration, counting days between original execution and replay as work. These defects surfaced after the 1.3.2 restart; that release did not change model prices.

**Fixes**

- Apply the same 64 MiB bound to state reads and writes. Oversized writes preserve the previous file, and valid large ledgers can be recovered from immutable archives.
- Recover task records from the intact ledger generation, excluding totals produced by the erroneous reset scan while retaining reset and client-update history.
- Prefer explicit completion durations. Replayed records without reliable duration evidence remain untimed.
- Merge archives individually, cache validation results and bound additional retention checks to avoid loading every large ledger simultaneously or repeatedly parsing them on each write.

Previously indexed sessions retain their recorded numbers. Subsequent appends are read incrementally; a complete rescan remains a manual action. Recovery depends on valid local ledgers and retained archives; missing history cannot be reconstructed without evidence.

## 1.3.2 补丁 / Patch — 2026-10-11

### 中文

修复“官方重置”停留在旧公告的问题，建议 1.3.1 及更早版本升级。

**错误来源**：检查站的实时公告使用 `confirmed: true`，同时保留 `confidence: medium` 和待核验标记。旧解析器只接受高置信度归档或另一种验证标记，误过滤了已经明确确认的新公告。手动刷新还会命中一分钟缓存；公告显示与额度、消费读取绑定，也可能被慢请求延后。

**修复情况**

- 兼容实时公告的明确确认字段，继续排除未确认记录、预告、重置卡赠送及不安全来源链接。
- 手动刷新重新校验网站数据，自动请求也向 HTTP 缓存发起校验。合并进行中的请求，增加五秒防连点保护。
- 重置公告和 24 / 48 小时概率读取完成后立即同步，不再等待额度和本地统计；旧整页快照不能覆盖较新的检查站数据。
- 保留历史公告及现有设置、统计。断网或来源失败时沿用历史记录，不恢复本机推断的重置。

来源目前通过定时检查同步，自动检查最长约一分钟，另加网站自身更新及网络延迟；不提供网站推送或逐秒刷新。

### English

Fixed the official-reset card retaining an older announcement. Recommended for 1.3.1 and earlier users.

**Cause**: Live checkpoint records use `confirmed: true` while retaining `confidence: medium` and a pending verification flag. The old parser required high-confidence archive records or a different verification flag, discarding explicit new confirmations. Manual refresh also reused a one-minute cache, and slow quota or cost reads could delay announcement display.

**Fixes**

- Accept explicit live confirmations while excluding unconfirmed records, previews, banked grants and unsafe source links.
- Revalidate website data on manual refresh and ask HTTP caches to revalidate automatic requests. Coalesce in-flight reads and apply a five-second manual request guard.
- Publish reset announcements and 24/48-hour odds as soon as their read completes. Quota and local statistics no longer delay them, and older full snapshots cannot overwrite newer checkpoint observations.
- Retain announcement history, settings and recorded statistics through source failures. Retired local reset inference stays excluded.

Sources are checked periodically, with up to roughly one minute between automatic checks plus source and network delay. This is not website push delivery or per-second polling.

## 1.3.1 紧急补丁 / Emergency patch — 2026-10-10

### 中文

**建议 1.3.0 用户升级。** 此补丁修复任务漏报和实时看板停住的问题，保留现有统计、背景和设置。

**错误来源**

1. 任务读取器直接把旧 `/goal` 的非活动状态用于当前回合。目标因暂停、阻塞或达到限额而停止后，新手动回合及仍在运行的子智能体也可能被排除，导致任务列表和运行计数显示为 0。
2. 看板把运行中和已完成回合混在一起按开始时间选取；渲染器又拒绝更早开始的回合。因此，一个较晚开始、已经完成的子任务会挡住仍在运行的主任务，使 Token 和速率看起来没有更新。
3. 日志缓存复用时只推进任务耗时，没有更新平均速率，导致等待期间平均值停留在旧读数。

**修复情况**

- 修复旧 `/goal` 的暂停、阻塞或限额状态隐藏新回合及运行中的子智能体的问题。目标状态与最新任务证据按时间比较。
- 最近任务看板优先显示运行中的回合；已完成的子任务不再挡住较早开始的主任务，新增 Token 计数在结束前更新。
- 右上角新增并发数，统计本机所有运行中的主任务和子智能体；提示中单列子智能体数量。不完整读取标为下限，读取失败显示不可用。
- 修复复用日志缓存时平均速率停住的问题。平均速率包含运行期间的等待时间；不会估算尚未写入日志的生成中 Tokens。

### English

**Recommended for 1.3.0 users.** This emergency patch restores live task detection and dashboard updates while retaining existing records, backgrounds and settings.

**Causes**

1. The reader applied a persisted inactive goal state to the current turn. After a goal was paused, blocked or limited, a new manual turn or a running subagent could be excluded, leaving the task list and running count at zero.
2. The dashboard selected from running and completed turns by start time, and the renderer rejected earlier-started turns. A later-started completed child could hide its still-running parent and leave the displayed counters unchanged.
3. Cached log windows advanced elapsed time without updating the whole-turn average rate, leaving that value unchanged during waits.

**Fixes**

- Fixed older paused, blocked or limited goals hiding new turns and running subagents. Goal transitions are compared with the latest task evidence.
- Prioritized running turns on the task dashboard. Completed children no longer hide an earlier-started live parent, and appended token counters update before completion.
- Added an upper-right count of all locally observed running tasks, with a separate subagent count in the tooltip. Partial counts are lower bounds; failed reads remain unavailable.
- Kept whole-turn average rates advancing when log counters are cached, including wait time. Unlogged in-flight tokens are not estimated.

## 1.3.0 — 2026-10-10

首个 1.3 正式版本，整合今天的界面、任务、用量和更新功能改动。

### 中文

**界面与交互**

- 三种额度融合为统一面板，与最近任务看板左右排列；额度面板占更大比例。
- 重置次数、可用重置卡及公开重置记录合并到重置管理入口，24 / 48 小时概率单独显示。
- 最近任务增加首字响应、总 Tokens、峰值 / 最低 / 平均输出速率和缓存命中率，任务执行期间同步更新。
- 任务详情采用数据管理布局，支持筛选、时间 / 时长 / 金额排序和一键确认已完成任务。
- 重新检查中英文文案，移除装饰性中点分隔，长项目名、模型名和累计时长支持换行或有明确滚动区域。
- 为卡片及按钮补充悬停、按下和键盘焦点反馈；金额、目标状态和异常状态使用不同颜色与字重。
- 调整重置列表容量，保证六条当前重置记录完整显示。
- 修复新增指标和英文换行撑高看板后，重置卡片遮挡 GPT Reserve 额度条的问题。

**额度、重置与计价**

- 接入 Codex Reset 和 Codex Reset Tracker 的公开检查站。恢复联网后可以补充公告记录，移除本机推断的非自然重置历史。
- 概率显示来源、更新时间及样本范围；优先采用检查站估计，历史估计作为注明限制的回退。过期或样本不足时显示数据不足。
- 修复 GPT Reserve 在普通额度接口未返回时无法读取的问题，支持独立官方 usage 桶及 SSE 返回格式；不从 Codex 主额度推算 Reserve。
- 增加 GPT-6.1 Sol 标准 API 等价计价，包含缓存输入和长上下文规则。未知或缺失历史定价仍明确标注。
- 修复新增定价后旧模型账本被丢弃的问题，恢复兼容历史记录，避免大会话被整文件大小限制跳过。
- 归档会话继续计入已记录总量。已扫描旧会话保留记录，新会话支持增量读取；用户可在 API 消费详情手动启动全量扫描。
- 全量重算保留旧值直到替代记录完成，进度持续显示；旧备份不能覆盖已经完成的重新核对。

**任务与实时同步**

- 识别 `/goal` 大目标、子智能体及多个模型参与的回合，分别显示目标累计 Tokens / 耗时和本轮各模型输入、缓存输入、输出及消费。
- 修复正常完成误报异常结束，支持现代完成事件及最终回答；短暂漏读需要后续证据确认。
- 目标内小任务及子智能体的受控停止不会判为异常终止，手动中断和真实异常仍单独显示。
- 移除固定一秒刷新，以本地文件事件和服务状态变化触发同步，合并密集事件并保留低频恢复检查。
- 历史处理移至后台工作线程，采用分批读取、缓存、资源上限和自适应间隔，减少对设备的持续负担。
- 避免只读 SQLite 共享内存变化触发自身重复刷新，修复 Windows 日志修改时间滞后带来的错误任务状态。

**更新与发布**

- 自动从固定 GitHub 仓库检查并下载监测台更新；正式版本排除测试版本，禁止降级。
- 安装版接入 Electron 更新器；便携版校验 GitHub SHA-256、下载大小及安装前摘要，再以隐藏助手替换并重启，保留旧程序用于回退。
- 下载就绪后等待已观测任务空闲，也可手动重启更新。监测台重启不会停止 Codex 或它的任务。
- 发布 Windows x64 便携版、安装版、安装增量文件、自动更新元数据及 SHA-256 校验清单。
- README 与更新日志改为中英双语，说明指标来源、适用范围和升级行为。

**升级说明**

从旧版本手动安装 1.3.0，即可启用后续自动更新。已有本地数据会保留。历史记录缺少定价信息时会显示待重算，可按需使用“全量扫描全部会话”。模型明细仍是本地覆盖范围内的估计，官方累计 Tokens 使用账户统计。

### English

**Interface and interaction**

- Combined the three quota bars in one panel beside the latest-task dashboard, with more space for quota.
- Unified reset credits and public reset history under reset management. The 24 / 48-hour estimate has its own card.
- Added live first-token latency, total tokens, peak/minimum/average output rates and cache hit rate to the latest task.
- Reorganized task details with filtering, time/duration/cost sorting and one action to confirm completed tasks.
- Revised Chinese and English copy, removed decorative middle-dot separators and added wrapping or bounded scrolling for long names and durations.
- Added hover, pressed and keyboard-focus feedback. Costs, goal status and interruptions use distinct emphasis.
- Corrected the reset-list capacity so all six current credit rows remain visible.
- Fixed the reset row covering the GPT Reserve bar when added metrics or English wrapping expanded the dashboard.

**Quota, resets and pricing**

- Added public Codex Reset and Codex Reset Tracker checkpoints, including announcement recovery after reconnecting. Removed locally inferred non-natural reset history from this display.
- Added source, freshness and sample information to probabilities. Checkpoint estimates are preferred; historical estimates are a labeled fallback. Stale or insufficient data has no displayed probability.
- Fixed GPT Reserve reads when the ordinary quota response omits it, including independent official usage buckets and SSE. Reserve is never inferred from the main quota.
- Added standard GPT-6.1 Sol API-equivalent pricing, cached-input rates and long-context rules. Missing historical prices remain explicit.
- Fixed compatible model ledgers being discarded during a pricing update and large sessions being skipped by whole-file size limits.
- Retained recorded totals from archived sessions. Indexed historical records are reused; new records support incremental reads. Added a manual full-history scan in cost details.
- Kept previous values visible during a full rebuild, exposed progress and prevented old archives from restoring superseded totals.

**Tasks and live synchronization**

- Recognized goals, subagents and multi-model turns. Goal-wide tokens/time are shown separately from current-turn model input, cached input, output and cost.
- Fixed normal completions reported as abnormal, including modern completion/final-answer events and confirmation of temporary missing reads.
- Classified managed goal-step and subagent stops separately from abnormal interruptions; manual and real abnormal outcomes remain visible.
- Replaced fixed one-second refreshes with coalesced local/service events and low-frequency recovery checks.
- Moved historical work into bounded background passes with caching, resource limits and adaptive rest time.
- Prevented read-only SQLite shared-memory changes from triggering a refresh loop and corrected stale Windows file-time task decisions.

**Updates and release**

- Added automatic checks and downloads from the fixed GitHub repository. Stable builds exclude prereleases and never downgrade.
- Integrated Electron updates for installers. Portable updates verify GitHub SHA-256, size and the staged file before a hidden replacement/restart helper runs, preserving the previous executable for rollback.
- Deferred automatic installation until observed tasks are idle, with a manual restart/update action. Codex and its tasks keep running.
- Published Windows x64 portable/setup builds, setup blockmap, update metadata and a SHA-256 manifest.
- Reworked the README and changelog in both languages with metric scope and upgrade guidance.

**Upgrade notes**

Install 1.3.0 manually to enable future automatic updates. Existing local records are retained. Missing historical pricing may require the optional full-history scan. Model details remain estimates from local coverage; lifetime tokens still use official account statistics.

## Earlier releases / 历史版本

See [GitHub Releases](https://github.com/Nahida728/gpt-quota-pet-Shirotide/releases) for earlier version notes, including the 1.3.0 beta. / 早期版本及 1.3.0 测试版说明请查看 GitHub Releases。

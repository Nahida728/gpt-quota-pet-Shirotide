const i18n = {
  zh: {
    allowBackgroundUpscale: "允许放大小图",
    backgroundActual: "原始像素大小",
    backgroundScaleHint: "默认保留完整图片且不放大小图。勾选允许放大后，铺满或缩放才会超过原始像素。",
    pricingScope: "统计范围与计价说明",
    taskScope: "任务统计与性能口径",
    navOverview: "总览",
    navUsage: "用量与费用",
    navTasks: "任务中心",
    navQuota: "额度与重置",
    navUpdates: "客户端更新",
    mainNavigation: "主导航",
    pageSections: "页面分区",
    backOverview: "返回总览",
    overviewSubtitle: "额度、用量与正在进行的工作",
    pageSubtitle: "本机记录与已验证的服务数据",
    overviewTrend: "用量趋势",
    overviewTrendHint: "近 30 天 · 本机输入（含缓存）加输出",
    overviewModelCosts: "模型费用构成",
    overviewCostHint: "沿用老版每日校准，模型 Token 与金额使用同一口径；详见费用页。",
    viewAll: "查看全部 →",
    usageTrendTab: "用量趋势",
    usageCostTab: "模型费用",
    usagePricingTab: "模型价目表",
    taskStatistics: "累计统计",
    appearanceAndGeneral: "常规与外观",
    sourcesTitle: "实例与数据",
    sourcesHint: "自动发现默认 Codex、Codex++ 多开目录和已配置的本机会话来源。目录可读表示能够读取日志，不代表远程额度账户在线。旧索引中不能可靠归属到实例的记录保留在累计总量中。",
    sourcesUnavailable: "暂时无法读取实例目录，请稍后重试。",
    sourcesEmpty: "未发现可用的本机实例目录。",
    sourceReadable: "可读会话目录：{count} 类",
    sourceNoSessions: "目录已发现，尚无可读会话",
    sourceCount: "已发现 {count} 个实例",
    refreshSources: "重新检测实例",
    sourceScanSummary: "累计索引 {count} 份会话文件；{state}。实例列表仅表示目录发现，不代表逐实例索引已完整。",
    connectionStatusTitleKey: "连接诊断",
    diagnosticsHint: "点击连接指示灯或下方按钮查看诊断。只有成功取得远程额度才显示在线；本机任务和历史统计可以离线使用。",
    aboutTitle: "关于",
    aboutDescription: "面向 Windows 的本地 AI 用量工作台，支持多实例任务、模型计价、额度与永久历史。",
    localDataHint: "本地处理，不读取或保存对话正文。",
    workspaceFooter: "本机记录 · API 等价金额（USD）",
    alwaysOnTopSetting: "始终置顶",
    alwaysOnTopHint: "让工作台保持在其他普通窗口上方",
    closeBehaviorTitle: "关闭窗口时",
    closeBehaviorHint: "选择后台监控或退出应用",
    closeToTray: "隐藏到托盘",
    closeToQuit: "退出应用",
    backgroundFit: "图片适配",
    backgroundCover: "铺满窗口",
    backgroundContain: "完整显示",
    backgroundPositionX: "水平位置",
    backgroundPositionY: "垂直位置",
    backgroundZoom: "图片缩放",
    backgroundBlur: "图片模糊",
    backgroundVeil: "白色遮罩",
    cardOpacity: "卡片不透明度",
    reducedTransparency: "减少透明效果",
    applyAppearance: "应用外观",
    appearanceSaved: "外观已保存",
    appearanceSaveFailed: "外观保存失败，请重试",
    editBackground: "重新构图",
    cropAspect: "构图比例",
    cropCurrentWindow: "当前窗口",
    cropOriginal: "原图比例",
    useWholeBackground: "使用完整图片",
    pricingExplain: "单位为美元 / 百万 Token，采用标准文本 API 价格。输入已包含缓存，缓存读取不重复计入 Token。下表显示基础价；逐次请求的长上下文分档和长 TTL 缓存写入以模型费用明细为准。未公开的价格显示 —，不能当作免费。",
    pricingSummary: "核价日期：{date} · {count} 个模型",
    pricingSearch: "搜索模型或厂商",
    pricingModel: "模型",
    modelPricingVendorLabel: "厂商",
    pricingWrite: "短期缓存写入",
    pricingSource: "官方来源",
    pricingUnavailable: "价目表暂不可用",
    taskSearch: "搜索项目或模型",
    taskDetails: "任务详情",
    taskOutcomes: "已完成 {completed} · 手动中断 {manual} · 异常中断 {abnormal} · 目标步骤结束 {managed}",
    noMatchingTasks: "没有符合当前筛选条件的任务。",
    backgroundInvalidDimensions: "图片无法读取，或超过 16000 像素边长 / 4000 万像素限制。",
    backgroundSaving: "正在保存图片…",
    backgroundSaveFailed: "背景保存失败，原背景已保留。",
    monitorUpdateTitle: "监测台更新",
    monitorUpdateHint: "自动检查并下载，任务空闲时重启监测台。Codex 任务不受影响。",
    monitorUpdateCheck: "检查更新",
    monitorUpdateInstall: "重启并更新",
    monitorUpdateIdle: "当前版本 {version}",
    monitorUpdateChecking: "正在检查 GitHub",
    monitorUpdateDownloading: "下载 v{version}，{percent}%",
    monitorUpdateReady: "v{version} 已就绪，等待任务空闲",
    monitorUpdateError: "更新暂不可用，稍后自动重试",
    monitorUpdateDevelopment: "开发模式不安装更新",
    goalUsage: "目标累计 {tokens} Tokens，耗时 {time}",
    taskModelUsage: "输入 {input}（含缓存 {cached}），输出 {output}",
    fullCostScan: "全量扫描全部会话",
    costScanRunning: "正在重扫；剩余 {pending}/{total} 份",
    costScanRecorded: "历史记录已保留；{count} 份可手动更新",
    costScanIdle: "已扫描 {count} 份，包含归档",
    costScanFailed: "扫描暂不可用，可稍后重试",
    modelCostPricingPending: "计价依据待补全",
    latestTaskTitle: "最近任务",
    latestTaskEmpty: "等待任务",
    taskConcurrency: "并发：{count}",
    taskConcurrencyHint: "并发数：{count}，其中子智能体 {agents}。统计本机所有运行中的任务，不含已完成或已停止任务。",
    taskConcurrencyUnknown: "并发数暂不可用",
    taskFirstToken: "首字响应",
    taskTotalTokens: "总 Tokens",
    taskPeakRate: "峰值 tok/s",
    taskMinRate: "最低 tok/s",
    taskAverageRate: "平均 tok/s",
    taskCacheHitRate: "缓存命中率",
    taskRateShort: "区间输出；tok/s",
    taskTelemetryScope: "最近观测回合（运行时同步）：{task}。范围为本机最近 7 天、最多 96 份普通/归档会话，不含其他设备或未写入日志的调用。首字响应读取官方日志耗时；总 Tokens 为回合输入（含缓存）加输出。峰值/最低为相邻日志间的输出速率，平均为输出 Tokens / 整个回合耗时，含工具等待，不是逐 Token 解码速度。缓存命中率为已观测调用的缓存输入 / 输入 Tokens，多模型按输入量加权，不含输出。缺失字段显示 —；不完整扫描只显示 Tokens 下限。",
    quotaPausedShort: "官方暂停",
    reserveBucketShort: "独立额度未返回",
    resetAvailableShort: "可用次数",
    resetHubTitle: "重置管理",
    resetProbabilityTitle: "重置概率",
    checkpointUnavailable: "检查站数据不足",
    checkpointStale: "检查站数据过期",
    checkpointTrend: "社区估计值",
    checkpointTitle: "公开重置公告",
    checkpointLocal: "本机账户观测",
    checkpointLatest: "{time}",
    checkpointMethod: "社区历史中最近 {days} 天的 {count} 段全局重置间隔；中位数 {median} 天，按指数分布半衰期估算未来 24/48 小时概率。排除重置卡发放、预告及未确认记录。这是全局公告趋势，不代表你的账户必定重置，也不随等待时间增加。",
    checkpointFreshness: "来源：{source}；源检查 {time}；本机读取 {fetched}",
    checkpointWarning: "源检查超过 24 小时或不可用，隐藏概率；可能有新重置未收录。",
    checkpointAccountHint: "公告可在恢复联网后补看；只有本机额度证据才能确认账户实际重置。",
    checkpointSourceLink: "查看来源 ↗",
    checkpointSourceMethod: "实验性历史模型使用最近 {count} 个完整重置间隔，未证明优于所有基准。排除重置卡发放、预告与未确认记录；全局趋势不保证本账户重置。",
    checkpointPromise: "Tibo 已承诺重置",
    checkpointSoon: "即将重置",
    checkpointAwaiting: "等待重置确认",
    checkpointWaitingShort: "等待确认",
    checkpointNoPromise: "暂无有效承诺",
    checkpointNoTime: "时间未定",
    checkpointSignalLabel: "承诺信号概率",
    checkpointSignalHint: "概率由检查站根据 Tibo 的承诺给出，优先于历史模型。倒计时对应公告目标时间，不保证准时，也不代表已重置。",
    checkpointIdleHint: "等待明确的重置承诺。历史模型的 24/48 小时概率显示在下方；常见重置时段不会用作倒计时。",
    checkpointTarget: "公告目标：{time}",
    checkpointWindow: "公告窗口：{start} 至 {end}",
    checkpointPromiseSource: "查看承诺原文 ↗",
    checkpointBaselineTitle: "历史模型",
    checkpoint24Label: "未来 24 小时",
    checkpoint48Label: "未来 48 小时",
    checkpointRange: "来源区间 {lower}–{upper}%",
    checkpointDataTitle: "数据来源与时效",
    checkpointSampleLabel: "完整间隔",
    checkpointMedianLabel: "典型间隔",
    checkpointMeanLabel: "平均间隔",
    checkpointLongestLabel: "最长间隔",
    checkpointDays: "{value} 天",
    checkpointSignalChecked: "预测源检查：{time}",
    checkpointForecastSource: "预测来源：{source}",
    checkpointOdds: "24 小时 {p24}；48 小时 {p48}",
    reserveUnavailable: "未返回",
    reserveUnavailableDetail: "独立 Reserve 额度暂未返回",
    confirmAllTasks: "确认已完成",
    taskFilterLabel: "筛选任务",
    taskSortLabel: "任务排序",
    taskFilterAll: "全部任务",
    taskSortTime: "按时间",
    taskSortCost: "按金额",
    taskSortDuration: "按时长",
    taskKindGoal: "大目标 /goal",
    taskKindSubagent: "子智能体",
    taskKindTask: "任务",
    taskManagedStopped: "目标阶段停止",
    taskGoalActive: "大目标进行中",
    taskGoalPaused: "目标暂停",
    taskGoalBlocked: "目标受阻",
    taskGoalLimited: "目标达到限制",
    taskGoalComplete: "目标已完成",
    taskIdentity: "回合 {id}；{time}",
    taskGoalBudget: "目标 Token {used} / {budget}",
    appTitle: "Codex监测台",
    title: "Codex监测台",
    switchLanguage: "切换到英文",
    refreshNow: "立即刷新",
    quotaRegion: "额度",
    statusRegion: "状态提醒",
    checking: "正在连接 Codex…",
    connected: "Codex 已连接（{plan}）",
    openSubscription: "查看 Codex 订阅详情",
    openConnectionStatus: "查看当前连接状态",
    connectionDisconnectedLabel: "连接断开",
    connectionDisconnectedTitle: "连接断开",
    connectionDisconnectedIntro: "无法连接到 OpenAI 服务器与 Codex 客户端，请排查以下问题：",
    connectionIssueClient: "Codex 客户端未安装、未启动、已崩溃，或正在更新、重启，本地 app-server 无法工作。",
    connectionIssueAccount: "Codex 未登录、登录已过期、账户授权异常，或当前 API Key 登录无法提供订阅额度。",
    connectionIssueNetwork: "网络中断，或 DNS、代理、路由异常，无法访问 OpenAI。",
    connectionIssueVpn: "中国大陆网络未开启 VPN，或 VPN 节点不可用、不稳定。",
    connectionIssueSecurity: "防火墙、安全软件或公司网络策略阻止了 Codex 进程或连接。",
    connectionIssueServer: "OpenAI 服务临时故障、维护，或请求持续超时。",
    connectionOnlineTitle: "连接正常",
    connectionOnlineMessage: "与 OpenAI 服务器和 Codex 客户端之间的连接一切正常，快去开启你的 VibeCoding 工作吧！",
    connectionAcknowledge: "我已知晓",
    subscriptionTitle: "订阅详情",
    subscriptionPlanLabel: "当前订阅套餐",
    subscriptionAssistedDays: "订阅服务累计已协助开发 {count} 天",
    subscriptionAssistedUnavailable: "订阅服务累计协助开发天数暂不可用",
    subscriptionExpiryLabel: "订阅到期时间",
    subscriptionCountdownLabel: "距离下次续费还有：",
    subscriptionCountdownValue: "{days}天 {hours}:{minutes}:{seconds}",
    subscriptionRenewalDue: "续费时间已到，等待 Codex 更新状态",
    subscriptionTimeUnavailable: "Codex 暂未提供订阅时间",
    subscriptionExactNote: "到期时间来自本机 Codex 的订阅声明。",
    subscriptionProjectedNote: "Codex 当前仅提供上个账期时间，已按原月度周期推算；实际续费时间以订阅平台为准。",
    fiveHour: "5 小时额度",
    weekly: "1 周额度",
    weeklyForecast: "预计剩余 {value}%",
    weeklyForecastCollecting: "预测采样中",
    weeklyForecastWaitingWeekly: "等待周额度变化",
    weeklyForecastLowSample: "预测样本不足",
    weeklyForecastUncertain: "预测误差较大",
    weeklyForecastPrecisionHint: "整数读数的边界跳动会放大小样本误差。目前观察到 5 小时额度变化 {five} 个百分点、周额度变化 {week} 个百分点。至少需要 10 和 2 个百分点的变化，并且剩余比例误差范围不超过 10 个百分点，才显示预测刻线；样本会继续保留。",
    weeklyForecastRangeHint: "考虑百分比读数误差，剩余范围约 {lower}% 至 {upper}%。这不是统计置信区间，仍假设后续消耗比例不变；范围内允许剩余额度时，不显示确定的 0%。",
    weeklyForecastSamplingHint: "保留同一窗口内的采样，等待两种额度都有可见消耗增量。目前 5 小时额度变化 {five} 个百分点，周额度变化 {week} 个百分点；整数百分比读数可能延迟显示较小的消耗。",
    weeklyForecastUnavailable: "预测暂不可用",
    weeklyForecastRenews: "周额度先恢复",
    weeklyForecastHint: "若本轮 5 小时额度用尽，预计周额度剩余 {value}%。按同一窗口内已观察的消耗增量推算：5 小时消耗 {five}%，周额度消耗 {week}%。假设后续消耗比例不变；模型和使用方式变化会影响结果。",
    weeklyForecastLimit: "按当前消耗比例，周额度可能先用尽。",
    calendarPastYear: "近一年",
    calendarYear: "记录年份",
    calendarLess: "少",
    calendarMore: "多",
    calendarHint: "左右滚动，点击格子查看记录",
    calendarDay: "{date}，记录 {count} 次",
    calendarNoRecords: "当天暂无记录",
    calendarTotal: "所选范围记录 {count} 次",
    calendarLoadMore: "显示更多记录",
    reserve: "GPT Reserve",
    remaining: "剩余",
    used: "已使用 {value}%",
    restores: "{time} 恢复",
    unavailable: "暂停",
    unavailableDetail: "5 小时限额当前未由官方返回",
    noData: "暂无数据",
    resetCreditEyebrow: "RESET CREDITS",
    resetCreditTitle: "额度重置次数",
    resetCreditCardHint: "点击查看列表、收到和使用记录",
    resetAvailableCount: "{count} 次可用",
    resetCreditDetailsLabel: "查看重置次数列表、收到和使用记录",
    availableResetListTitle: "当前可用",
    receivedResetHistoryTitle: "收到记录",
    receivedResetHistoryEmpty: "尚未检测到新收到的重置次数",
    receivedResetHistoryCount: "共 {count} 条收到记录",
    receivedResetEntry: "收到 {count} 次重置额度",
    receivedResetLegacy: "旧版检测到新增重置额度",
    receivedResetAt: "检测于 {time}",
    consumedResetHistoryTitle: "使用记录",
    consumedResetHistoryEmpty: "尚未检测到使用重置次数",
    consumedResetHistoryCount: "共 {count} 条使用记录",
    consumedResetEntry: "使用 {count} 次重置额度",
    consumedResetAt: "检测于 {time}",
    consumedResetBalance: "{before} → {after} 次可用",
    resetType: "重置类型",
    expiresAt: "最近到期",
    fullReset: "完整额度重置",
    codexReset: "Codex 额度",
    unknown: "未知",
    noExpiry: "无到期时间",
    noCredits: "暂无可用次数",
    creditExpires: "{time} 到期",
    creditDetailsMissing: "另有 {count} 次明细暂未返回",
    resetListScrollable: "共 {count} 次，可滚动查看全部记录",
    newResetQuestion: "新重置次数",
    officialResetQuestion: "官方重置",
    clientUpdateQuestion: "Codex 客户端更新",
    detectedCount: "检测到新增 +{count}",
    notDetected: "本次未发现",
    resetDetected: "官方已重置所有限额",
    resetNotDetected: "未检测到",
    officialResetLatest: "最近一次：{time}",
    officialResetCardLatest: "{time}",
    officialResetNever: "暂无官方重置记录",
    officialResetHistoryTitle: "官方重置记录",
    officialResetHistoryHint: "仅展示网站收录的公开重置公告；不再记录本机推断的非自然重置。公告不代表本账户必定已重置。",
    officialResetHistoryEmpty: "尚未记录到符合条件的官方重置",
    officialResetHistoryCount: "共 {count} 次",
    officialResetNewest: "最近一次",
    officialResetDetectedAt: "检测于 {time}",
    officialResetModeAll: "双额度提前恢复",
    officialResetModeWeekly: "5 小时关闭；周额度提前恢复",
    officialResetModeNatural: "周额度提前恢复；5 小时正常到期",
    officialResetModeUnused: "周额度提前恢复；5 小时未使用",
    officialResetModeLegacy: "旧版检测记录",
    manualResetExcluded: "检测到手动重置，未计入官方记录",
    manualResetCardExcluded: "手动重置已排除",
    openOfficialResetHistory: "查看官方重置记录",
    clientUpdateDetected: "检测到新版已安装",
    clientUpdateReady: "发现可用更新",
    clientUpdateNotDetected: "未发现新更新",
    clientUpdateUnknown: "版本状态不可用",
    clientUpdateVersion: "当前 v{version}",
    clientUpdateVersionChange: "新版 v{version}",
    clientUpdateTarget: "可更新至 v{version}",
    openClientUpdateHistory: "查看客户端版本更新时间线",
    clientUpdateHistoryTitle: "版本更新时间线",
    clientUpdateHistoryHint: "记录本机观察到的 Codex 客户端升级，包含历史缺口补记。时间为检测或补记时刻，不是安装时间。",
    clientUpdateHistoryEmpty: "尚未检测到客户端版本升级",
    clientUpdateHistoryCount: "共 {count} 次版本升级",
    clientUpdateCurrentLabel: "当前版本",
    clientUpdatePendingLabel: "待安装版本",
    clientUpdateNoPending: "暂无",
    clientUpdateHistoryChange: "v{from} → v{to}",
    clientUpdateHistoryDetectedAt: "检测于 {time}",
    clientUpdateFromVersion: "从 v{version}",
    clientUpdateMonthCount: "{count} 次更新",
    tokenUsageRegion: "Token 使用概览",
    tokenUsageTitle: "Token 使用量",
    tokenUsageCachedTitle: "Token 缓存",
    lifetimeTokens: "账号累计 Token",
    localLifetimeTokens: "本机累计 Token",
    tokenLocalLive: "本机日志已同步",
    tokenLocalCached: "本机历史快照",
    tokenLocalSource: "已发现的本机实例（含第三方接入）：输入（含缓存）＋输出；{state}。官方账号累计：{account}，单独保留，不相加。",
    tokenLocalComplete: "当前日志已索引",
    tokenLocalPartial: "重建未完成，部分旧记录尚未核实",
    tokenAccountSource: "当前显示官方账号统计。本机多开及第三方调用在模型用量明细中单列，不与账号总量相加。",
    tokenAccountWithLocalSource: "当前显示官方账号统计。另已核实本机 {local} Token（{state}），包含第三方接入；待核实历史另行保留，不与账号总量相加。",
    statScopeTokenAccount: "覆盖最近一次有效 account/usage/read 返回的官方账号统计及日期桶；不从本机日志推算或累加。日均 Token 以同一官方快照中有用量的日期数为分母，不按日历天数计算。第三方接入与多开日志的本机总量是独立口径，不保证被官方统计覆盖；无有效响应时保留最近一次有效账号快照，不取历史最大值。",
    statScopeTokenLocal: "本机口径覆盖已发现实例及其普通/归档 JSONL 中完成校验的用量记录，包括第三方模型。总量为输入（缓存为子集）＋输出，不使用可能加权的 total_tokens。日均以同一批记录中有用量的日期数为分母；不包含其他设备、未发现目录、已删除且未记录的日志或未写入的调用。旧账、未完成扫描及重复关系待确认的记录另行保留，不计入。未注明日期的 {undated} Token 只计入总量；{localState}。官方账号总量 {account} 为独立口径，不与本机相加。",
    averageDailyTokens: "日均 Token",
    averageDailyCost: "日均消费（API 等价）",
    totalWorkDays: "累计工作",
    workDays: "{count} 天",
    estimatedApiCost: "API 等价金额",
    estimatedApiCostShort: "API 等价金额",
    estimatedTotalCost: "本机调用估算",
    openCostDetails: "查看模型用量与 API 成本明细",
    costEstimateHint: "沿用老版算法：按官方每日用量校准分摊 OpenAI 原生模型的本机记录，再汇总非缓存输入、缓存输入、缓存写入与输出金额；第三方模型独立累计。模型分摊为估算，不等于逐请求实测。官方缺失日期和未注明日期保留原记录；未知模型或无单价依据的部分不补猜费用。校准不覆盖原始账本，也不代表已确认这些差额全部是重复。",
    costCoverage: "{count} 个模型；定价更新 {date}",
    costCoveragePartial: "{count} 个模型；部分未计价；{date}",
    costCoverageTruncated: "历史重读尚未覆盖全部记录，保留已有账本估算",
    costCoverageUnverified: "{count} 份历史尚未重新读取；费用沿用老算法校准，原始记录保留",
    costVerifiedCoverage: "已重算 {count} 份日志；其余可恢复记录继续参与估价",
    costVerificationPending: "待核实",
    costPriceUnavailable: "未计价",
    costLegacyAlgorithm: "老版算法：OpenAI 原生模型按官方日桶校准，第三方独立累计。模型分摊为估算。",
    costTokenBasis: "费用页输入：校准前 {raw}；校准后合计 {calibrated}，其中第三方 {independent}",
    costUncoveredDates: "官方未覆盖 {count} 个本地用量日期，这些日期按原记录保留",
    costCalibrationUnavailable: "官方日桶暂不可用，当前保留本机原始估算",
    modelCostCalibratedInput: "校准输入（含缓存）",
    modelCostCalibratedOutput: "校准输出",
    modelCostCalibratedRequests: "约 {count} 次校准等效调用",
    modelCostRateUnavailable: "所需单价缺失",
    costAmountBreakdown: "当前日志重算 {verified}；历史记录估算 {historical}",
    costContextEstimated: "{count} 个模型缺少部分请求分档，估价依据与范围见模型明细",
    modelCostContextEstimate: "部分请求分档缺失：沿用有效记录金额或基础价估算；可计价部分范围 {minimum}–{maximum}",
    modelCostPartialRates: "部分调用或计价项依据不足，仅汇总可计算金额",
    modelCostHistoryPending: "历史待核实",
    modelCostUnverifiedTokens: "其中约 {tokens} Token 来自尚未重读的记录，可计价部分已纳入估算",
    costCoverageUnattributed: "另有 {count} 次调用缺少模型上下文，已排除",
    costCoverageCalibrated: "按官方日桶校准调整 {tokens} 输入 Token；模型分摊为估算",
    costCoverageUnmapped: "账号口径有 {tokens} Token 未能归属到本机模型，未据此补计费用",
    modelCostInput: "总输入（含缓存）",
    modelCostCached: "其中缓存",
    modelCostOutput: "输出",
    modelCostHitRate: "命中率",
    modelCostUnpriced: "未提供 API 定价",
    modelCostUnknown: "未识别模型",
    modelCostEmpty: "暂无可统计的本机模型用量",
    modelCostRate: "每百万 Token：输入 ${input}；缓存 ${cached}；输出 ${output}",
    modelPricingVendor: "{vendor} 标准文本价",
    modelCostWriteRates: "缓存写入 {shortTtl} ${short} / {longTtl} ${long}（每百万）",
    modelPriceThreshold: "单次输入{operator}{tokens} Token 使用高档价格",
    modelPricePeak: "按高峰标准价估算，未推断低峰与节假日折扣",
    modelPriceGlobal: "按 Global 区域价格估算",
    modelCostRequests: "{count} 次调用",
    modelCostCacheWrite: "缓存写入 {tokens}",
    modelCostLongContext: "{count} 次长上下文按官方倍率计价",
    activeTasksTitle: "Codex 任务",
    activeTaskDetailsLabel: "查看任务详情",
    activeTaskRunningCount: "{count} 个任务正在进行",
    activeTaskNone: "当前没有进行中或待确认的任务",
    activeTaskNoRunningPreview: "当前没有进行中的任务",
    activeTaskUnavailable: "任务状态暂不可用",
    activeTaskProjectFallback: "未命名项目",
    activeTaskProjectsMore: "{project} 等 {count} 个项目",
    activeTaskElapsedLabel: "已进行",
    activeTaskRunningStatus: "进行中",
    activeTaskRunningMetric: "进行中",
    activeTaskPendingMetric: "待处理",
    activeTaskLongestLabel: "最长耗时",
    activeTaskTotalCostLabel: "最高消费",
    activeTaskAverageTimeLabel: "平均时间",
    activeTaskAverageCostLabel: "平均消费",
    activeTaskTotalCountLabel: "总任务数",
    activeTaskTotalTimeLabel: "总耗时",
    activeTaskMore: "另有 {count} 项",
    activeTaskCostLabel: "API 等价",
    activeTaskTimeLabel: "花费时间",
    activeTaskModelsLabel: "模型",
    activeTaskUnpriced: "含未定价模型",
    activeTaskPartialCost: "仅统计可读取部分",
    activeTaskDetailsHint: "统计会从本机可读取的普通与归档会话恢复；已完成和中断任务会保留到确认或返回 Codex。",
    activeTaskDetailCount: "{count} 个进行中；{completed} 个待处理",
    activeTaskLongest: "历史最长 {time}；最高消费 {cost}",
    activeTaskEmptyDetail: "暂无进行中或待确认的 Codex 任务",
    activeTaskCompletedStatus: "已完成",
    activeTaskManualInterruptedStatus: "手动中断",
    activeTaskAbnormalInterruptedStatus: "异常中断",
    activeTaskRunningSection: "正在进行",
    activeTaskPendingSection: "待处理",
    taskAbnormalTitle: "任务异常中断",
    taskAbnormalMessage: "{project} 的任务未检测到正常结束或手动停止事件，已在 {time} 停止计时。请检查 Codex 客户端、网络、系统休眠或进程异常。",
    statScopeTitle: "{metric}；统计口径",
    statScopeOpen: "查看“{metric}”统计口径说明",
    statScopeTokenDailyCost: "费用页沿用老版每日校准：OpenAI 原生模型按官方日桶分摊，第三方独立累计。日均费用使用同一批展示记录中有输入或输出的日期数，不混用账号工作天数；未注明日期的记录保留在总额中，但不推造工作日。金额及模型 Token 使用同一校准口径，不代表逐请求实测或订阅账单，原始账本不被覆盖。",
    statScopeTaskRunning: "进行中任务来自近期本机会话的明确 task_started 状态。当前扫描达到安全文件或字节上限，可能还有未显示的任务；列表不会根据文件更新时间猜测任务状态。",
    statScopeTaskRunningUnavailable: "当前无法完整读取本机任务状态，因此进行中数量不可用。监测台只接受明确的 task_started 状态，不会根据文件更新时间猜测任务。",
    statScopeTaskPending: "待处理只保存本次监测台运行期间刚完成或中断、且尚未由你确认的任务。关闭监测台后不会恢复这些任务名称或条目；历史总数和结果分类仍以匿名数字永久保存。",
    statScopeTaskDuration: "共识别 {total} 个历史任务，其中 {timed} 个具有可靠时长证据。平均时间与总耗时只使用这 {timed} 个任务，缺少结束时间的旧记录会被排除，避免把日志延迟回放误算为任务耗时；最长耗时还会保留监测台曾实际观察到的更高记录。{truncated}",
    statScopeTaskCost: "消费数据仅按本机可读取普通与归档会话里的模型 Token 事件和公开标准 API 价格估算，不代表 Codex 订阅实际收费。未定价模型、已删除或无法读取的会话不会计入。{truncated}",
    statScopeTaskCount: "总任务数只统计本机普通与归档会话中可读取的明确任务生命周期事件。已删除、损坏或无权限读取的会话无法恢复，也不会通过文件更新时间猜测任务。{truncated}",
    statScopeTruncated: "本次历史扫描达到安全上限，显示值仅覆盖已读取部分。",
    statScopeNotTruncated: "本次可见历史文件均已完成扫描。",
    acknowledge: "我已知晓",
    activeTaskReturnCodex: "返回 Codex",
    activeTaskConfirm: "确认",
    tokenUnavailable: "暂无数据",
    openTokenUsage: "查看 Token 使用趋势",
    tokenPeriodGroup: "统计周期",
    tokenPeriodDay: "日",
    tokenPeriodWeek: "周",
    tokenPeriodMonth: "月",
    tokenChartLabel: "Token 使用量柱状图",
    tokenChartEmpty: "暂无 Token 历史数据",
    tokenChartTooltipValue: "{tokens} Token",
    tokenLive: "已同步账号数据",
    tokenCached: "显示最近缓存",
    tokenLatestValue: "{date}；{tokens}",
    waiting: "等待首次检测",
    checkedNow: "刚刚检测",
    checkedMinutes: "{count} 分钟前检测",
    autoRefresh: "实时同步",
    autoRefreshActive: "事件实时同步",
    reading: "读取 Codex 数据…",
    pinOn: "解锁位置",
    pinOff: "锁定位置",
    minimize: "最小化",
    hide: "隐藏到托盘"
    ,
    backgroundTitle: "工作台背景",
    backgroundHint: "上传后使用完整图片；需要裁切时点击“重新构图”。位置、模糊与透明度可预览，点击“应用外观”保存。",
    chooseBackground: "选择图片",
    clearBackground: "恢复默认",
    backgroundOpacity: "背景强度",
    backgroundTooLarge: "图片不能超过 20 MB",
    backgroundSettings: "背景设置",
    settingsTitle: "设置",
    settingsOpen: "打开设置",
    languageSetting: "界面语言",
    languageSettingHint: "切换中文或英文显示",
    close: "关闭",
    dropBackground: "拖入图片或点击选择",
    backgroundRequirement: "PNG、JPEG、WebP、GIF · 最大 20 MB · GIF 使用静态帧",
    backgroundTooSmall: "图片尺寸无效",
    unsupportedImage: "请选择 PNG、JPG、WebP 或 GIF 图片",
    cropTitle: "调整背景构图",
    cropHint: "拖动选框或用方向键移动；拖动右下角调整大小。可直接使用完整图片。",
    cropResize: "调整裁剪区域",
    cancel: "取消",
    applyCrop: "使用此区域",
    cropSaving: "正在保存…"
  },
  en: {
    allowBackgroundUpscale: "Allow enlarging small images",
    backgroundActual: "Original pixel size",
    backgroundScaleHint: "Images remain complete and are not enlarged by default. Enable enlargement to fill or zoom beyond original pixels.",
    pricingScope: "Coverage and pricing rules",
    taskScope: "Task and performance coverage",
    navOverview: "Overview",
    navUsage: "Usage & cost",
    navTasks: "Task center",
    navQuota: "Quotas & resets",
    navUpdates: "Client updates",
    mainNavigation: "Main navigation",
    pageSections: "Page sections",
    backOverview: "Back to overview",
    overviewSubtitle: "Quotas, usage and work in progress",
    pageSubtitle: "Local records and verified service data",
    overviewTrend: "Usage trend",
    overviewTrendHint: "Last 30 days · local input (including cache) plus output",
    overviewModelCosts: "Cost by model",
    overviewCostHint: "Uses legacy daily calibration; model Tokens and cost share the same basis. See cost details.",
    viewAll: "View all →",
    usageTrendTab: "Usage trend",
    usageCostTab: "Model costs",
    usagePricingTab: "Model prices",
    taskStatistics: "Lifetime statistics",
    appearanceAndGeneral: "General & appearance",
    sourcesTitle: "Instances & data",
    sourcesHint: "Discovers the default Codex home, Codex++ instances and configured local session sources. Readable directories indicate local log access, not remote account connectivity. Older records without reliable instance attribution remain in the cumulative total.",
    sourcesUnavailable: "Instance directories are temporarily unavailable. Try again later.",
    sourcesEmpty: "No local instance directories were found.",
    sourceReadable: "Readable session directory types: {count}",
    sourceNoSessions: "Directory found; no readable sessions yet",
    sourceCount: "{count} instances found",
    refreshSources: "Detect instances again",
    sourceScanSummary: "{count} session files indexed in total; {state}. Directory discovery does not establish complete per-instance indexing.",
    connectionStatusTitleKey: "Connection diagnostics",
    diagnosticsHint: "Click the connection indicator or the button below for diagnostics. Online means a successful remote quota read. Local tasks and usage history remain available offline.",
    aboutTitle: "About",
    aboutDescription: "A local Windows workspace for AI usage, concurrent instances, model pricing, quotas and permanent history.",
    localDataHint: "Processed locally. Conversation text is never read or stored.",
    workspaceFooter: "Local records · API equivalents (USD)",
    alwaysOnTopSetting: "Always on top",
    alwaysOnTopHint: "Keep this workspace above other normal windows",
    closeBehaviorTitle: "When closing the window",
    closeBehaviorHint: "Choose background monitoring or exit",
    closeToTray: "Hide to tray",
    closeToQuit: "Quit application",
    backgroundFit: "Image fit",
    backgroundCover: "Fill window",
    backgroundContain: "Show entire image",
    backgroundPositionX: "Horizontal position",
    backgroundPositionY: "Vertical position",
    backgroundZoom: "Image zoom",
    backgroundBlur: "Image blur",
    backgroundVeil: "White overlay",
    cardOpacity: "Card opacity",
    reducedTransparency: "Reduce transparency",
    applyAppearance: "Apply appearance",
    appearanceSaved: "Appearance saved",
    appearanceSaveFailed: "Could not save appearance. Try again.",
    editBackground: "Reframe image",
    cropAspect: "Frame ratio",
    cropCurrentWindow: "Current window",
    cropOriginal: "Original ratio",
    useWholeBackground: "Use entire image",
    pricingExplain: "USD per million Tokens at standard text API rates. Input already includes cache; cache reads are not additional Tokens. This table shows base rates. Per-request context tiers and long-TTL cache writes are described in model cost details. Unpublished rates show — and are not free.",
    pricingSummary: "Prices checked {date} · {count} models",
    pricingSearch: "Search model or vendor",
    pricingModel: "Model",
    modelPricingVendorLabel: "Vendor",
    pricingWrite: "Short-TTL cache write",
    pricingSource: "Official source",
    pricingUnavailable: "Price catalog unavailable",
    taskSearch: "Search project or model",
    taskDetails: "Task details",
    taskOutcomes: "Completed {completed} · Manually interrupted {manual} · Abnormally interrupted {abnormal} · Goal steps stopped {managed}",
    noMatchingTasks: "No tasks match the current filters.",
    backgroundInvalidDimensions: "Image is invalid or exceeds 16,000 pixels per side / 40 million pixels.",
    backgroundSaving: "Saving image…",
    backgroundSaveFailed: "Could not save the background. The previous image is retained.",
    monitorUpdateTitle: "Monitor updates",
    monitorUpdateHint: "Checks and downloads automatically. The monitor restarts when tasks are idle. Codex tasks keep running.",
    monitorUpdateCheck: "Check updates",
    monitorUpdateInstall: "Restart and update",
    monitorUpdateIdle: "Current version {version}",
    monitorUpdateChecking: "Checking GitHub",
    monitorUpdateDownloading: "Downloading v{version}, {percent}%",
    monitorUpdateReady: "v{version} ready. Waiting for idle tasks.",
    monitorUpdateError: "Update unavailable. Will retry later.",
    monitorUpdateDevelopment: "Development build. Updates disabled.",
    goalUsage: "Goal total: {tokens} Tokens, time {time}",
    taskModelUsage: "Input {input} (cached {cached}), output {output}",
    fullCostScan: "Rescan all sessions",
    costScanRunning: "Rescanning; {pending}/{total} remaining",
    costScanRecorded: "History retained; {count} ready for manual update",
    costScanIdle: "{count} sessions recorded, including archives",
    costScanFailed: "Scan unavailable. Please retry later.",
    modelCostPricingPending: "Pricing evidence incomplete",
    latestTaskTitle: "Latest task",
    latestTaskEmpty: "Waiting for a task",
    taskConcurrency: "Live: {count}",
    taskConcurrencyHint: "Concurrent tasks: {count}, including {agents} subagents. All locally observed running tasks; completed and stopped tasks are excluded.",
    taskConcurrencyUnknown: "Concurrent task count unavailable",
    taskFirstToken: "First token",
    taskTotalTokens: "Total tokens",
    taskPeakRate: "Peak tok/s",
    taskMinRate: "Min tok/s",
    taskAverageRate: "Avg tok/s",
    taskCacheHitRate: "Cache hits",
    taskRateShort: "Output intervals; tok/s",
    taskTelemetryScope: "Latest observed turn (live while running): {task}. Covers up to 96 local/archived sessions modified in the last 7 days, excluding other devices and unlogged calls. First-token latency comes from the official log. Total tokens = input (including cache) + output. Peak/min are output rates between log records; average = output tokens / entire turn duration, including tool waits, not per-token decoding speed. Missing fields show —; partial scans show a token lower bound.",
    quotaPausedShort: "Officially paused",
    reserveBucketShort: "Independent bucket",
    resetAvailableShort: "Available",
    resetHubTitle: "Reset management",
    resetProbabilityTitle: "Reset odds",
    checkpointUnavailable: "Insufficient source data",
    checkpointStale: "Source data is stale",
    checkpointTrend: "Community estimate",
    checkpointTitle: "Public reset announcements",
    checkpointLocal: "Local account observations",
    checkpointLatest: "{time}",
    checkpointMethod: "From {count} gaps between confirmed global resets in the last {days} days; median {median} days, modeled as an exponential half-life for 24/48-hour odds. Excludes credit grants, teasers and unconfirmed records. This is a global announcement trend, not a guarantee for your account; waiting longer does not increase it.",
    checkpointFreshness: "Source: {source}; Source check {time}; Retrieved {fetched}",
    checkpointWarning: "Source check is older than 24 hours or unavailable. Odds are hidden; newer resets may be missing.",
    checkpointAccountHint: "Announcements can be recovered after reconnecting. Account resets require local quota evidence.",
    checkpointSourceLink: "View source ↗",
    checkpointSourceMethod: "Experimental historical model using the latest {count} completed reset intervals. It has not beaten every baseline. Excludes grants, teasers and unconfirmed resets; global trends do not guarantee an account reset.",
    checkpointPromise: "Tibo reset commitment",
    checkpointSoon: "Reset soon",
    checkpointAwaiting: "Awaiting reset confirmation",
    checkpointWaitingShort: "Awaiting reset",
    checkpointNoPromise: "No active commitment",
    checkpointNoTime: "Timing unspecified",
    checkpointSignalLabel: "Commitment probability",
    checkpointSignalHint: "The checkpoint assigns this probability to Tibo's commitment, ahead of historical odds. The countdown follows the announced target; timing and completion still require confirmation.",
    checkpointIdleHint: "Waiting for an explicit reset commitment. Historical 24/48-hour odds appear below; common reset hours never supply a countdown.",
    checkpointTarget: "Announced target: {time}",
    checkpointWindow: "Announced window: {start} to {end}",
    checkpointPromiseSource: "Read the commitment ↗",
    checkpointBaselineTitle: "Historical model",
    checkpoint24Label: "Next 24 hours",
    checkpoint48Label: "By 48 hours",
    checkpointRange: "Source range {lower}–{upper}%",
    checkpointDataTitle: "Sources and freshness",
    checkpointSampleLabel: "Completed intervals",
    checkpointMedianLabel: "Typical interval",
    checkpointMeanLabel: "Mean interval",
    checkpointLongestLabel: "Longest interval",
    checkpointDays: "{value} days",
    checkpointSignalChecked: "Forecast checked: {time}",
    checkpointForecastSource: "Forecast source: {source}",
    checkpointOdds: "24 hours {p24}; 48 hours {p48}",
    reserveUnavailable: "Not returned",
    reserveUnavailableDetail: "Independent Reserve quota not returned",
    confirmAllTasks: "Confirm completed",
    taskFilterLabel: "Filter tasks",
    taskSortLabel: "Sort tasks",
    taskFilterAll: "All tasks",
    taskSortTime: "By time",
    taskSortCost: "By cost",
    taskSortDuration: "By duration",
    taskKindGoal: "Goal /goal",
    taskKindSubagent: "Subagent",
    taskKindTask: "Task",
    taskManagedStopped: "Goal step stopped",
    taskGoalActive: "Goal active",
    taskGoalPaused: "Goal paused",
    taskGoalBlocked: "Goal blocked",
    taskGoalLimited: "Goal limit reached",
    taskGoalComplete: "Goal complete",
    taskIdentity: "Turn {id}; {time}",
    taskGoalBudget: "Goal tokens {used} / {budget}",
    appTitle: "Codex Quota Monitor",
    title: "Quota Monitor",
    switchLanguage: "Switch to Chinese",
    refreshNow: "Refresh now",
    quotaRegion: "Quotas",
    statusRegion: "Status alerts",
    checking: "Connecting to Codex…",
    connected: "Codex connected ({plan})",
    openSubscription: "View Codex subscription details",
    openConnectionStatus: "View current connection status",
    connectionDisconnectedLabel: "Connection lost",
    connectionDisconnectedTitle: "Connection lost",
    connectionDisconnectedIntro: "The monitor cannot connect to the OpenAI service and the Codex client. Check the following:",
    connectionIssueClient: "The Codex client is missing, stopped, crashed, updating, or restarting, so its local app-server is unavailable.",
    connectionIssueAccount: "Codex is signed out, the session or account authorization has expired, or API-key sign-in cannot provide subscription quota data.",
    connectionIssueNetwork: "The network is offline, or DNS, proxy, or routing problems are blocking OpenAI.",
    connectionIssueVpn: "In mainland China, the VPN is off or its route is unavailable or unstable.",
    connectionIssueSecurity: "A firewall, security tool, or company network policy is blocking Codex or its connection.",
    connectionIssueServer: "OpenAI is temporarily unavailable or under maintenance, or requests keep timing out.",
    connectionOnlineTitle: "Connection normal",
    connectionOnlineMessage: "The connection to the OpenAI service and Codex client is working normally. Time to get back to your VibeCoding work!",
    connectionAcknowledge: "Got it",
    subscriptionTitle: "Subscription details",
    subscriptionPlanLabel: "Current plan",
    subscriptionAssistedDays: "Your subscription has assisted development on {count} days",
    subscriptionAssistedUnavailable: "Assisted development days are unavailable",
    subscriptionExpiryLabel: "Subscription expiry",
    subscriptionCountdownLabel: "Time until next renewal:",
    subscriptionCountdownValue: "{days}d {hours}:{minutes}:{seconds}",
    subscriptionRenewalDue: "Renewal is due; waiting for Codex to update",
    subscriptionTimeUnavailable: "Codex has not provided subscription timing",
    subscriptionExactNote: "The expiry time comes from the local Codex subscription claim.",
    subscriptionProjectedNote: "Codex currently exposes the previous billing period, so this is projected using its monthly cycle. Check your subscription platform for the final renewal time.",
    fiveHour: "5-hour quota",
    weekly: "Weekly quota",
    weeklyForecast: "Est. left {value}%",
    weeklyForecastCollecting: "Collecting samples",
    weeklyForecastWaitingWeekly: "Awaiting weekly data",
    weeklyForecastLowSample: "Too few samples",
    weeklyForecastUncertain: "Wide estimate range",
    weeklyForecastPrecisionHint: "Rounded percentage boundaries magnify small-sample errors. Observed changes: {five} percentage points of 5-hour quota and {week} of weekly quota. The marker needs at least 10 and 2 points respectively, and a remaining-quota range no wider than 10 points. Samples are retained.",
    weeklyForecastRangeHint: "Allowing for percentage resolution, remaining quota is roughly {lower}% to {upper}%. These are resolution bounds, not statistical confidence limits, and assume the consumption ratio continues. A definite 0% is hidden when the bounds still allow remaining quota.",
    weeklyForecastSamplingHint: "Samples are retained within the same window until both quotas show consumption changes. Observed changes: {five} percentage points of 5-hour quota and {week} of weekly quota. Rounded percentages can delay visibility of small changes.",
    weeklyForecastUnavailable: "Estimate unavailable",
    weeklyForecastRenews: "Weekly renews first",
    weeklyForecastHint: "If this 5-hour quota is exhausted, estimated weekly quota remaining: {value}%. Observed consumption in the same window: {five}% of the 5-hour quota and {week}% of the weekly quota. Assumes the same consumption ratio continues; changes in models and usage can affect the result.",
    weeklyForecastLimit: "At the current ratio, the weekly quota may run out first.",
    calendarPastYear: "Past year",
    calendarYear: "Record year",
    calendarLess: "Less",
    calendarMore: "More",
    calendarHint: "Scroll sideways; select a day for details",
    calendarDay: "{date}; recorded resets: {count}",
    calendarNoRecords: "No records for this day",
    calendarTotal: "{count} resets recorded in this range",
    calendarLoadMore: "Show more records",
    reserve: "GPT Reserve",
    remaining: "Remaining",
    used: "{value}% used",
    restores: "Resets {time}",
    unavailable: "Paused",
    unavailableDetail: "The official 5-hour limit is not currently returned",
    noData: "No data",
    resetCreditEyebrow: "RESET CREDITS",
    resetCreditTitle: "Available resets",
    resetCreditCardHint: "View available, received, and used resets",
    resetAvailableCount: "{count} available",
    resetCreditDetailsLabel: "View available, received, and used reset credits",
    availableResetListTitle: "Available now",
    receivedResetHistoryTitle: "Received history",
    receivedResetHistoryEmpty: "No newly received reset credits have been detected",
    receivedResetHistoryCount: "{count} received events",
    receivedResetEntry: "Reset credits received: {count}",
    receivedResetLegacy: "New reset credits detected by an earlier version",
    receivedResetAt: "Detected {time}",
    consumedResetHistoryTitle: "Usage history",
    consumedResetHistoryEmpty: "No reset-credit usage has been detected",
    consumedResetHistoryCount: "{count} usage events",
    consumedResetEntry: "Reset credits used: {count}",
    consumedResetAt: "Detected {time}",
    consumedResetBalance: "{before} → {after} available",
    resetType: "Reset type",
    expiresAt: "Nearest expiry",
    fullReset: "Full reset",
    codexReset: "Codex limits",
    unknown: "Unknown",
    noExpiry: "No expiry",
    noCredits: "No available resets",
    creditExpires: "Expires {time}",
    creditDetailsMissing: "{count} more reset details are unavailable",
    resetListScrollable: "{count} total; scroll to view every reset",
    newResetQuestion: "New reset credit",
    officialResetQuestion: "Official reset",
    clientUpdateQuestion: "Codex client update",
    detectedCount: "New reset +{count}",
    notDetected: "None detected",
    resetDetected: "Official full reset detected",
    resetNotDetected: "Not detected",
    officialResetLatest: "Latest: {time}",
    officialResetCardLatest: "{time}",
    officialResetNever: "No official reset recorded",
    officialResetHistoryTitle: "Official reset history",
    officialResetHistoryHint: "Only website-sourced public announcements are shown. Local inferred resets are retired. An announcement does not prove an account reset.",
    officialResetHistoryEmpty: "No qualifying official reset has been recorded",
    officialResetHistoryCount: "{count} total",
    officialResetNewest: "Latest",
    officialResetDetectedAt: "Detected {time}",
    officialResetModeAll: "Both limits restored early",
    officialResetModeWeekly: "5-hour paused; Weekly restored early",
    officialResetModeNatural: "Weekly restored early; 5-hour naturally due",
    officialResetModeUnused: "Weekly restored early; 5-hour unused",
    officialResetModeLegacy: "Legacy detection record",
    manualResetExcluded: "Manual reset detected; excluded from official history",
    manualResetCardExcluded: "Manual reset excluded",
    openOfficialResetHistory: "View official reset history",
    clientUpdateDetected: "New version installed",
    clientUpdateReady: "Update available",
    clientUpdateNotDetected: "No pending update",
    clientUpdateUnknown: "Version unavailable",
    clientUpdateVersion: "v{version}",
    clientUpdateVersionChange: "Now v{version}",
    clientUpdateTarget: "Update to v{version}",
    openClientUpdateHistory: "View Codex client update timeline",
    clientUpdateHistoryTitle: "Version update timeline",
    clientUpdateHistoryHint: "Observed Codex client upgrades, including repaired history gaps. Times mark detection or recovery, not installation.",
    clientUpdateHistoryEmpty: "No client version upgrade has been detected",
    clientUpdateHistoryCount: "{count} version upgrades",
    clientUpdateCurrentLabel: "Current version",
    clientUpdatePendingLabel: "Pending version",
    clientUpdateNoPending: "None",
    clientUpdateHistoryChange: "v{from} → v{to}",
    clientUpdateHistoryDetectedAt: "Detected {time}",
    clientUpdateFromVersion: "From v{version}",
    clientUpdateMonthCount: "{count} upgrades",
    tokenUsageRegion: "Token usage overview",
    tokenUsageTitle: "Token usage",
    tokenUsageCachedTitle: "Cached usage",
    lifetimeTokens: "Account lifetime tokens",
    localLifetimeTokens: "Local tokens",
    tokenLocalLive: "Local logs synced",
    tokenLocalCached: "Cached local records",
    tokenLocalSource: "Discovered local instances, including third-party providers: input (including cache) + output; {state}. Official account total: {account}, kept separately and never added.",
    tokenLocalComplete: "current logs indexed",
    tokenLocalPartial: "rebuild incomplete; some older records remain unverified",
    tokenAccountSource: "Showing official account usage. Local multi-instance and third-party calls appear separately in model details and are never added to the account total.",
    tokenAccountWithLocalSource: "Showing official account usage. Separately, {local} local Tokens are verified ({state}), including third-party providers. Unverified history is retained separately and never added to the account total.",
    statScopeTokenAccount: "Includes the official account summary and dated buckets from the latest valid account/usage/read snapshot; local logs never replace or add to this total. Daily average Tokens divide by dates with usage in that same official snapshot, not calendar days. Local multi-instance and third-party usage has a separate population that the official endpoint may not cover. When unavailable, the latest valid account snapshot is retained without taking historical maxima.",
    statScopeTokenLocal: "Local coverage includes verified usage in regular/archived JSONL logs from discovered instances, including third-party providers. Tokens = input (cache is a subset) + output; weighted total_tokens is ignored. Daily averages divide by dates with usage in this same population. Other devices, undiscovered directories, deleted unrecorded logs and unlogged calls are excluded. Older ledgers, unfinished scans and unconfirmed mirror candidates are retained separately and excluded. {undated} undated Tokens contribute only to the total; {localState}. The official account total of {account} has a separate scope and is never added to local usage.",
    averageDailyTokens: "Daily average Tokens",
    averageDailyCost: "Daily average API equivalent",
    totalWorkDays: "Total work",
    workDays: "{count} days",
    estimatedApiCost: "API-equivalent estimate",
    estimatedApiCostShort: "API cost estimate",
    estimatedTotalCost: "Local call estimate",
    openCostDetails: "View model usage and API cost details",
    costEstimateHint: "Uses the legacy algorithm: allocate native OpenAI usage against official daily buckets, then aggregate uncached input, cached input, cache writes and output costs. Third-party models remain independent. Model allocation is an estimate, not per-request measurement. Missing official dates and undated records retain their local evidence. Unknown models or missing pricing evidence do not receive invented costs. Calibration does not overwrite the raw ledger or prove every adjustment is replayed usage.",
    costCoverage: "{count} models; Pricing updated {date}",
    costCoveragePartial: "{count} models; Some unpriced; {date}",
    costCoverageTruncated: "History re-reading is incomplete; retained ledger entries remain in the estimate",
    costCoverageUnverified: "{count} historical records await re-reading; costs use legacy calibration while original evidence is retained",
    costVerifiedCoverage: "{count} logs recalculated; other recoverable records remain priceable",
    costVerificationPending: "Unverified",
    costPriceUnavailable: "Unpriced",
    costLegacyAlgorithm: "Legacy algorithm: native OpenAI models use official daily calibration; third-party usage remains independent. Model allocation is estimated.",
    costTokenBasis: "Cost-page input: {raw} before calibration; {calibrated} after calibration, including {independent} independent third-party Tokens",
    costUncoveredDates: "{count} local usage dates have no official bucket and retain their recorded usage",
    costCalibrationUnavailable: "Official daily buckets are unavailable; retaining the raw local estimate",
    modelCostCalibratedInput: "Calibrated input",
    modelCostCalibratedOutput: "Calibrated output",
    modelCostCalibratedRequests: "Approximately {count} calibrated call equivalents",
    modelCostRateUnavailable: "Used rate unavailable",
    costAmountBreakdown: "Recalculated logs {verified}; historical estimates {historical}",
    costContextEstimated: "{count} models lack some request tiers; see model details for estimate bases and ranges",
    modelCostContextEstimate: "Some request tiers are missing: using supported recorded amounts or base rates; priced-component range {minimum}–{maximum}",
    modelCostPartialRates: "Some calls or components lack pricing evidence; includes only calculable amounts",
    modelCostHistoryPending: "Unverified history",
    modelCostUnverifiedTokens: "Approximately {tokens} Tokens come from records not yet re-read; priceable portions are included as estimates",
    costCoverageUnattributed: "{count} calls had no direct model context and were excluded",
    costCoverageCalibrated: "Adjusted {tokens} input Tokens against official daily buckets; model allocation is estimated",
    costCoverageUnmapped: "{tokens} account Tokens cannot be attributed to local models; no cost is invented for the difference",
    modelCostInput: "Total input (incl. cached)",
    modelCostCached: "Cached portion",
    modelCostOutput: "Output",
    modelCostHitRate: "Cache hit",
    modelCostUnpriced: "No API price",
    modelCostUnknown: "Unidentified model",
    modelCostEmpty: "No local model usage is available",
    modelCostRate: "Per 1M Tokens: input ${input}; cached ${cached}; output ${output}",
    modelPricingVendor: "{vendor} standard text rates",
    modelCostWriteRates: "Cache writes {shortTtl} ${short} / {longTtl} ${long} per 1M",
    modelPriceThreshold: "Higher rates when request input {operator}{tokens} Tokens",
    modelPricePeak: "Peak list-rate equivalent; off-peak and holiday discounts are excluded",
    modelPriceGlobal: "Global-region equivalent rates",
    modelCostRequests: "{count} calls",
    modelCostCacheWrite: "Cache writes {tokens}",
    modelCostLongContext: "{count} long-context calls use official multipliers",
    activeTasksTitle: "Codex tasks",
    activeTaskDetailsLabel: "View task details",
    activeTaskRunningCount: "{count} tasks running",
    activeTaskNone: "No active or unconfirmed tasks",
    activeTaskNoRunningPreview: "No tasks are currently running",
    activeTaskUnavailable: "Task status unavailable",
    activeTaskProjectFallback: "Unnamed project",
    activeTaskProjectsMore: "{project} + {count} more",
    activeTaskElapsedLabel: "Elapsed",
    activeTaskRunningStatus: "Running",
    activeTaskRunningMetric: "Running",
    activeTaskPendingMetric: "Pending",
    activeTaskLongestLabel: "Longest",
    activeTaskTotalCostLabel: "Highest cost",
    activeTaskAverageTimeLabel: "Average time",
    activeTaskAverageCostLabel: "Average cost",
    activeTaskTotalCountLabel: "Total tasks",
    activeTaskTotalTimeLabel: "Total time",
    activeTaskMore: "{count} more",
    activeTaskCostLabel: "This turn cost",
    activeTaskTimeLabel: "This turn time",
    activeTaskModelsLabel: "Models",
    activeTaskUnpriced: "Includes unpriced models",
    activeTaskPartialCost: "Only the readable portion is counted",
    activeTaskDetailsHint: "Statistics are recovered from readable local and archived sessions. Completed and interrupted tasks stay until confirmed or returned to Codex.",
    activeTaskDetailCount: "{count} running; {completed} to review",
    activeTaskLongest: "Longest ever {time}; Highest cost {cost}",
    activeTaskEmptyDetail: "No active or unconfirmed Codex tasks",
    activeTaskCompletedStatus: "Completed",
    activeTaskManualInterruptedStatus: "Manually interrupted",
    activeTaskAbnormalInterruptedStatus: "Abnormally interrupted",
    activeTaskRunningSection: "Running",
    activeTaskPendingSection: "Pending",
    taskAbnormalTitle: "Task interrupted unexpectedly",
    taskAbnormalMessage: "{project} ended without a normal completion or manual stop event. Timing stopped at {time}. Check the Codex client, network, system sleep, or an unexpected process exit.",
    statScopeTitle: "{metric}; Coverage",
    statScopeOpen: "View the coverage notes for {metric}",
    statScopeTokenDailyCost: "The cost page uses legacy daily calibration: native OpenAI models are allocated against official daily buckets, while third-party usage remains independent. Daily average cost uses dates with input or output in the same displayed population, not account work days. Undated evidence remains in the total without inventing work days. Cost and model Tokens use the same calibrated basis; neither is a per-request measurement or subscription bill, and the raw ledger is retained.",
    statScopeTaskRunning: "Running tasks require an explicit task_started state in recent readable local sessions. This scan reached a safe file or byte bound, so another task may be omitted. File modification time is never used to guess that a task is running.",
    statScopeTaskRunningUnavailable: "The local task state cannot currently be read completely, so the running count is unavailable. The monitor requires an explicit task_started state and never guesses from file modification time.",
    statScopeTaskPending: "Pending contains only newly completed or interrupted tasks from this monitor session that you have not confirmed. Project names and pending entries are not restored after the monitor exits; anonymous historical totals and outcome counts remain permanently stored.",
    statScopeTaskDuration: "{total} historical tasks were identified, and {timed} have reliable duration evidence. Average and total time use only those {timed} tasks. Older records without an end time are excluded so delayed log replay cannot inflate elapsed time. The longest record also retains a higher value directly observed by the monitor. {truncated}",
    statScopeTaskCost: "Cost statistics estimate readable model Token events from local and archived sessions using published standard API prices; they are not actual Codex subscription charges. Unpriced models and deleted or unreadable sessions are excluded. {truncated}",
    statScopeTaskCount: "Total tasks counts explicit lifecycle events in readable local and archived sessions. Deleted, corrupt, or inaccessible sessions cannot be recovered, and file modification time is not used to invent tasks. {truncated}",
    statScopeTruncated: "The current history scan reached its safety bound, so the value covers only the scanned portion.",
    statScopeNotTruncated: "All currently visible history files were scanned.",
    acknowledge: "Understood",
    activeTaskReturnCodex: "Return to Codex",
    activeTaskConfirm: "Confirm",
    tokenUnavailable: "Unavailable",
    openTokenUsage: "View token usage trend",
    tokenPeriodGroup: "Aggregation period",
    tokenPeriodDay: "Day",
    tokenPeriodWeek: "Week",
    tokenPeriodMonth: "Month",
    tokenChartLabel: "Token usage bar chart",
    tokenChartEmpty: "No token history available",
    tokenChartTooltipValue: "{tokens} Tokens",
    tokenLive: "Account data synced",
    tokenCached: "Showing recent cache",
    tokenLatestValue: "{date}; {tokens}",
    waiting: "Waiting for first check",
    checkedNow: "Checked just now",
    checkedMinutes: "Checked {count}m ago",
    autoRefresh: "Live sync",
    autoRefreshActive: "Live event sync",
    reading: "Reading Codex data…",
    pinOn: "Unlock position",
    pinOff: "Lock position",
    minimize: "Minimize",
    hide: "Hide to tray",
    backgroundTitle: "Workspace background",
    backgroundHint: "Uploads keep the entire image. Choose Reframe image to crop explicitly. Preview position, blur and opacity, then Apply appearance to save.",
    chooseBackground: "Choose image",
    clearBackground: "Use default",
    backgroundOpacity: "Background strength",
    backgroundTooLarge: "Images must be under 20 MB",
    backgroundSettings: "Background settings",
    settingsTitle: "Settings",
    settingsOpen: "Open settings",
    languageSetting: "Interface language",
    languageSettingHint: "Switch between Chinese and English",
    close: "Close",
    dropBackground: "Drop an image or click to choose",
    backgroundRequirement: "PNG, JPEG, WebP, GIF · up to 20 MB · static GIF frame",
    backgroundTooSmall: "Invalid image dimensions",
    unsupportedImage: "Choose a PNG, JPG, WebP, or GIF image",
    cropTitle: "Frame background image",
    cropHint: "Drag or use arrow keys to move the frame; resize from its lower-right corner. You can also use the entire image.",
    cropResize: "Resize crop area",
    cancel: "Cancel",
    applyCrop: "Use this area",
    cropSaving: "Saving…"
  }
};

const elements = Object.fromEntries([
  "taskSearch", "taskOutcomeTotals", "taskDetailDrawer", "taskDrawerTitle", "taskDrawerContent", "taskDrawerClose", "cropAspect", "cropRatioLabel", "useWholeBackground",
  "app", "connectionStrip", "connectionLabel", "connectionStatusButton", "statusDot",
  "connectionStatusModal", "connectionStatusTitle", "connectionStatusMessage",
  "connectionIssueList", "connectionStatusDone",
  "languageButton", "refreshButton", "pinButton", "titlebar",
  "quotaSection", "statusSection",
  "resetProbabilityButton", "resetProbability24", "resetProbability48", "resetProbabilityStatus",
  "resetProbabilityModal", "resetProbabilityClose", "resetProbabilityDone", "checkpointSummary",
  "checkpointMethod", "checkpointFreshness", "resetOfficialLink",
  "resetProbabilityBaseline", "resetProbabilityPromise", "resetProbabilitySignal", "resetProbabilityCountdown",
  "checkpointCommitment", "checkpointSignalProbability", "checkpointCountdown", "checkpointTarget", "checkpointSignalHint",
  "checkpointSignalSource", "checkpointDashboardSource", "checkpointOdds24", "checkpointOdds48",
  "checkpointRange24", "checkpointRange48", "checkpointStatistics",
  "taskFilter", "taskSort", "confirmAllTasks",
  "appVersion", "taskPerformance", "latestTaskIdentity", "latestTaskFirstToken", "latestTaskTokens",
  "latestTaskPeak", "latestTaskMin", "latestTaskAverage", "latestTaskCacheHit", "taskPerformanceScope", "taskConcurrency",
  "monitorUpdateStatus", "monitorUpdateCheck", "monitorUpdateInstall",
  "settingsButton", "settingsPopover", "settingsClose", 
  "chooseBackground", "clearBackground",
  "opacitySlider", "opacityValue", "backgroundError", "customBackground", "backgroundDropZone",
  "cropModal", "cropClose", "cropCancel", "cropApply", "cropStage", "cropImage", "cropBox",
  "cropResizeHandle", "cropSourceInfo",
  "fiveHourPanel", "fiveHourReset", "fiveHourNumber", "fiveHourProgress", "fiveHourUsed",
  "weeklyPanel", "weeklyReset", "weeklyNumber", "weeklyProgress", "weeklyUsed", "weeklyProjectionNote", "weeklyProjectionMarker",
  "reservePanel", "reserveReset", "reserveNumber", "reserveProgress", "reserveUsed",
  "resetCreditButton", "resetCreditIcon", "resetStatusCount", "resetCreditStatus",
  "resetCreditDetail", "resetCreditModal", "resetCreditClose", "resetCreditDone",
  "resetDetailCount", "resetCreditList", "receivedResetHistoryList", "consumedResetHistoryList",
  "officialResetButton", "officialResetStatus", "officialResetCheck", "officialResetHistoryModal",
  "officialResetHistoryClose", "officialResetHistoryDone", "officialResetHistoryList",
  "clientUpdateCard", "clientUpdateStatus", "clientUpdateVersion", "clientUpdateCheck", "clientUpdateIcon",
  "clientUpdateHistoryModal", "clientUpdateHistoryClose", "clientUpdateHistoryDone",
  "clientUpdateHistoryCurrent", "clientUpdateHistoryPending", "clientUpdateHistoryList",
  "subscriptionModal", "subscriptionClose", "subscriptionDone", "subscriptionPlan",
  "subscriptionAssistedDays", "subscriptionExpiry", "subscriptionCountdown", "subscriptionNote",
  "tokenOverview", "tokenOverviewTitle", "lifetimeTokenValue", "tokenLifetimeLabel", "tokenModalLifetimeLabel", "tokenSourceNote", "totalWorkDaysValue",
  "estimatedCostValue", "tokenCostHelp", "tokenSparkline",
  "tokenUsageModal", "tokenUsageClose", "tokenUsageDone", "tokenModalLifetime",
  "tokenModalDailyAverage", "tokenModalDailyCost", "tokenModalTotalWorkDays",
  "tokenPeriodSwitch", "tokenUsageFreshness", "tokenUsageChart", "tokenChartEmpty",
  "tokenChartRange", "tokenChartLatest", "tokenChartTooltip", "tokenChartTooltipDate",
  "tokenChartTooltipValue",
  "tokenCostModal", "tokenCostClose", "tokenCostDone", "tokenCostTotal",
  "tokenCostCoverage", "modelCostList", "fullCostScan", "costScanProgress",
  "activeTaskCard", "activeTaskCount", "activeTaskPending", "activeTaskElapsed",
  "activeTaskTotalCost", "activeTaskAverageTime", "activeTaskAverageCost",
  "activeTaskTotalCount", "activeTaskTotalElapsed",
  "activeTaskPreviewList", "activeTaskMoreIndicator", "activeTaskModal",
  "activeTaskClose", "activeTaskDone",
  "activeTaskDetailRunning", "activeTaskDetailPending", "activeTaskDetailLongest",
  "activeTaskDetailHighestCost", "activeTaskDetailAverageTime",
  "activeTaskDetailAverageCost", "activeTaskDetailTotalCount",
  "activeTaskDetailTotalElapsed", "activeTaskList",
  "taskInterruptionModal", "taskInterruptionTitle", "taskInterruptionMessage",
  "taskInterruptionDone",
  "statScopeModal", "statScopeTitle", "statScopeMessage", "statScopeClose",
  "statScopeDone",
  "lastChecked", "autoRefreshLabel", "loadingLayer", 
  
].map(id => [id, document.getElementById(id)]));

let language = "zh";
let alwaysOnTop = false;
let latestSnapshot = null;
let presentationFrame = null;
let lastPresentationSecond = null;
let unsubscribeSnapshot = null;
let unsubscribeTasks = null;
let unsubscribeCheckpoints = null;
let latestCheckpoints = null;
let isRefreshing = false;
let backgroundDataUrl = null;
let backgroundOpacity = 0.34;
let savedBackgroundOpacity = 0.34;
let backgroundNaturalSize = null;
let backgroundLoadedDataUrl = null;
let backgroundAppearance = { fit: "contain", x: 50, y: 50, zoom: 100, blur: 0, veil: 18, cardOpacity: 80, reducedTransparency: false, allowUpscale: false };
let savedAppearance = { ...backgroundAppearance };
let workbenchReady = false;
let selectedTaskIdentity = null;
let cropLoadSequence = 0;
let lastQuotaData = null;
const rendererUnsubscribers = [];
let chartResizeObserver = null;
let cropSource = null;
let cropInteraction = null;
let cropFrame = null;
let receivedResetHistory = [];
let consumedResetHistory = [];
let latestClientUpdate = {};
let tokenPeriod = "day";
let tokenChartSeries = [];
let tokenChartAnimationFrame = null;
let tokenChartAnimationActive = false;
let tokenChartHoverIndex = null;
let activeTasks = [];
let latestPerformanceTask = null;
let pendingTasks = [];
const dismissedPendingTaskIds = new Set();
const shownAbnormalTaskIds = new Set();
let activeAbnormalAlertTask = null;
let activeTasksAvailable = false;
let activeTasksTruncated = false;
let activeTaskObservedAt = null;
let activeStatScope = null;
let activeStatScopeSource = null;
let activeTaskRecords = {
  longestElapsedSeconds: 0,
  highestEstimatedCostUsd: 0,
  totalTaskCount: 0,
  timedTaskCount: 0,
  totalElapsedSeconds: 0,
  totalEstimatedCostUsd: 0,
  completedTaskCount: 0,
  manualInterruptedTaskCount: 0,
  abnormalInterruptedTaskCount: 0,
    managedStoppedTaskCount: 0,
  historyTruncated: false
};
let connectionState = "checking";
let automaticOfflineAlertShown = false;

const TOKEN_CHART_PADDING = Object.freeze({ left: 43, right: 13, top: 17, bottom: 28 });
const SECONDARY_DIALOG_SELECTOR = [
  ".crop-dialog",
  ".reset-dialog",
  ".history-dialog",
  ".token-dialog",
  ".cost-dialog",
  ".connection-dialog",
  ".task-dialog"
].join(",");
const SECONDARY_MODAL_ENTER_FALLBACK_MS = 460;
const SECONDARY_MODAL_EXIT_FALLBACK_MS = 320;
const secondaryModalTransitions = new WeakMap();
const secondaryModalQueue = [];

function setWorkspaceInert(inert) {
  document.querySelector(".workspace").inert = inert;
  document.querySelector(".sidebar").inert = inert;
  elements.taskDetailDrawer.inert = inert;
}

function cancelSecondaryModalTransition(modal) {
  const transition = secondaryModalTransitions.get(modal);
  if (!transition) return;
  clearTimeout(transition.timer);
  transition.dialog?.removeEventListener("animationend", transition.onAnimationEnd);
  secondaryModalTransitions.delete(modal);
}

function openSecondaryModal(modal, focusTarget) {
  if (modal.dataset.panel) {
    const [page, tab] = modal.dataset.panel.split(":");
    window.Workbench.navigate(page, tab === "all" ? "running" : tab); return;
  }
  const blocking = [...document.querySelectorAll('[aria-modal="true"]')].find(node => node !== modal && !node.hidden);
  if (blocking) {
    if (!secondaryModalQueue.some(item => item.modal === modal)) secondaryModalQueue.push({ modal, focusTarget });
    return;
  }
  if (modal === elements.connectionStatusModal) renderConnectionStatusDialog();
  setWorkspaceInert(true);
  cancelSecondaryModalTransition(modal);
  modal.inert = false;
  modal.removeAttribute("aria-hidden");
  modal.classList.remove("is-entering", "is-closing");
  modal.hidden = false;

  // Restart the entrance sequence when a close is interrupted and the same
  // dialog is immediately reopened.
  void modal.offsetWidth;
  const dialog = modal.querySelector(SECONDARY_DIALOG_SELECTOR);
  const transition = {
    dialog,
    timer: null,
    onAnimationEnd: null
  };
  const finish = () => {
    if (secondaryModalTransitions.get(modal) !== transition) return;
    clearTimeout(transition.timer);
    dialog?.removeEventListener("animationend", transition.onAnimationEnd);
    secondaryModalTransitions.delete(modal);
    modal.classList.remove("is-entering");
  };
  transition.onAnimationEnd = event => {
    if (event.target === dialog && event.animationName === "secondary-dialog-enter") {
      finish();
    }
  };
  dialog?.addEventListener("animationend", transition.onAnimationEnd);
  transition.timer = setTimeout(finish, SECONDARY_MODAL_ENTER_FALLBACK_MS);
  secondaryModalTransitions.set(modal, transition);
  modal.classList.add("is-entering");
  requestAnimationFrame(() => {
    if (!modal.hidden && !modal.classList.contains("is-closing")) {
      focusTarget?.focus({ preventScroll: true });
    }
  });
}

function closeSecondaryModal(modal, restoreFocus, { onClose, onHidden } = {}) {
  if (modal?.dataset.panel) { onClose?.(); window.Workbench.navigate("overview"); onHidden?.(); return; }
  if (!modal || modal.hidden || modal.classList.contains("is-closing")) return;

  cancelSecondaryModalTransition(modal);
  modal.classList.remove("is-entering");
  modal.classList.add("is-closing");
  modal.inert = true;
  onClose?.();

  const dialog = modal.querySelector(SECONDARY_DIALOG_SELECTOR);
  const transition = {
    dialog,
    timer: null,
    onAnimationEnd: null
  };

  const finish = () => {
    if (secondaryModalTransitions.get(modal) !== transition) return;
    clearTimeout(transition.timer);
    dialog?.removeEventListener("animationend", transition.onAnimationEnd);
    secondaryModalTransitions.delete(modal);
    modal.hidden = true;
    modal.classList.remove("is-closing");
    modal.inert = false;
    modal.removeAttribute("aria-hidden");
    onHidden?.();
    const queued = secondaryModalQueue.shift();
    if (queued) openSecondaryModal(queued.modal, queued.focusTarget);
    else {
      setWorkspaceInert(false);
      const target = restoreFocus?.isConnected && window.Workbench.visible(restoreFocus) ? restoreFocus : document.getElementById("pageTitle");
      target?.focus({ preventScroll: true });
    }
  };

  transition.onAnimationEnd = event => {
    if (event.target === dialog && event.animationName === "secondary-dialog-exit") {
      finish();
    }
  };
  dialog?.addEventListener("animationend", transition.onAnimationEnd);
  transition.timer = setTimeout(finish, SECONDARY_MODAL_EXIT_FALLBACK_MS);
  secondaryModalTransitions.set(modal, transition);
}

function t(key, values = {}) {
  let text = i18n[language][key] ?? key;
  for (const [name, value] of Object.entries(values)) {
    text = text.split(`{${name}}`).join(String(value));
  }
  return text;
}

function applyLanguage() {
  document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  document.querySelectorAll("[data-label-key]").forEach(node => node.setAttribute("aria-label", t(node.dataset.labelKey)));
  document.title = t("appTitle");
  renderMonitorUpdate();
  document.querySelectorAll("[data-i18n]").forEach(node => {
    node.textContent = t(node.dataset.i18n);
  });
  elements.languageButton.textContent = language === "zh" ? "EN" : "中";
  elements.languageButton.title = t("switchLanguage");
  elements.languageButton.setAttribute("aria-label", t("switchLanguage"));
  elements.connectionLabel.setAttribute("aria-label", t("openSubscription"));
  elements.connectionStatusButton.title = t("openConnectionStatus");
  elements.connectionStatusButton.setAttribute("aria-label", t("openConnectionStatus"));
  elements.refreshButton.title = t("refreshNow");
  elements.refreshButton.setAttribute("aria-label", t("refreshNow"));
  elements.quotaSection.setAttribute("aria-label", t("quotaRegion"));
  elements.statusSection.setAttribute("aria-label", t("statusRegion"));
  elements.resetCreditButton.setAttribute("aria-label", t("resetCreditDetailsLabel"));
  elements.clientUpdateCard.setAttribute("aria-label", t("openClientUpdateHistory"));
  elements.tokenOverview.setAttribute("aria-label", t("openTokenUsage"));
  elements.tokenCostHelp.title = t("openCostDetails");
  elements.tokenCostHelp.setAttribute("aria-label", t("openCostDetails"));
  elements.activeTaskCard.setAttribute("aria-label", t("activeTaskDetailsLabel"));
  elements.tokenPeriodSwitch.setAttribute("aria-label", t("tokenPeriodGroup"));
  elements.tokenUsageChart.setAttribute("aria-label", t("tokenChartLabel"));
  elements.pinButton.setAttribute("aria-label", t("alwaysOnTopSetting"));
  elements.settingsButton.title = t("settingsOpen");
  elements.settingsButton.setAttribute("aria-label", t("settingsOpen"));
  elements.cropClose.setAttribute("aria-label", t("close"));
  elements.cropResizeHandle.setAttribute("aria-label", t("cropResize"));
  elements.officialResetHistoryClose.setAttribute("aria-label", t("backOverview"));
  elements.clientUpdateHistoryClose.setAttribute("aria-label", t("backOverview"));
  elements.subscriptionClose.setAttribute("aria-label", t("backOverview"));
  elements.resetCreditClose.setAttribute("aria-label", t("backOverview"));
  elements.tokenUsageClose.setAttribute("aria-label", t("backOverview"));
  elements.tokenCostClose.setAttribute("aria-label", t("backOverview"));
  elements.activeTaskClose.setAttribute("aria-label", t("backOverview"));
  elements.resetProbabilityClose.setAttribute("aria-label", t("backOverview"));
  elements.taskInterruptionDone.setAttribute("aria-label", t("acknowledge"));
  elements.statScopeClose.setAttribute("aria-label", t("close"));
  elements.statScopeDone.setAttribute("aria-label", t("acknowledge"));
  document.querySelectorAll("[data-stat-scope]").forEach(button => {
    const metric = t(button.dataset.statLabelKey);
    const label = t("statScopeOpen", { metric });
    button.title = label;
    button.setAttribute("aria-label", label);
  });
  elements.officialResetButton.setAttribute("aria-label", t("openOfficialResetHistory"));
  window.Workbench.localize();
  elements.taskSearch.placeholder = t("taskSearch");
  if (latestSnapshot) render(latestSnapshot);
  if (!elements.taskInterruptionModal.hidden && activeAbnormalAlertTask) {
    renderTaskInterruptionAlert(activeAbnormalAlertTask);
  }
  if (!elements.statScopeModal.hidden && activeStatScope) {
    renderStatScopeDialog();
  }
}

function applyBackground() {
  elements.customBackground.style.backgroundImage = backgroundDataUrl ? 'url("' + backgroundDataUrl + '")' : "none";
  elements.customBackground.style.opacity = backgroundDataUrl ? String(backgroundOpacity) : "0";
  if (backgroundDataUrl && backgroundLoadedDataUrl !== backgroundDataUrl) {
    backgroundLoadedDataUrl = backgroundDataUrl; backgroundNaturalSize = null;
    const requested = backgroundDataUrl, probe = new Image();
    probe.onload = () => {
      if (backgroundDataUrl !== requested) return;
      backgroundNaturalSize = { width: probe.naturalWidth, height: probe.naturalHeight }; applyBackground();
    };
    probe.src = requested;
  }
  const size = backgroundNaturalSize && window.CropGeometry.backgroundSize(window.innerWidth, window.innerHeight,
    backgroundNaturalSize.width, backgroundNaturalSize.height, backgroundAppearance, window.devicePixelRatio);
  elements.customBackground.style.backgroundSize = size ? size.width + "px " + size.height + "px" : "auto";
  elements.customBackground.style.opacity = backgroundDataUrl && size ? String(backgroundOpacity) : "0";
  elements.customBackground.style.backgroundPosition = backgroundAppearance.x + "% " + backgroundAppearance.y + "%";
  elements.customBackground.style.transform = "none";
  elements.customBackground.style.filter = "blur(" + backgroundAppearance.blur + "px)";
  elements.app.style.setProperty("--veil", backgroundDataUrl ? backgroundAppearance.veil / 100 : 0);
  elements.app.style.setProperty("--card-opacity", backgroundAppearance.reducedTransparency ? .98 : backgroundAppearance.cardOpacity / 100);
  elements.app.classList.toggle("reduced-transparency", backgroundAppearance.reducedTransparency);
  elements.app.classList.toggle("has-custom-background", Boolean(backgroundDataUrl));
  elements.opacitySlider.value = String(Math.round(backgroundOpacity * 100));
  elements.opacityValue.textContent = Math.round(backgroundOpacity * 100) + "%";
  elements.clearBackground.disabled = !backgroundDataUrl;
  document.getElementById("editBackground").disabled = !backgroundDataUrl;
  document.getElementById("backgroundFit").value = backgroundAppearance.fit;
  document.getElementById("reducedTransparency").checked = backgroundAppearance.reducedTransparency;
  document.getElementById("allowBackgroundUpscale").checked = backgroundAppearance.allowUpscale;
  for (const [id,key] of Object.entries({ backgroundX: "x", backgroundY: "y", backgroundZoom: "zoom", backgroundBlur: "blur", backgroundVeil: "veil", cardOpacity: "cardOpacity" })) {
    document.getElementById(id).value = backgroundAppearance[key];
    document.getElementById(id + "Value").textContent = backgroundAppearance[key] + (key === "blur" ? "px" : "%");
  }
}

function closeBackgroundPopover() { window.Workbench.navigate("overview"); }
function showBackgroundError(messageKey) {
  elements.backgroundError.textContent = t(messageKey); elements.backgroundError.hidden = false;
  if (!elements.cropModal.hidden) elements.cropSourceInfo.textContent = t(messageKey);
}
function renderCropBox() {
  if (!cropSource?.crop) return;
  const { x, y, width, height } = cropSource.crop;
  Object.assign(elements.cropBox.style, { left: x + "px", top: y + "px", width: width + "px", height: height + "px" });
}
function closeCropModal() {
  cropLoadSequence++;
  closeSecondaryModal(elements.cropModal, document.getElementById("chooseBackground"), { onHidden() {
    elements.cropImage.removeAttribute("src"); cropSource = null; cropInteraction = null;
  } });
}
function cropAspectRatio() {
  const selected = elements.cropAspect.value;
  return selected === "original" ? cropSource.naturalWidth / cropSource.naturalHeight
    : selected === "window" ? window.innerWidth / window.innerHeight : Number(selected) || 1.6;
}
function layoutCropper(preserve = true) {
  if (!cropSource || elements.cropModal.hidden) return;
  const previous = preserve && cropSource.crop ? window.CropGeometry.toSourceRect(cropSource.crop, cropSource.displayedImage, cropSource.naturalWidth, cropSource.naturalHeight) : null;
  const displayed = window.CropGeometry.containedImageRect(elements.cropStage.clientWidth, elements.cropStage.clientHeight, cropSource.naturalWidth, cropSource.naturalHeight);
  if (!displayed) return;
  cropSource.displayedImage = displayed;
  cropSource.crop = previous ? {
    x: displayed.x + previous.x / cropSource.naturalWidth * displayed.width,
    y: displayed.y + previous.y / cropSource.naturalHeight * displayed.height,
    width: previous.width / cropSource.naturalWidth * displayed.width,
    height: previous.height / cropSource.naturalHeight * displayed.height
  } : window.CropGeometry.initialCrop(displayed, cropAspectRatio());
  Object.assign(elements.cropImage.style, { left: displayed.x + "px", top: displayed.y + "px", width: displayed.width + "px", height: displayed.height + "px" });
  elements.cropRatioLabel.textContent = elements.cropAspect.selectedOptions[0].textContent;
  renderCropBox();
}
async function openCropper(dataUrl, name = "") {
  elements.backgroundError.hidden = true;
  const sequence = ++cropLoadSequence;
  try {
    if (window.codexMonitor.validateBackground && !await window.codexMonitor.validateBackground(dataUrl)) {
      showBackgroundError("backgroundInvalidDimensions"); return;
    }
  } catch { showBackgroundError("unsupportedImage"); return; }
  if (sequence !== cropLoadSequence) return;
  const probe = new Image();
  probe.onload = () => {
    if (sequence !== cropLoadSequence) return;
    if (!probe.naturalWidth || !probe.naturalHeight || probe.naturalWidth * probe.naturalHeight > 40 * 1024 * 1024 || Math.max(probe.naturalWidth, probe.naturalHeight) > 16000) {
      showBackgroundError("backgroundInvalidDimensions"); return;
    }
    cropSource = { dataUrl, name, naturalWidth: probe.naturalWidth, naturalHeight: probe.naturalHeight, displayedImage: null, crop: null };
    elements.cropImage.src = dataUrl;
    elements.cropSourceInfo.textContent = (name ? name + "; " : "") + probe.naturalWidth + " × " + probe.naturalHeight;
    openSecondaryModal(elements.cropModal, elements.cropClose);
    requestAnimationFrame(() => layoutCropper(false));
  };
  probe.onerror = () => { if (sequence === cropLoadSequence) showBackgroundError("unsupportedImage"); };
  probe.src = dataUrl;
}
function readDroppedImage(file) {
  elements.backgroundError.hidden = true;
  if (!file || !/^image\/(png|jpeg|webp|gif)$/i.test(file.type || "")) { showBackgroundError("unsupportedImage"); return; }
  if (file.size > 20 * 1024 * 1024) { showBackgroundError("backgroundTooLarge"); return; }
  const reader = new FileReader(); reader.onload = () => importBackground(reader.result);
  reader.onerror = () => showBackgroundError("unsupportedImage"); reader.readAsDataURL(file);
}
async function importBackground(dataUrl) {
  elements.backgroundError.hidden = true;
  elements.chooseBackground.disabled = true;
  try {
    const result = await window.codexMonitor.saveBackground(dataUrl, null);
    if (!result?.dataUrl) { showBackgroundError("backgroundSaveFailed"); return; }
    backgroundDataUrl = result.dataUrl; applyBackground();
  } catch { showBackgroundError("backgroundSaveFailed"); }
  finally { elements.chooseBackground.disabled = false; }
}
async function saveCrop(useWhole = false) {
  if (!cropSource?.crop || elements.cropApply.disabled) return;
  const sourceRect = window.CropGeometry.toSourceRect(cropSource.crop, cropSource.displayedImage, cropSource.naturalWidth, cropSource.naturalHeight);
  const crop = useWhole ? null : { x: sourceRect.x / cropSource.naturalWidth, y: sourceRect.y / cropSource.naturalHeight, width: sourceRect.width / cropSource.naturalWidth, height: sourceRect.height / cropSource.naturalHeight };
  elements.cropApply.disabled = true; elements.useWholeBackground.disabled = true;
  elements.cropClose.disabled = true; elements.cropCancel.disabled = true;
  elements.cropApply.textContent = t("backgroundSaving");
  try {
    const result = await window.codexMonitor.saveBackground(cropSource.dataUrl, crop);
    if (!result?.dataUrl) { showBackgroundError("backgroundSaveFailed"); return; }
    backgroundDataUrl = result.dataUrl; applyBackground(); closeCropModal();
  } catch { showBackgroundError("backgroundSaveFailed"); }
  finally {
    elements.cropApply.disabled = false; elements.useWholeBackground.disabled = false;
    elements.cropClose.disabled = false; elements.cropCancel.disabled = false;
    elements.cropApply.textContent = t("applyCrop");
  }
}
function initializeCropper() {
  elements.cropAspect.addEventListener("change", () => layoutCropper(false));
  elements.cropBox.addEventListener("pointerdown", event => {
    if (!cropSource?.crop || event.button !== 0) return;
    cropInteraction = { pointerId:event.pointerId, mode:event.target === elements.cropResizeHandle ? "resize" : "move", x:event.clientX, y:event.clientY, crop:{...cropSource.crop} };
    elements.cropBox.setPointerCapture(event.pointerId); event.preventDefault();
  });
  elements.cropBox.addEventListener("pointermove", event => {
    if (!cropInteraction || event.pointerId !== cropInteraction.pointerId || cropFrame !== null) return;
    const clientX=event.clientX, clientY=event.clientY;
    cropFrame=requestAnimationFrame(() => {
      cropFrame=null; if(!cropInteraction || !cropSource)return;
      const dx=clientX-cropInteraction.x,dy=clientY-cropInteraction.y;
      cropSource.crop=cropInteraction.mode === "resize" ? window.CropGeometry.resizeCrop(cropInteraction.crop,dx,dy,cropSource.displayedImage,cropAspectRatio()) : window.CropGeometry.moveCrop(cropInteraction.crop,dx,dy,cropSource.displayedImage);
      renderCropBox();
    });
  });
  for(const eventName of ["pointerup","pointercancel"]) elements.cropBox.addEventListener(eventName,event=>{
    if(!cropInteraction || event.pointerId !== cropInteraction.pointerId)return;
    try{elements.cropBox.releasePointerCapture(event.pointerId);}catch{} cropInteraction=null;
  });
  elements.cropBox.addEventListener("keydown", event=>{
    if(!cropSource?.crop || !["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(event.key))return;
    event.preventDefault(); const step=event.shiftKey?12:3;
    const dx=event.key === "ArrowLeft"?-step:event.key === "ArrowRight"?step:0;
    const dy=event.key === "ArrowUp"?-step:event.key === "ArrowDown"?step:0;
    cropSource.crop=event.target === elements.cropResizeHandle ? window.CropGeometry.resizeCrop(cropSource.crop,dx,dy,cropSource.displayedImage,cropAspectRatio()) : window.CropGeometry.moveCrop(cropSource.crop,dx,dy,cropSource.displayedImage);
    renderCropBox();
  });
  elements.cropClose.addEventListener("click",closeCropModal); elements.cropCancel.addEventListener("click",closeCropModal);
  elements.cropApply.addEventListener("click",()=>saveCrop(false)); elements.useWholeBackground.addEventListener("click",()=>saveCrop(true));
}

function syncWorkbench() {
  if (!workbenchReady) return;
  window.Workbench.sync(latestSnapshot, { usd: formatUsd });
  const records = activeTaskRecords;
  elements.taskOutcomeTotals.textContent = t("taskOutcomes", { completed:formatTokenCount(records.completedTaskCount), manual:formatTokenCount(records.manualInterruptedTaskCount), abnormal:formatTokenCount(records.abnormalInterruptedTaskCount), managed:formatTokenCount(records.managedStoppedTaskCount) });
}

function closeTaskDrawer() {
  elements.taskDetailDrawer.hidden = true; selectedTaskIdentity = null;
}
function renderTaskDrawer() {
  if (!selectedTaskIdentity) return;
  const task = [...activeTasks,...pendingTasks].find(task=>activeTaskIdentity(task)===selectedTaskIdentity);
  if (!task) { closeTaskDrawer(); return; }
  const active=activeTasks.includes(task);
  elements.taskDrawerTitle.textContent=task.projectName || t("activeTaskProjectFallback");
  const content=elements.taskDrawerContent; content.replaceChildren();
  appendTaskContext(content,task,!active);
  const stats=document.createElement("div");stats.className="active-task-item-stats";
  appendActiveTaskStat(stats,t("activeTaskTimeLabel"),formatTaskDuration(active?getTaskElapsedSeconds(task):task.elapsedSeconds));
  stats.querySelector("strong").dataset.drawerElapsed = "true";
  appendActiveTaskStat(stats,t("activeTaskCostLabel"),formatActiveTaskCost(task));
  content.append(stats,createTaskModelRows(task));
  const note=document.createElement("p");note.className="active-task-explanation";
  note.textContent=t("activeTaskDetailsHint");content.append(note);
}

function formatDate(timestamp, includeYear = false) {
  if (!Number.isFinite(timestamp)) return t("noData");
  return new Intl.DateTimeFormat(language === "zh" ? "zh-CN" : "en-US", {
    ...(includeYear ? { year: "numeric" } : {}),
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(timestamp * 1000));
}

function formatResetTime(timestamp) {
  if (!Number.isFinite(timestamp)) return t("noData");
  const now = Date.now();
  const target = timestamp * 1000;
  const diff = Math.max(0, target - now);
  const hours = Math.floor(diff / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const relative = language === "zh"
    ? (hours >= 24 ? `${Math.floor(hours / 24)} 天 ${hours % 24} 小时后` : `${hours} 小时 ${minutes} 分后`)
    : (hours >= 24 ? `in ${Math.floor(hours / 24)}d ${hours % 24}h` : `in ${hours}h ${minutes}m`);
  return `${formatDate(timestamp)}; ${relative}`;
}

function setQuota(panel, reset, number, progress, used, quotaWindow, unavailable = false) {
  panel.classList.toggle("is-unavailable", unavailable);
  if (unavailable) {
    reset.textContent = panel === elements.fiveHourPanel ? t("quotaPausedShort") : t("noData");
    reset.title = panel === elements.fiveHourPanel ? t("unavailableDetail") : t("noData");
    if (panel === elements.reservePanel) {
      reset.textContent = t("reserveBucketShort");
      reset.title = t("reserveUnavailableDetail");
    }
    reset.setAttribute("aria-label", reset.title);
    number.innerHTML = `<span class="unavailable-pill">${t(panel === elements.reservePanel ? "reserveUnavailable" : "unavailable")}</span>`;
    panel.style.setProperty("--quota-progress", "0%");
    used.textContent = "—";
    return;
  }
  if (!quotaWindow) {
    reset.textContent = t("noData");
    reset.title = "";
    reset.setAttribute("aria-label", t("noData"));
    number.innerHTML = "<span>--</span><small>%</small>";
    panel.style.setProperty("--quota-progress", "0%");
    used.textContent = "—";
    return;
  }
  reset.textContent = formatDate(quotaWindow.resetsAt);
  reset.title = t("restores", { time: formatResetTime(quotaWindow.resetsAt) });
  reset.setAttribute("aria-label", t("restores", { time: formatDate(quotaWindow.resetsAt, true) }));
  number.innerHTML = `<span>${quotaWindow.remainingPercent}</span><small>%</small>`;
  panel.style.setProperty("--quota-progress", `${quotaWindow.remainingPercent}%`);
  used.textContent = t("used", { value: quotaWindow.usedPercent });
}

function setSignal(status, check, icon, detected, positiveText, negativeText) {
  status.textContent = detected ? positiveText : negativeText;
  check.classList.toggle("is-positive", detected);
  icon?.classList.toggle("is-positive", detected);
}

function getResetCreditTitle(credit) {
  if (credit?.resetType === "codexRateLimits") return t("fullReset");
  if (credit?.title) return credit.title;
  return t("codexReset");
}

function renderWeeklyProjection(projection) {
  const valid = connectionState === "online" && projection?.available &&
    Number.isFinite(projection.remainingPercent) && projection.remainingPercent >= 0 &&
    projection.remainingPercent <= 100 && projection.fiveResetAt > Date.now() / 1000;
  const note = elements.weeklyProjectionNote;
  elements.weeklyProjectionMarker.hidden = !valid;
  note.classList.toggle("is-estimated", Boolean(valid));
  note.textContent = valid ? t("weeklyForecast", { value: projection.remainingPercent })
    : t(projection?.reason === "low-sample" ? "weeklyForecastLowSample"
      : projection?.reason === "uncertain" ? "weeklyForecastUncertain"
      : projection?.reason === "waiting-weekly" ? "weeklyForecastWaitingWeekly"
      : projection?.reason === "weekly-renews" ? "weeklyForecastRenews"
      : projection?.reason === "collecting" ? "weeklyForecastCollecting" : "weeklyForecastUnavailable");
  note.title = valid ? [t("weeklyForecastHint", { value: projection.remainingPercent,
    five: projection.fiveHourDelta, week: projection.weeklyDelta }),
    Number.isFinite(projection.remainingLowerPercent) ? t("weeklyForecastRangeHint", {
      lower: projection.remainingLowerPercent, upper: projection.remainingUpperPercent }) : "",
    projection.weeklyLimitFirst ? t("weeklyForecastLimit") : ""].filter(Boolean).join("\n")
    : ["low-sample", "uncertain"].includes(projection?.reason)
      ? [t("weeklyForecastPrecisionHint", { five: projection.fiveHourDelta, week: projection.weeklyDelta }),
        Number.isFinite(projection.remainingLowerPercent) ? t("weeklyForecastRangeHint", {
          lower: projection.remainingLowerPercent, upper: projection.remainingUpperPercent }) : ""].filter(Boolean).join("\n")
    : ["collecting", "waiting-weekly"].includes(projection?.reason)
      ? t("weeklyForecastSamplingHint", { five: projection.fiveHourDelta ?? 0, week: projection.weeklyDelta ?? 0 }) : note.textContent;
  note.setAttribute("aria-label", note.title);
  if (valid) elements.weeklyProjectionMarker.style.left = `${projection.remainingPercent}%`;
}

const resetCalendarStates = new WeakMap();
function positionResetCalendars(root = document) {
  root.querySelectorAll(".reset-calendar-scroll").forEach(scroll => {
    if (!scroll.dataset.positioned && scroll.clientWidth > 0) {
      const selected = scroll.querySelector('.reset-calendar-cell[aria-pressed="true"]');
      if (selected) scroll.scrollLeft += selected.getBoundingClientRect().left - scroll.getBoundingClientRect().left
        - scroll.clientWidth * .75;
      else scroll.scrollLeft = scroll.scrollWidth;
      scroll.dataset.positioned = "true";
    }
  });
}

function calendarDate(key) {
  return new Intl.DateTimeFormat(language === "zh" ? "zh-CN" : "en-US", {
    year: "numeric", month: "short", day: "numeric"
  }).format(new Date(`${key}T12:00:00`));
}

function renderResetCalendar(container, events, createRow, source = null) {
  const today = window.ResetCalendar.dayKey(window.ResetCalendar.localDay(Date.now() / 1000));
  const signature = JSON.stringify([language, today, events, source?.url]);
  const state = resetCalendarStates.get(container) || { year: null, selected: null };
  if (state.signature === signature) {
    const freshness = container.querySelector(".calendar-freshness");
    if (freshness && source) freshness.textContent = source.freshness;
    return;
  }
  state.signature = signature;
  resetCalendarStates.set(container, state);
  const draw = () => {
    const calendar = window.ResetCalendar.buildCalendar(events, state.year);
    container.replaceChildren();
    if (source) {
      const link = document.createElement("button");
      link.type = "button"; link.className = "checkpoint-source";
      link.textContent = `${source.name}; ${t("checkpointSourceLink")}`;
      link.addEventListener("click", () => window.codexMonitor.openResetSource?.(source.url));
      const freshness = document.createElement("p");
      freshness.className = "calendar-freshness"; freshness.textContent = source.freshness;
      container.append(link, freshness);
    }
    const header = document.createElement("div"); header.className = "reset-calendar-header";
    const total = document.createElement("span"); total.className = "history-count";
    total.textContent = t("calendarTotal", { count: calendar.days.filter(day => !day.outside && !day.future)
      .reduce((sum, day) => sum + day.count, 0) });
    const year = document.createElement("select"); year.className = "reset-calendar-year";
    year.setAttribute("aria-label", t("calendarYear"));
    for (const value of [null, ...calendar.years]) {
      const option = document.createElement("option"); option.value = value ?? "";
      option.textContent = value === null ? t("calendarPastYear") : String(value);
      option.selected = value === state.year; year.append(option);
    }
    year.addEventListener("change", () => { state.year = year.value ? Number(year.value) : null;
      state.selected = null; draw(); });
    header.append(total, year);
    const scroll = document.createElement("div"); scroll.className = "reset-calendar-scroll";
    const chart = document.createElement("div"); chart.className = "reset-calendar-chart";
    chart.style.setProperty("--calendar-columns", calendar.columns);
    const months = document.createElement("div"); months.className = "reset-calendar-months";
    let previousMonth = "", previousColumn = -2;
    calendar.days.forEach((day, index) => {
      if (day.outside || day.future) return;
      const month = day.key.slice(0, 7), column = Math.floor(index / 7);
      if (month !== previousMonth) {
        previousMonth = month;
        // A short partial first month cannot fit a label beside the next month.
        if (column === 0 && Number(day.key.slice(-2)) > 10) return;
        if (column - previousColumn >= 2 && column < calendar.columns - 2) {
          const label = document.createElement("span");
          label.style.gridColumn = `${column + 1} / span ${Math.min(4, calendar.columns - column)}`;
          label.textContent = new Intl.DateTimeFormat(language === "zh" ? "zh-CN" : "en-US", { month: "short" })
            .format(new Date(`${day.key}T12:00:00`));
          months.append(label); previousColumn = column;
        }
      }
    });
    const grid = document.createElement("div"); grid.className = "reset-calendar-grid";
    const details = document.createElement("div"); details.className = "reset-calendar-details";
    const validDays = calendar.days.filter(day => !day.outside && !day.future);
    if (!validDays.some(day => day.key === state.selected)) {
      state.selected = validDays.filter(day => day.count).at(-1)?.key || validDays.at(-1)?.key;
    }
    const buttons = [];
    const select = day => {
      state.selected = day.key;
      buttons.forEach(button => { const chosen = button.dataset.day === day.key;
        button.setAttribute("aria-pressed", String(chosen)); button.tabIndex = chosen ? 0 : -1; });
      const chosen = buttons.find(button => button.dataset.day === day.key);
      if (scroll.clientWidth > 0 && chosen) {
        const left = chosen.getBoundingClientRect().left - scroll.getBoundingClientRect().left + scroll.scrollLeft;
        if (left < scroll.scrollLeft) scroll.scrollLeft = left;
        else if (left + chosen.offsetWidth > scroll.scrollLeft + scroll.clientWidth)
          scroll.scrollLeft = left + chosen.offsetWidth - scroll.clientWidth;
      }
      details.replaceChildren();
      const date = document.createElement("strong"); date.className = "reset-calendar-date";
      date.textContent = t("calendarDay", { date: calendarDate(day.key), count: day.count });
      details.append(date);
      if (!day.events.length) {
        const empty = document.createElement("p"); empty.className = "history-empty";
        empty.textContent = t("calendarNoRecords"); details.append(empty);
      }
      const records = day.events.slice().sort((a, b) => b.at - a.at);
      let offset = 0;
      const more = document.createElement("button"); more.type = "button";
      more.className = "checkpoint-source"; more.textContent = t("calendarLoadMore");
      const show = () => {
        records.slice(offset, offset + 30).forEach(event => details.insertBefore(createRow(event.record), more));
        offset += 30; more.hidden = offset >= records.length;
      };
      more.addEventListener("click", show); details.append(more); show();
    };
    calendar.days.forEach((day, index) => {
      const button = document.createElement("button"); button.type = "button";
      button.className = "reset-calendar-cell"; button.dataset.level = day.level;
      button.dataset.day = day.key; button.disabled = day.outside || day.future;
      button.classList.toggle("is-padding", day.outside); button.classList.toggle("is-future", day.future);
      button.title = t("calendarDay", { date: calendarDate(day.key), count: day.count });
      button.setAttribute("aria-label", button.title); button.tabIndex = -1;
      button.addEventListener("click", () => select(day));
      button.addEventListener("keydown", event => {
        const delta = { ArrowLeft: -7, ArrowRight: 7, ArrowUp: -1, ArrowDown: 1 }[event.key];
        let target = delta === undefined ? null : index + delta;
        if (event.key === "Home") target = calendar.days.findIndex(item => !item.outside && !item.future);
        if (event.key === "End") target = calendar.days.findLastIndex(item => !item.outside && !item.future);
        if (target !== null) { event.preventDefault();
          if (buttons[target] && !buttons[target].disabled) { select(calendar.days[target]); buttons[target].focus(); } }
      });
      buttons.push(button); grid.append(button);
    });
    chart.append(months, grid); scroll.append(chart);
    const legend = document.createElement("div"); legend.className = "reset-calendar-legend";
    const hint = document.createElement("span"); hint.textContent = t("calendarHint"); legend.append(hint);
    const less = document.createElement("span"); less.textContent = t("calendarLess"); legend.append(less);
    for (let level = 0; level <= 4; level++) {
      const square = document.createElement("span"); square.className = "reset-calendar-cell";
      square.dataset.level = level; square.setAttribute("aria-hidden", "true"); legend.append(square);
    }
    const more = document.createElement("span"); more.textContent = t("calendarMore"); legend.append(more);
    container.append(header, scroll, legend, details);
    const selected = calendar.days.find(day => day.key === state.selected);
    if (selected) select(selected);
    requestAnimationFrame(() => positionResetCalendars(container));
  };
  draw();
}

function createReceivedResetRow(event) {
  const row = document.createElement("article");
  row.className = "received-reset-item";

  const marker = document.createElement("span");
  marker.className = "received-reset-marker";
  marker.textContent = `+${Math.max(1, Number(event.count) || 1)}`;

  const copy = document.createElement("div");
  const title = document.createElement("strong");
  const hasDetails = Array.isArray(event.items) && event.items.length > 0;
  title.textContent = hasDetails
    ? t("receivedResetEntry", { count: Math.max(1, Number(event.count) || event.items.length) })
    : t("receivedResetLegacy");

  const detail = document.createElement("span");
  const types = hasDetails
    ? [...new Set(event.items.map(getResetCreditTitle).filter(Boolean))]
    : [];
  detail.textContent = [
    t("receivedResetAt", { time: formatDate(event.detectedAt, true) }),
    types.join("; ")
  ].filter(Boolean).join("; ");

  copy.append(title, detail);
  row.append(marker, copy);
  return row;
}

function createConsumedResetRow(event) {
  const row = document.createElement("article");
  row.className = "received-reset-item consumed-reset-item";

  const marker = document.createElement("span");
  marker.className = "received-reset-marker is-consumed";
  marker.textContent = `−${Math.max(1, Number(event.count) || 1)}`;

  const copy = document.createElement("div");
  const title = document.createElement("strong");
  title.textContent = t("consumedResetEntry", {
    count: Math.max(1, Number(event.count) || 1)
  });

  const detail = document.createElement("span");
  const types = Array.isArray(event.items)
    ? [...new Set(event.items.map(getResetCreditTitle).filter(Boolean))]
    : [];
  const balance = Number.isFinite(event.previousAvailableCount) &&
    Number.isFinite(event.availableCount)
    ? t("consumedResetBalance", {
        before: event.previousAvailableCount,
        after: event.availableCount
      })
    : "";
  detail.textContent = [
    t("consumedResetAt", { time: formatDate(event.detectedAt, true) }),
    balance,
    types.join("; ")
  ].filter(Boolean).join("; ");

  copy.append(title, detail);
  row.append(marker, copy);
  return row;
}

function renderReceivedResetHistory(history = []) {
  receivedResetHistory = Array.isArray(history) ? history.filter(item => Number.isFinite(item?.detectedAt)) : [];
  renderResetCalendar(elements.receivedResetHistoryList, receivedResetHistory.map(record => ({
    at: record.detectedAt, count: record.count, record
  })), createReceivedResetRow);
}

function renderConsumedResetHistory(history = []) {
  consumedResetHistory = Array.isArray(history) ? history.filter(item => Number.isFinite(item?.detectedAt)) : [];
  renderResetCalendar(elements.consumedResetHistoryList, consumedResetHistory.map(record => ({
    at: record.detectedAt, count: record.count, record
  })), createConsumedResetRow);
}

function renderResetCredits(resets = {}, newResetEvent = {}, manualResetEvent = {}) {
  const hasAvailableCount = Number.isFinite(resets.availableCount);
  const availableCount = hasAvailableCount ? resets.availableCount : 0;
  const items = Array.isArray(resets.items)
    ? resets.items
        .filter(Boolean)
        .slice()
        .sort((a, b) => {
          const left = Number.isFinite(a.expiresAt) ? a.expiresAt : Number.POSITIVE_INFINITY;
          const right = Number.isFinite(b.expiresAt) ? b.expiresAt : Number.POSITIVE_INFINITY;
          return left - right;
        })
    : [];
  const missingCount = Math.max(0, availableCount - items.length);
  const renderedRowCount = items.length + (missingCount ? 1 : 0);
  elements.resetStatusCount.textContent = hasAvailableCount ? availableCount : "--";
  elements.resetCreditStatus.textContent = hasAvailableCount
    ? t("resetAvailableCount", { count: formatTokenCount(availableCount) })
    : t("noData");
  elements.resetCreditDetail.textContent = newResetEvent.detected
    ? t("detectedCount", { count: newResetEvent.count })
    : t("resetCreditCardHint");
  elements.resetCreditIcon.classList.toggle("is-positive", availableCount > 0);
  elements.resetDetailCount.textContent = hasAvailableCount
    ? t("resetAvailableCount", { count: formatTokenCount(availableCount) })
    : t("noData");
  renderReceivedResetHistory(newResetEvent.history);
  renderConsumedResetHistory(manualResetEvent.history);
  elements.resetCreditList.replaceChildren();
  elements.resetCreditList.classList.toggle("is-overflowing", renderedRowCount > 6);
  elements.resetCreditList.style.setProperty(
    "--reset-visible-count",
    String(Math.max(1, Math.min(renderedRowCount, 6)))
  );

  if (renderedRowCount > 6) {
    elements.resetCreditList.tabIndex = 0;
    elements.resetCreditList.setAttribute(
      "aria-label",
      t("resetListScrollable", { count: availableCount })
    );
  } else {
    elements.resetCreditList.removeAttribute("tabindex");
    elements.resetCreditList.removeAttribute("aria-label");
  }

  if (!availableCount) {
    const empty = document.createElement("div");
    empty.className = "reset-credit-empty";
    empty.textContent = hasAvailableCount ? t("noCredits") : t("noData");
    elements.resetCreditList.append(empty);
    return;
  }

  items.forEach((credit, index) => {
    const row = document.createElement("article");
    row.className = "reset-credit-item";

    const marker = document.createElement("span");
    marker.className = "reset-credit-index";
    marker.textContent = String(index + 1).padStart(2, "0");

    const title = document.createElement("strong");
    title.textContent = getResetCreditTitle(credit);

    const expiry = document.createElement("span");
    expiry.className = "reset-credit-expiry";
    expiry.textContent = Number.isFinite(credit.expiresAt)
      ? t("creditExpires", { time: formatDate(credit.expiresAt, true) })
      : t("noExpiry");

    row.append(marker, title, expiry);
    elements.resetCreditList.append(row);
  });

  if (missingCount) {
    const missing = document.createElement("div");
    missing.className = "reset-credit-missing";
    missing.textContent = t("creditDetailsMissing", { count: missingCount });
    elements.resetCreditList.append(missing);
  }
}

function currentCheckpointCommitment(now = Date.now()) {
  const commitment = latestCheckpoints?.commitment;
  return commitment && Number.isFinite(latestCheckpoints?.forecast?.checkedAt) &&
    now - latestCheckpoints.forecast.checkedAt <= 3600000 && now - commitment.at <= 48 * 3600000
    ? commitment : null;
}

let checkpointClockSignature = "";
function renderCheckpointClock(now = Date.now()) {
  const commitment = currentCheckpointCommitment(now);
  const window = commitment?.window;
  const counting = window && now < window.targetAt;
  const clock = counting ? (() => {
    const total = Math.ceil((window.targetAt - now) / 1000);
    return [Math.floor(total / 3600), Math.floor(total % 3600 / 60), total % 60]
      .map(value => String(value).padStart(2, "0")).join(":");
  })() : t(commitment ? window ? "checkpointAwaiting" : "checkpointNoTime" : "checkpointNoPromise");
  const compactClock = counting ? clock : window ? "—" : t("checkpointNoTime");
  if (elements.resetProbabilityCountdown.textContent !== compactClock) elements.resetProbabilityCountdown.textContent = compactClock;
  if (elements.checkpointCountdown.textContent !== clock) elements.checkpointCountdown.textContent = clock;
  const signature = JSON.stringify([language, commitment, Boolean(counting), latestCheckpoints?.available, latestCheckpoints?.stale]);
  if (signature === checkpointClockSignature) return;
  checkpointClockSignature = signature;
  elements.resetProbabilityBaseline.hidden = Boolean(commitment);
  elements.resetProbabilityPromise.hidden = !commitment;
  elements.resetProbabilityButton.classList.toggle("has-commitment", Boolean(commitment));
  elements.resetProbabilityButton.classList.toggle("is-imminent", Boolean(counting));
  elements.resetProbabilitySignal.textContent = commitment ? `${commitment.probability}%` : "—";
  elements.resetProbabilityStatus.textContent = t(commitment ? counting ? "checkpointSoon" : window ? "checkpointWaitingShort" : "checkpointPromise"
    : !latestCheckpoints?.available ? "checkpointUnavailable" : latestCheckpoints.stale ? "checkpointStale" : "checkpointTrend");
  elements.checkpointCommitment.classList.toggle("has-commitment", Boolean(commitment));
  elements.checkpointSignalProbability.textContent = commitment ? `${commitment.probability}%` : "—";
  elements.checkpointSummary.textContent = t(commitment ? "checkpointPromise" : "checkpointNoPromise");
  elements.checkpointCountdown.classList.toggle("is-counting", Boolean(counting));
  elements.checkpointTarget.textContent = window ? [t("checkpointTarget", { time: formatDate(window.targetAt / 1000, true) }),
    t("checkpointWindow", { start: formatDate(window.startAt / 1000, true), end: formatDate(window.endAt / 1000, true) })].join("\n") : "";
  elements.checkpointSignalHint.textContent = t(commitment ? "checkpointSignalHint" : "checkpointIdleHint");
  elements.checkpointSignalSource.hidden = !commitment;
  elements.resetProbabilityButton.title = commitment ? `${t("checkpointPromise")} ${commitment.probability}%\n${window ? t("checkpointTarget", { time: formatDate(window.targetAt / 1000, true) }) : t("checkpointNoTime")}\n${t("checkpointSignalHint")}`
    : t("resetProbabilityTitle");
}

function renderCheckpoints(checkpoint = {}) {
  checkpoint ||= {};
  if ((latestCheckpoints?.observedAt || 0) > (checkpoint.observedAt || 0)) checkpoint = latestCheckpoints;
  else latestCheckpoints = checkpoint;
  const percent = value => Number.isFinite(value) ? `${value}%` : "—";
  elements.resetProbability24.textContent = percent(checkpoint.probability24);
  elements.resetProbability48.textContent = percent(checkpoint.probability48);
  elements.checkpointOdds24.textContent = percent(checkpoint.probability24);
  elements.checkpointOdds48.textContent = percent(checkpoint.probability48);
  for (const hours of [24, 48]) {
    const range = checkpoint.probabilityMode === "source-experimental" ? checkpoint.forecast?.[`range${hours}`] : null;
    elements[`checkpointRange${hours}`].textContent = range ? t("checkpointRange", range) : "";
  }
  elements.checkpointStatistics.replaceChildren();
  for (const [label, value] of [["checkpointSampleLabel", checkpoint.probabilityMode === "source-experimental" ? checkpoint.forecast?.sampleCount : checkpoint.sampleCount],
    ["checkpointMedianLabel", checkpoint.forecast?.medianDays ?? (Number.isFinite(checkpoint.medianSeconds) ? checkpoint.medianSeconds / 86400 : null)],
    ["checkpointMeanLabel", checkpoint.forecast?.meanDays], ["checkpointLongestLabel", checkpoint.forecast?.longestDays]]) {
    const metric = document.createElement("div"), term = document.createElement("dt"), result = document.createElement("dd");
    term.textContent = t(label);
    result.textContent = !Number.isFinite(value) ? "—" : label === "checkpointSampleLabel" ? String(value) : t("checkpointDays", { value: value.toFixed(1) });
    metric.append(term, result); elements.checkpointStatistics.append(metric);
  }
  elements.checkpointMethod.textContent = checkpoint.probabilityMode === "source-experimental" ? t("checkpointSourceMethod", { count: checkpoint.forecast.sampleCount }) : Number.isFinite(checkpoint.probability24) ? t("checkpointMethod", {
    days: checkpoint.windowDays || 183, count: checkpoint.sampleCount || 0,
    median: Number.isFinite(checkpoint.medianSeconds) ? (checkpoint.medianSeconds / 86400).toFixed(1) : "—"
  }) : t("checkpointUnavailable");
  elements.checkpointFreshness.textContent = [t("checkpointForecastSource", { source: checkpoint.forecast ? "Codex Reset"
    : checkpoint.sourceUrl === "https://codex-reset.com/" ? "Codex Reset" : "Codex Reset Tracker" }), t("checkpointFreshness", {
    source: checkpoint.sourceUrl === "https://codex-reset.com/" ? "Codex Reset" : "Codex Reset Tracker",
    time: checkpoint.sourceCheckedAt ? formatDate(checkpoint.sourceCheckedAt / 1000, true) : "—",
    fetched: checkpoint.fetchedAt ? formatDate(checkpoint.fetchedAt / 1000, true) : "—"
  }), checkpoint.forecast?.checkedAt ? t("checkpointSignalChecked", { time: formatDate(checkpoint.forecast.checkedAt / 1000, true) }) : null,
    checkpoint.stale ? t("checkpointWarning") : null, t("checkpointAccountHint")].filter(Boolean).join("\n");
  renderCheckpointClock();
  startPresentationClock();
  elements.officialResetCheck.classList.toggle("is-positive", Boolean(checkpoint.available));
  elements.officialResetStatus.textContent = checkpoint.latestAt
    ? t("checkpointLatest", { time: formatDate(checkpoint.latestAt) }) : t("checkpointUnavailable");
  renderResetCalendar(elements.officialResetHistoryList, (checkpoint.events || []).map(record => ({
    at: record.at, count: 1, record
  })), event => {
    const row = document.createElement("button");
    row.type = "button"; row.className = "checkpoint-event";
    row.textContent = `${formatDate(event.at, true)}; ${t("checkpointSourceLink")}`;
    row.addEventListener("click", () => window.codexMonitor.openResetSource?.(event.sourceUrl));
    return row;
  }, checkpoint.sourceUrl ? { url: checkpoint.sourceUrl,
    name: checkpoint.sourceUrl === "https://codex-reset.com/" ? "Codex Reset" : "Codex Reset Tracker",
    freshness: elements.checkpointFreshness.textContent } : null);
}

let clientHistorySignature = "";
function renderClientUpdateHistory(clientUpdate = latestClientUpdate) {
  latestClientUpdate = clientUpdate || {};
  const history = Array.isArray(latestClientUpdate.history)
    ? latestClientUpdate.history.filter(record =>
        /^\d+(?:\.\d+){1,5}$/.test(String(record?.fromVersion || "")) &&
        /^\d+(?:\.\d+){1,5}$/.test(String(record?.toVersion || "")) &&
        Number.isFinite(record?.detectedAt)
      )
    : [];

  elements.clientUpdateHistoryCurrent.textContent = latestClientUpdate.currentVersion
    ? `v${latestClientUpdate.currentVersion}`
    : "—";
  elements.clientUpdateHistoryPending.textContent = latestClientUpdate.pendingVersion
    ? `v${latestClientUpdate.pendingVersion}`
    : t("clientUpdateNoPending");
  const signature = JSON.stringify([language, history]);
  if (signature === clientHistorySignature) return;
  clientHistorySignature = signature;
  elements.clientUpdateHistoryList.replaceChildren();

  if (!history.length) {
    const empty = document.createElement("div");
    empty.className = "history-empty";
    empty.textContent = t("clientUpdateHistoryEmpty");
    elements.clientUpdateHistoryList.append(empty);
    return;
  }

  const count = document.createElement("div");
  count.className = "history-count";
  count.textContent = t("clientUpdateHistoryCount", {
    count: formatTokenCount(history.length)
  });
  elements.clientUpdateHistoryList.append(count);

  const groups = new Map();
  for (const record of history.slice().sort((a, b) => b.detectedAt - a.detectedAt)) {
    const date = new Date(record.detectedAt), key = `${date.getFullYear()}-${date.getMonth()}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(record);
  }
  for (const records of groups.values()) {
    const group = document.createElement("details"), heading = document.createElement("summary");
    group.className = "client-update-month";
    group.open = groups.values().next().value === records;
    const month = document.createElement("strong"), badge = document.createElement("span");
    month.textContent = new Intl.DateTimeFormat(language === "zh" ? "zh-CN" : "en-US", { year: "numeric", month: "long" }).format(records[0].detectedAt);
    badge.textContent = t("clientUpdateMonthCount", { count: records.length });
    heading.append(month, badge); group.append(heading);
    let previousDay = "";
    for (const record of records) {
      const date = new Date(record.detectedAt), day = date.toDateString();
      if (day !== previousDay) {
        const label = document.createElement("h4"); label.className = "client-update-day";
        label.textContent = new Intl.DateTimeFormat(language === "zh" ? "zh-CN" : "en-US", { month: "short", day: "numeric", weekday: "short" }).format(date);
        group.append(label); previousDay = day;
      }
      const item = document.createElement("article"), copy = document.createElement("div");
      item.className = "client-update-row";
      const version = document.createElement("strong"), from = document.createElement("span"), time = document.createElement("time");
      version.textContent = `v${record.toVersion}`;
      from.textContent = t("clientUpdateFromVersion", { version: record.fromVersion });
      time.dateTime = date.toISOString();
      time.textContent = new Intl.DateTimeFormat(language === "zh" ? "zh-CN" : "en-US", { hour: "2-digit", minute: "2-digit" }).format(date);
      time.title = t("clientUpdateHistoryDetectedAt", { time: formatDate(record.detectedAt / 1000, true) });
      copy.append(version, from); item.append(copy, time); group.append(item);
    }
    elements.clientUpdateHistoryList.append(group);
  }
}

function renderClientUpdate(clientUpdate = {}) {
  latestClientUpdate = clientUpdate || {};
  const pending = Boolean(
    clientUpdate.pendingUpdate &&
    clientUpdate.currentVersion &&
    clientUpdate.pendingVersion
  );
  const installed = Boolean(
    !pending &&
    (clientUpdate.installedUpdateDetected || clientUpdate.status === "updated") &&
    clientUpdate.currentVersion
  );
  const available = Boolean(clientUpdate.available && clientUpdate.currentVersion);
  if (pending) {
    elements.clientUpdateStatus.textContent = t("clientUpdateReady");
    elements.clientUpdateVersion.textContent = t("clientUpdateTarget", {
      version: clientUpdate.pendingVersion
    });
  } else if (installed) {
    elements.clientUpdateStatus.textContent = t("clientUpdateDetected");
    elements.clientUpdateVersion.textContent = t("clientUpdateVersionChange", {
      version: clientUpdate.currentVersion
    });
  } else {
    elements.clientUpdateStatus.textContent = available
      ? t("clientUpdateNotDetected")
      : t("clientUpdateUnknown");
    elements.clientUpdateVersion.textContent = available
      ? t("clientUpdateVersion", { version: clientUpdate.currentVersion })
      : "—";
  }
  elements.clientUpdateCheck.classList.toggle("is-positive", pending || installed);
  elements.clientUpdateIcon.classList.toggle("is-positive", pending || installed);
  elements.clientUpdateCard.classList.toggle("has-update", pending || installed);
  renderClientUpdateHistory(clientUpdate);
}

function formatTokenCount(value, compact = false) {
  if (!Number.isFinite(value)) return t("tokenUnavailable");
  return new Intl.NumberFormat(language === "zh" ? "zh-CN" : "en-US", compact ? {
    notation: "compact",
    maximumFractionDigits: 1
  } : {
    maximumFractionDigits: 0
  }).format(value);
}

function formatUsd(value) {
  if (!Number.isFinite(value)) return t("tokenUnavailable");
  const maximumFractionDigits = value > 0 && value < 0.01 ? 4 : 2;
  return `$${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits
  }).format(value)}`;
}

function formatApiEstimate(cost = {}) {
  if (!cost.available) return t("tokenUnavailable");
  if (!Number.isFinite(cost.estimatedCostUsd)) return t("costPriceUnavailable");
  const partial = cost.hasUnpricedModels || cost.hasUnattributedUsage ||
    cost.officialUnmappedInputTokens > 0 || cost.truncated;
  const rebuilding = cost.calibratedToOfficialUsage || cost.hasUnverifiedHistory ||
    cost.scanProgress?.rebuilding || cost.scanProgress?.legacyStale > 0;
  return `${partial && !rebuilding ? "≥" : "≈"}${formatUsd(cost.estimatedCostUsd)}`;
}

function formatTaskDuration(value) {
  const totalSeconds = Math.max(0, Math.floor(Number(value) || 0));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (language === "zh") {
    if (hours > 0) return `${hours}时 ${String(minutes).padStart(2, "0")}分 ${String(seconds).padStart(2, "0")}秒`;
    return `${minutes}分 ${String(seconds).padStart(2, "0")}秒`;
  }
  if (hours > 0) return `${hours}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
  return `${minutes}m ${String(seconds).padStart(2, "0")}s`;
}

function getTaskElapsedSeconds(task) {
  if (Number.isFinite(task?.startedAt)) {
    return Math.max(0, Math.floor(Date.now() / 1_000) - task.startedAt);
  }
  const observedDelta = Number.isFinite(activeTaskObservedAt)
    ? Math.max(0, Math.floor((Date.now() - activeTaskObservedAt) / 1_000))
    : 0;
  return Math.max(0, Number(task?.elapsedSeconds) || 0) + observedDelta;
}

function formatActiveTaskCost(task = {}) {
  if (!Number.isFinite(task.estimatedCostUsd)) return t("tokenUnavailable");
  return `${task.partial || task.hasUnpricedModels ? "≥" : "≈"}${formatUsd(task.estimatedCostUsd)}`;
}

function formatActiveTaskAggregateCost(tasks = []) {
  if (!tasks.length) return formatUsd(0);
  const pricedTasks = tasks.filter(task => Number.isFinite(task?.estimatedCostUsd));
  if (!pricedTasks.length) return t("tokenUnavailable");
  const total = pricedTasks.reduce((sum, task) => sum + task.estimatedCostUsd, 0);
  const partial = pricedTasks.length !== tasks.length ||
    tasks.some(task => task.partial || task.hasUnpricedModels);
  return `${partial ? "≥" : "≈"}${formatUsd(total)}`;
}

function getActiveTaskModelNames(task) {
  return Array.isArray(task?.models)
    ? [...new Set(task.models.map(model => model.model).filter(Boolean))]
    : [];
}

function formatPrice(value) {
  if (!Number.isFinite(value)) return t("tokenUnavailable");
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 6
  }).format(Number(value) || 0);
}

function formatTokenDate(value, period = "day") {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ""))) return "—";
  const date = new Date(`${value}T00:00:00Z`);
  const locale = language === "zh" ? "zh-CN" : "en-US";
  return new Intl.DateTimeFormat(locale, period === "month" ? {
    year: "numeric",
    month: "short",
    timeZone: "UTC"
  } : {
    month: "short",
    day: "numeric",
    timeZone: "UTC"
  }).format(date);
}

function formatTokenTooltipDate(value, period = tokenPeriod) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ""))) return "—";
  const date = new Date(`${value}T00:00:00Z`);
  const locale = language === "zh" ? "zh-CN" : "en-US";
  if (period === "month") {
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "long",
      timeZone: "UTC"
    }).format(date);
  }
  const format = target => new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC"
  }).format(target);
  if (period !== "week") return format(date);
  const end = new Date(date);
  end.setUTCDate(end.getUTCDate() + 6);
  return `${format(date)} — ${format(end)}`;
}

function prepareCanvas(canvas) {
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(1, Math.round(rect.width));
  const height = Math.max(1, Math.round(rect.height));
  const ratio = Math.min(2, window.devicePixelRatio || 1);
  const pixelWidth = Math.round(width * ratio);
  const pixelHeight = Math.round(height * ratio);
  if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
    canvas.width = pixelWidth;
    canvas.height = pixelHeight;
  }
  const context = canvas.getContext("2d");
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  return { context, width, height };
}

function chartBars(series, width, height, padding, maximum, compact = false) {
  const usableWidth = Math.max(1, width - padding.left - padding.right);
  const usableHeight = Math.max(1, height - padding.top - padding.bottom);
  const slotWidth = usableWidth / Math.max(1, series.length);
  const barWidth = Math.max(
    compact ? 2 : 3,
    Math.min(compact ? 24 : 32, slotWidth * (compact ? .62 : .58))
  );
  const bottom = height - padding.bottom;
  return series.map((item, index) => ({
    x: padding.left + slotWidth * (index + .5),
    y: bottom - Math.max(2, usableHeight * item.tokens / maximum),
    width: barWidth,
    height: Math.max(2, usableHeight * item.tokens / maximum),
    bottom,
    slotWidth
  }));
}

function drawTokenBars(
  context,
  series,
  width,
  height,
  alpha = 1,
  growth = 1,
  compact = false,
  overview = false,
  highlightedIndex = null
) {
  if (!series.length || alpha <= 0) return;
  const padding = overview
    ? { left: 7, right: 7, top: 8, bottom: 8 }
    : (compact
    ? { left: 2, right: 2, top: 4, bottom: 4 }
    : TOKEN_CHART_PADDING);
  const maximum = Math.max(1, ...series.map(item => item.tokens));
  const bars = chartBars(series, width, height, padding, maximum, compact);
  context.save();
  context.globalAlpha = alpha;
  const gradient = context.createLinearGradient(0, padding.top, 0, height - padding.bottom);
  gradient.addColorStop(0, "rgba(35,159,187,.96)");
  gradient.addColorStop(.52, "rgba(82,182,207,.9)");
  gradient.addColorStop(1, "rgba(153,215,231,.65)");

  bars.forEach((bar, index) => {
    const highlighted = index === highlightedIndex;
    const animatedHeight = Math.max(1.5, bar.height * Math.max(0, Math.min(1, growth)));
    const animatedY = bar.bottom - animatedHeight;
    const widthBoost = highlighted && !compact ? 2 : 0;
    const renderedWidth = bar.width + widthBoost;
    context.shadowColor = highlighted
      ? "rgba(207,255,246,.62)"
      : "rgba(120,234,213,.28)";
    context.shadowBlur = highlighted ? 13 : (compact ? (overview ? 6 : 3) : 7);
    context.fillStyle = highlighted ? "#087e9e" : gradient;
    context.beginPath();
    context.roundRect(
      bar.x - renderedWidth / 2,
      animatedY,
      renderedWidth,
      animatedHeight,
      Math.min(renderedWidth / 2, compact ? 2.5 : 4)
    );
    context.fill();
    if (highlighted && !compact) {
      context.shadowBlur = 0;
      context.strokeStyle = "rgba(223,255,248,.48)";
      context.lineWidth = 1.2;
      context.stroke();
    }
  });
  context.restore();
}

function drawTokenAxes(context, series, width, height, period = tokenPeriod) {
  if (!series.length) return;
  const padding = TOKEN_CHART_PADDING;
  const maximum = Math.max(1, ...series.map(item => item.tokens));
  context.save();
  context.fillStyle = "rgba(71,109,128,.85)";
  context.font = '12px "Segoe UI Variable", sans-serif';
  context.textBaseline = "middle";
  context.textAlign = "right";
  for (const ratio of [1, .5, 0]) {
    const y = padding.top + (height - padding.top - padding.bottom) * (1 - ratio);
    context.fillText(formatTokenCount(maximum * ratio, true), padding.left - 7, y);
  }

  context.textBaseline = "alphabetic";
  const bars = chartBars(series, width, height, padding, maximum);
  const labelIndexes = [...new Set([0, Math.floor((series.length - 1) / 2), series.length - 1])];
  labelIndexes.forEach((index, labelIndex) => {
    const x = bars[index].x;
    context.textAlign = labelIndex === 0 ? "left" : (labelIndex === labelIndexes.length - 1 ? "right" : "center");
    context.fillText(formatTokenDate(series[index].startDate, period), x, height - 8);
  });
  context.restore();
}

function drawTokenChartFrame(previousSeries, currentSeries, progress) {
  const { context, width, height } = prepareCanvas(elements.tokenUsageChart);
  context.clearRect(0, 0, width, height);
  drawTokenAxes(context, currentSeries, width, height);
  const eased = 1 - Math.pow(1 - progress, 3);
  drawTokenBars(context, previousSeries, width, height, 1 - eased, 1);
  drawTokenBars(
    context,
    currentSeries,
    width,
    height,
    eased,
    eased,
    false,
    false,
    tokenChartHoverIndex
  );
}

function getTokenSeries(period = tokenPeriod) {
  const buckets = latestSnapshot?.tokenUsage?.dailyUsageBuckets || [];
  const aggregated = window.TokenUsage?.aggregateTokenUsage(buckets, period) || [];
  const limit = period === "day" ? 30 : (period === "week" ? 16 : 12);
  return aggregated.slice(-limit);
}

function hideTokenChartTooltip(redraw = true) {
  const hadHover = tokenChartHoverIndex !== null;
  tokenChartHoverIndex = null;
  elements.tokenChartTooltip.hidden = true;
  if (redraw && hadHover && tokenChartSeries.length && !tokenChartAnimationActive) {
    drawTokenChartFrame([], tokenChartSeries, 1);
  }
}

function updateTokenChartTooltip(event) {
  if (!tokenChartSeries.length || elements.tokenUsageModal.hidden) {
    hideTokenChartTooltip();
    return;
  }
  const rect = elements.tokenUsageChart.getBoundingClientRect();
  const width = Math.max(1, Math.round(rect.width));
  const height = Math.max(1, Math.round(rect.height));
  const maximum = Math.max(1, ...tokenChartSeries.map(item => item.tokens));
  const bars = chartBars(
    tokenChartSeries,
    width,
    height,
    TOKEN_CHART_PADDING,
    maximum
  );
  const pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top };
  let nearestIndex = null;
  let nearestDistance = Number.POSITIVE_INFINITY;
  bars.forEach((bar, index) => {
    const distance = Math.abs(bar.x - pointer.x);
    const withinHorizontalSlot = distance <= Math.max(8, bar.slotWidth / 2);
    const withinVerticalRange = pointer.y >= bar.y - 10 && pointer.y <= bar.bottom + 8;
    if (withinHorizontalSlot && withinVerticalRange && distance < nearestDistance) {
      nearestDistance = distance;
      nearestIndex = index;
    }
  });
  if (nearestIndex === null) {
    hideTokenChartTooltip();
    return;
  }

  const point = bars[nearestIndex];
  const item = tokenChartSeries[nearestIndex];
  const hoverChanged = tokenChartHoverIndex !== nearestIndex;
  tokenChartHoverIndex = nearestIndex;
  elements.tokenChartTooltipDate.textContent = formatTokenTooltipDate(item.startDate);
  elements.tokenChartTooltipValue.textContent = t("tokenChartTooltipValue", {
    tokens: formatTokenCount(item.tokens)
  });
  elements.tokenChartTooltip.hidden = false;

  const tooltipWidth = elements.tokenChartTooltip.offsetWidth;
  const tooltipHeight = elements.tokenChartTooltip.offsetHeight;
  const halfWidth = tooltipWidth / 2;
  const left = Math.max(halfWidth + 7, Math.min(width - halfWidth - 7, point.x));
  const placeBelow = point.y - tooltipHeight - 12 < 6;
  elements.tokenChartTooltip.style.left = `${left}px`;
  elements.tokenChartTooltip.style.top = `${
    placeBelow ? point.y + 12 : point.y - tooltipHeight - 12
  }px`;
  if (hoverChanged && !tokenChartAnimationActive) {
    drawTokenChartFrame([], tokenChartSeries, 1);
  }
}

function renderTokenChart(animate = true) {
  const nextSeries = getTokenSeries();
  const previousSeries = tokenChartSeries;
  tokenChartSeries = nextSeries;
  cancelAnimationFrame(tokenChartAnimationFrame);
  tokenChartAnimationActive = false;
  hideTokenChartTooltip(false);
  elements.tokenChartEmpty.hidden = nextSeries.length > 0;

  if (!nextSeries.length) {
    const { context, width, height } = prepareCanvas(elements.tokenUsageChart);
    context.clearRect(0, 0, width, height);
    elements.tokenChartRange.textContent = "—";
    elements.tokenChartLatest.textContent = "—";
    return;
  }

  const first = nextSeries[0];
  const last = nextSeries.at(-1);
  elements.tokenChartRange.textContent = `${formatTokenDate(first.startDate, tokenPeriod)} — ${formatTokenDate(last.startDate, tokenPeriod)}`;
  elements.tokenChartLatest.textContent = t("tokenLatestValue", {
    date: formatTokenDate(last.startDate, tokenPeriod),
    tokens: formatTokenCount(last.tokens, true)
  });

  if (!animate || !previousSeries.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    drawTokenChartFrame([], nextSeries, 1);
    return;
  }

  const startedAt = performance.now();
  tokenChartAnimationActive = true;
  const animateFrame = now => {
    const progress = Math.min(1, (now - startedAt) / 360);
    drawTokenChartFrame(previousSeries, nextSeries, progress);
    if (progress < 1) {
      tokenChartAnimationFrame = requestAnimationFrame(animateFrame);
    } else {
      tokenChartAnimationActive = false;
    }
  };
  tokenChartAnimationFrame = requestAnimationFrame(animateFrame);
}

function drawTokenSparkline() {
  if (!window.Workbench.visible(elements.tokenSparkline)) return;
  const series = getTokenSeries("day");
  const { context, width, height } = prepareCanvas(elements.tokenSparkline);
  context.clearRect(0, 0, width, height);
  document.getElementById("overviewChartEmpty").hidden = series.length > 0;
  drawTokenAxes(context, series, width, height, "day");
  drawTokenBars(context, series, width, height, 1, 1, false);
}

function renderTokenUsageModal(animate = false) {
  const usage = latestSnapshot?.tokenUsage || {};
  const cost = latestSnapshot?.tokenCost || {};
  const verifiedLocal = cost.verifiedLocalUsage || cost.localUsage;
  const workDays = Number.isFinite(usage.totalWorkDays)
    ? Math.max(0, Math.floor(usage.totalWorkDays))
    : 0;
  elements.tokenModalLifetimeLabel.textContent = t(usage.scope === "local" ? "localLifetimeTokens" : "lifetimeTokens");
  elements.tokenModalLifetime.textContent = `${usage.truncated || usage.hasUnverifiedHistory ? "≈" : ""}${formatTokenCount(usage.lifetimeTokens)}`;
  elements.tokenSourceNote.textContent = usage.scope === "local"
    ? t("tokenLocalSource", { state: t(usage.truncated || usage.hasUnverifiedHistory ? "tokenLocalPartial" : "tokenLocalComplete"), account: formatTokenCount(usage.accountLifetimeTokens) })
    : verifiedLocal ? t("tokenAccountWithLocalSource", { local: formatTokenCount(verifiedLocal.lifetimeTokens),
      state: t(verifiedLocal.truncated || cost.hasUnverifiedHistory ? "tokenLocalPartial" : "tokenLocalComplete") }) : t("tokenAccountSource");
  elements.tokenModalDailyAverage.textContent = (
    workDays > 0 && !usage.undatedTokens && Number.isFinite(usage.lifetimeTokens)
  )
    ? formatTokenCount(Math.round(usage.lifetimeTokens / workDays))
    : t("tokenUnavailable");
  const costWorkDays = cost.localUsage?.totalWorkDays || 0;
  elements.tokenModalDailyCost.textContent = (
    costWorkDays > 0 && !cost.localUsage?.undatedTokens && cost.available && Number.isFinite(cost.estimatedCostUsd)
  )
    ? formatApiEstimate({
        ...cost,
        estimatedCostUsd: cost.estimatedCostUsd / costWorkDays
      })
    : t("tokenUnavailable");
  elements.tokenModalTotalWorkDays.textContent = Number.isFinite(usage.totalWorkDays)
    ? t("workDays", { count: formatTokenCount(usage.totalWorkDays) })
    : t("tokenUnavailable");
  elements.tokenUsageFreshness.textContent = usage.available
    ? t(usage.scope === "local" ? (usage.cached ? "tokenLocalCached" : "tokenLocalLive") : (usage.cached ? "tokenCached" : "tokenLive"))
    : t("tokenUnavailable");
  elements.tokenPeriodSwitch.querySelectorAll("[data-token-period]").forEach(button => {
    button.classList.toggle("is-active", button.dataset.tokenPeriod === tokenPeriod);
    button.setAttribute("aria-pressed", button.dataset.tokenPeriod === tokenPeriod ? "true" : "false");
  });
  renderTokenChart(animate);
}

function renderTokenUsage(usage = {}) {
  elements.tokenOverviewTitle.textContent = t(usage.cached ? "tokenUsageCachedTitle" : "tokenUsageTitle");
  elements.tokenLifetimeLabel.textContent = t(usage.scope === "local" ? "localLifetimeTokens" : "lifetimeTokens");
  elements.lifetimeTokenValue.textContent = `${usage.truncated || usage.hasUnverifiedHistory ? "≈" : ""}${formatTokenCount(usage.lifetimeTokens)}`;
  elements.totalWorkDaysValue.textContent = Number.isFinite(usage.totalWorkDays)
    ? t("workDays", { count: formatTokenCount(usage.totalWorkDays) })
    : t("tokenUnavailable");
  elements.tokenOverview.classList.toggle("is-unavailable", !usage.available);
  requestAnimationFrame(drawTokenSparkline);
  syncWorkbench();
  if (!elements.tokenUsageModal.hidden) requestAnimationFrame(() => renderTokenUsageModal(false));
}

function appendModelCostStat(container, label, value) {
  const item = document.createElement("div");
  const caption = document.createElement("span");
  const strong = document.createElement("strong");
  caption.textContent = label;
  strong.textContent = value;
  item.append(caption, strong);
  container.append(item);
}

function renderTokenCostDetails(cost = latestSnapshot?.tokenCost || {}) {
  const progress = cost.scanProgress || {};
  elements.fullCostScan.disabled = Boolean(progress.rebuilding);
  elements.costScanProgress.textContent = progress.rebuilding ? t("costScanRunning", { pending: progress.pendingFiles, total: progress.totalFiles }) : progress.legacyStale ? t("costScanRecorded", {count: progress.legacyStale}) : t("costScanIdle", {count: cost.filesScanned || 0});
  elements.tokenCostTotal.textContent = formatApiEstimate(cost);
  const models = Array.isArray(cost.models)
    ? cost.models.filter(model => model?.model && model.model !== "unknown")
    : [];
  const modelCount = models.length;
  const coverageKey = cost.hasUnpricedModels ? "costCoveragePartial" : "costCoverage";
  const coverage = t(coverageKey, {
    count: modelCount,
    date: cost.pricingDate || "—"
  });
  const coverageNotes = [coverage];
  if (cost.calibrationMethod === "legacy-daily") {
    coverageNotes.push(t("costLegacyAlgorithm"));
    coverageNotes.push(t("costTokenBasis", {
      raw: formatTokenCount(cost.rawLocalInputTokens), calibrated: formatTokenCount(cost.calibratedInputTokens),
      independent: formatTokenCount(cost.independentInputTokens)
    }));
    if (cost.calibrationUncoveredDays > 0) coverageNotes.push(t("costUncoveredDates", { count: formatTokenCount(cost.calibrationUncoveredDays) }));
    if (!cost.calibratedToOfficialUsage && cost.calibratedNativeInputTokens > 0) coverageNotes.push(t("costCalibrationUnavailable"));
  }
  if (cost.hasUnattributedUsage) {
    coverageNotes.push(t("costCoverageUnattributed", {
      count: formatTokenCount(cost.unattributedRequestCount)
    }));
  }
  if (cost.replayExcludedInputTokens > 0) {
    coverageNotes.push(t("costCoverageCalibrated", {
      tokens: formatTokenCount(cost.replayExcludedInputTokens, true)
    }));
  }
  if (cost.officialUnmappedInputTokens > 0) {
    coverageNotes.push(t("costCoverageUnmapped", {
      tokens: formatTokenCount(cost.officialUnmappedInputTokens, true)
    }));
  }
  if (cost.truncated) coverageNotes.push(t("costCoverageTruncated"));
  if (cost.hasUnverifiedHistory) coverageNotes.push(t("costCoverageUnverified", { count: formatTokenCount(cost.unverifiedFiles || 0) }));
  elements.tokenCostCoverage.textContent = coverageNotes.join("; ");
  elements.modelCostList.replaceChildren();

  if (!cost.available || !modelCount) {
    const empty = document.createElement("div");
    empty.className = "cost-empty";
    empty.textContent = t("modelCostEmpty");
    elements.modelCostList.append(empty);
    return;
  }

  models.forEach(model => {
    const item = document.createElement("article");
    item.className = "model-cost-item";
    const heading = document.createElement("div");
    heading.className = "model-cost-heading";
    const modelName = document.createElement("strong");
    modelName.textContent = model.model;
    const modelCost = document.createElement("span");
    modelCost.textContent = model.priced
      ? `≈${formatUsd(model.estimatedCostUsd)}`
      : t(model.missingPriceComponents?.length ? "modelCostRateUnavailable" : model.pricingPending ? "modelCostPricingPending" : "modelCostUnpriced");
    modelCost.classList.toggle("is-unpriced", !model.priced);
    heading.append(modelName, modelCost);

    const stats = document.createElement("div");
    stats.className = "model-cost-stats";
    appendModelCostStat(stats, t(model.accountCalibrated ? "modelCostCalibratedInput" : "modelCostInput"), formatTokenCount(model.inputTokens));
    appendModelCostStat(
      stats,
      t("modelCostCached"),
      formatTokenCount(model.cachedInputTokens)
    );
    appendModelCostStat(stats, t(model.accountCalibrated ? "modelCostCalibratedOutput" : "modelCostOutput"), formatTokenCount(model.outputTokens));
    appendModelCostStat(stats, t("modelCostHitRate"), `${Number(model.cacheHitRate || 0).toFixed(1)}%`);
    item.append(heading, stats);

    const details = [t(model.accountCalibrated ? "modelCostCalibratedRequests" : "modelCostRequests", {
      count: formatTokenCount(model.requestCount)
    })];
    if (model.pricingPartial) details.push(t("modelCostPartialRates"));
    if (model.pricing) {
      details.unshift(t("modelPricingVendor", { vendor: model.pricing.vendor || "API" }));
      details.unshift(t("modelCostRate", {
        input: formatPrice(model.pricing.input),
        cached: formatPrice(model.pricing.cachedInput),
        output: formatPrice(model.pricing.output)
      }));
      if (["Anthropic", "OpenAI"].includes(model.pricing.vendor) && Number.isFinite(model.pricing.cacheWriteLong)) {
        details.push(t("modelCostWriteRates", { shortTtl: model.pricing.vendor === "Anthropic" ? "5m" : "30m",
          longTtl: model.pricing.vendor === "Anthropic" ? "1h" : "12h",
          short: formatPrice(model.pricing.cacheWrite), long: formatPrice(model.pricing.cacheWriteLong) }));
      }
      if (model.pricing.contextThreshold) details.push(t("modelPriceThreshold", {
        operator: model.pricing.contextInclusive ? "≥" : ">", tokens: formatTokenCount(model.pricing.contextThreshold, true) }));
      if (model.pricing.note === "peak") details.push(t("modelPricePeak"));
      if (model.pricing.note === "global") details.push(t("modelPriceGlobal"));
    }
    if (model.cacheWriteInputTokens > 0) {
      details.push(t("modelCostCacheWrite", {
        tokens: formatTokenCount(model.cacheWriteInputTokens, true)
      }));
    }
    if (model.longContextRequests > 0) {
      details.push(t("modelCostLongContext", {
        count: formatTokenCount(model.longContextRequests)
      }));
    }
    const rate = document.createElement("div");
    rate.className = "model-cost-rate";
    rate.textContent = details.join("; ");
    item.append(rate);
    elements.modelCostList.append(item);
  });
}

function renderTokenCost(cost = {}) {
  elements.estimatedCostValue.textContent = formatApiEstimate(cost);
  if (!elements.tokenCostModal.hidden) renderTokenCostDetails(cost);
  syncWorkbench();
}

function openTokenCost(event) {
  event?.stopPropagation();
  renderTokenCostDetails();
  openSecondaryModal(elements.tokenCostModal, elements.tokenCostClose);
}

function closeTokenCost() {
  closeSecondaryModal(
    elements.tokenCostModal,
    document.querySelector('[data-stat-scope="token-daily-cost"]') ||
      elements.tokenOverview
  );
}

function appendActiveTaskStat(container, label, value, elapsedIndex = null) {
  const item = document.createElement("div");
  const caption = document.createElement("span");
  const strong = document.createElement("strong");
  caption.textContent = label;
  strong.textContent = value;
  if (elapsedIndex !== null) strong.dataset.taskElapsedIndex = String(elapsedIndex);
  item.append(caption, strong);
  container.append(item);
}

function activeTaskIdentity(task) {
  if (typeof task?.id === "string" && task.id) return `id:${task.id}`;
  return `fallback:${Number(task?.startedAt) || 0}:${String(task?.projectName || "")}`;
}

function normalizeActiveTaskRecords(value = {}) {
  const count = key => Number.isFinite(value[key])
    ? Math.max(0, Math.floor(value[key]))
    : 0;
  const money = key => Number.isFinite(value[key]) ? Math.max(0, value[key]) : 0;
  return {
    longestElapsedSeconds: count("longestElapsedSeconds"),
    highestEstimatedCostUsd: money("highestEstimatedCostUsd"),
    totalTaskCount: count("totalTaskCount"),
    timedTaskCount: count("timedTaskCount"),
    totalElapsedSeconds: count("totalElapsedSeconds"),
    totalEstimatedCostUsd: money("totalEstimatedCostUsd"),
    completedTaskCount: count("completedTaskCount"),
    manualInterruptedTaskCount: count("manualInterruptedTaskCount"),
    abnormalInterruptedTaskCount: count("abnormalInterruptedTaskCount"),
    managedStoppedTaskCount: count("managedStoppedTaskCount"),
    historyTruncated: Boolean(value.historyTruncated)
  };
}

function normalizePendingTaskOutcome(value) {
  return [
    "completed",
    "manual-interrupted",
    "abnormal-interrupted",
  "managed-stopped"
  ].includes(value)
    ? value
    : "abnormal-interrupted";
}

function pendingTaskStatusKey(task) {
  if (task?.outcome === "managed-stopped") return "taskManagedStopped";
  if (task?.outcome === "manual-interrupted") {
    return "activeTaskManualInterruptedStatus";
  }
  if (task?.outcome === "abnormal-interrupted") {
    return "activeTaskAbnormalInterruptedStatus";
  }
  return "activeTaskCompletedStatus";
}

function mergePendingTasks(incoming = []) {
  const activeIdentities = new Set(activeTasks.map(activeTaskIdentity));
  pendingTasks = pendingTasks.filter(task => !activeIdentities.has(activeTaskIdentity(task)));
  const known = new Set(pendingTasks.map(activeTaskIdentity));
  for (const task of Array.isArray(incoming) ? incoming : []) {
    const identity = activeTaskIdentity(task);
    if (
      known.has(identity) ||
      activeIdentities.has(identity) ||
      dismissedPendingTaskIds.has(identity)
    ) continue;
    const normalizedTask = {
      ...task,
      elapsedSeconds: Math.max(0, Math.floor(Number(task?.elapsedSeconds) || 0)),
      completedAt: Number.isFinite(task?.completedAt) ? task.completedAt : Date.now(),
      outcome: normalizePendingTaskOutcome(task?.outcome)
    };
    pendingTasks.push(normalizedTask);
    if (
      normalizedTask.outcome === "abnormal-interrupted" &&
      !shownAbnormalTaskIds.has(identity)
    ) {
      shownAbnormalTaskIds.add(identity);
      showTaskInterruptionAlert(normalizedTask);
    }
    known.add(identity);
  }
  pendingTasks = pendingTasks
    .sort((left, right) => right.completedAt - left.completedAt)
    .slice(0, 32);
}

function renderTaskInterruptionAlert(task) {
  elements.taskInterruptionMessage.textContent = t("taskAbnormalMessage", {
    project: task?.projectName || t("activeTaskProjectFallback"),
    time: formatTaskDuration(task?.elapsedSeconds)
  });
}

function showTaskInterruptionAlert(task) {
  activeAbnormalAlertTask = task;
  renderTaskInterruptionAlert(task);
  openSecondaryModal(elements.taskInterruptionModal, elements.taskInterruptionDone);
}

function closeTaskInterruptionAlert() {
  closeSecondaryModal(elements.taskInterruptionModal, elements.activeTaskCard, {
    onHidden() {
      activeAbnormalAlertTask = null;
    }
  });
}

function statScopeTruncationCopy() {
  return t(
    activeTaskRecords.historyTruncated
      ? "statScopeTruncated"
      : "statScopeNotTruncated"
  );
}

function renderStatScopeDialog() {
  if (!activeStatScope) return;
  const metric = t(activeStatScope.labelKey);
  elements.statScopeTitle.textContent = t("statScopeTitle", { metric });
  const values = {
    total: formatTokenCount(activeTaskRecords.totalTaskCount),
    timed: formatTokenCount(activeTaskRecords.timedTaskCount),
    undated: formatTokenCount(latestSnapshot?.tokenUsage?.undatedTokens || 0),
    account: formatTokenCount(latestSnapshot?.tokenUsage?.accountLifetimeTokens ?? latestSnapshot?.tokenUsage?.lifetimeTokens),
    localState: t(latestSnapshot?.tokenCost?.localUsage?.truncated || latestSnapshot?.tokenCost?.hasUnverifiedHistory ? "tokenLocalPartial" : "tokenLocalComplete"),
    truncated: statScopeTruncationCopy()
  };
  const messageKey = {
    "token-daily-cost": "statScopeTokenDailyCost",
    "token-local": latestSnapshot?.tokenUsage?.scope === "local" ? "statScopeTokenLocal" : "statScopeTokenAccount",
    "task-running": activeTasksAvailable
      ? "statScopeTaskRunning"
      : "statScopeTaskRunningUnavailable",
    "task-pending": "statScopeTaskPending",
    "task-duration": "statScopeTaskDuration",
    "task-cost": "statScopeTaskCost",
    "task-total-count": "statScopeTaskCount"
  }[activeStatScope.scope];
  elements.statScopeMessage.textContent = t(messageKey || "statScopeTaskCount", values);
  elements.tokenCostHelp.hidden = activeStatScope.scope !== "token-daily-cost";
}

function openStatScope(button) {
  activeStatScope = {
    scope: button.dataset.statScope,
    labelKey: button.dataset.statLabelKey
  };
  activeStatScopeSource = button;
  renderStatScopeDialog();
  openSecondaryModal(elements.statScopeModal, elements.statScopeClose);
}

function closeStatScope(afterHidden = null) {
  const restoreFocus = activeStatScopeSource;
  closeSecondaryModal(elements.statScopeModal, restoreFocus, {
    onHidden() {
      activeStatScope = null;
      activeStatScopeSource = null;
      afterHidden?.();
    }
  });
}

function renderStatScopeButtons() {
  document.querySelectorAll('[data-stat-scope="task-running"]').forEach(button => {
    button.hidden = activeTasksAvailable && !activeTasksTruncated;
  });
}

function getDisplayedLongestTaskSeconds() {
  const liveLongest = activeTasks.reduce(
    (longest, task) => Math.max(longest, getTaskElapsedSeconds(task)),
    0
  );
  return Math.max(activeTaskRecords.longestElapsedSeconds, liveLongest);
}

function getDisplayedHighestTaskCost() {
  const visibleHighest = [...activeTasks, ...pendingTasks].reduce(
    (highest, task) => Number.isFinite(task?.estimatedCostUsd)
      ? Math.max(highest, task.estimatedCostUsd)
      : highest,
    0
  );
  return Math.max(activeTaskRecords.highestEstimatedCostUsd, visibleHighest);
}

function getTaskAggregateStats() {
  const outcomeTotal = activeTaskRecords.completedTaskCount +
    activeTaskRecords.manualInterruptedTaskCount +
    activeTaskRecords.abnormalInterruptedTaskCount + activeTaskRecords.managedStoppedTaskCount;
  const totalTaskCount = Math.max(
    activeTaskRecords.totalTaskCount,
    outcomeTotal
  );
  return {
    running: activeTasks.length,
    pending: pendingTasks.length,
    longestElapsedSeconds: getDisplayedLongestTaskSeconds(),
    highestEstimatedCostUsd: getDisplayedHighestTaskCost(),
    averageElapsedSeconds: activeTaskRecords.timedTaskCount
      ? activeTaskRecords.totalElapsedSeconds / activeTaskRecords.timedTaskCount
      : null,
    averageEstimatedCostUsd: totalTaskCount
      ? activeTaskRecords.totalEstimatedCostUsd / totalTaskCount
      : null,
    totalTaskCount,
    totalElapsedSeconds: activeTaskRecords.totalElapsedSeconds
  };
}

function renderActiveTaskRecords() {
  const stats = getTaskAggregateStats();
  const averageTime = Number.isFinite(stats.averageElapsedSeconds)
    ? formatTaskDuration(stats.averageElapsedSeconds)
    : t("tokenUnavailable");
  const averageCost = Number.isFinite(stats.averageEstimatedCostUsd)
    ? formatUsd(stats.averageEstimatedCostUsd)
    : t("tokenUnavailable");
  elements.activeTaskCount.textContent = activeTasksAvailable
    ? String(stats.running)
    : "—";
  elements.activeTaskPending.textContent = String(stats.pending);
  elements.activeTaskElapsed.textContent = formatTaskDuration(
    stats.longestElapsedSeconds
  );
  elements.activeTaskTotalCost.textContent = formatUsd(
    stats.highestEstimatedCostUsd
  );
  elements.activeTaskAverageTime.textContent = averageTime;
  elements.activeTaskAverageCost.textContent = averageCost;
  elements.activeTaskTotalCount.textContent = formatTokenCount(stats.totalTaskCount);
  elements.activeTaskTotalElapsed.textContent = formatTaskDuration(
    stats.totalElapsedSeconds
  );

  elements.activeTaskDetailRunning.textContent = activeTasksAvailable
    ? String(stats.running)
    : "—";
  elements.activeTaskDetailPending.textContent = String(stats.pending);
  elements.activeTaskDetailLongest.textContent = formatTaskDuration(
    stats.longestElapsedSeconds
  );
  elements.activeTaskDetailHighestCost.textContent = formatUsd(
    stats.highestEstimatedCostUsd
  );
  elements.activeTaskDetailAverageTime.textContent = averageTime;
  elements.activeTaskDetailAverageCost.textContent = averageCost;
  elements.activeTaskDetailTotalCount.textContent = formatTokenCount(
    stats.totalTaskCount
  );
  elements.activeTaskDetailTotalElapsed.textContent = formatTaskDuration(
    stats.totalElapsedSeconds
  );
}

function renderActiveTaskClock() {
  renderActiveTaskRecords();
  if (!activeTasksAvailable || !activeTasks.length) return;
  const boardTask = activeTasks.find(task => task.id === latestPerformanceTask?.id && task.startedAt === latestPerformanceTask?.startedAt);
  if (boardTask?.telemetry && !boardTask.telemetry.partial && Number.isFinite(boardTask.telemetry.outputTokens)) {
    const elapsed = Math.max(0, Date.now() / 1000 - boardTask.startedAt);
    elements.latestTaskAverage.textContent = elapsed > 0
      ? new Intl.NumberFormat(language === "zh" ? "zh-CN" : "en-US", { maximumFractionDigits: 1 }).format(boardTask.telemetry.outputTokens / elapsed) : "—";
  }
  elements.activeTaskList.querySelectorAll("[data-task-elapsed-index]").forEach(node => {
    const task = activeTasks[Number(node.dataset.taskElapsedIndex)];
    if (task) node.textContent = formatTaskDuration(getTaskElapsedSeconds(task));
  });
  if (!elements.taskDetailDrawer.hidden && selectedTaskIdentity) {
    const task = activeTasks.find(task => activeTaskIdentity(task) === selectedTaskIdentity);
    const elapsed = elements.taskDrawerContent.querySelector("[data-drawer-elapsed]");
    if (task && elapsed) elapsed.textContent = formatTaskDuration(getTaskElapsedSeconds(task));
  }
  elements.activeTaskPreviewList.querySelectorAll("[data-task-preview-elapsed-index]").forEach(node => {
    const task = activeTasks[Number(node.dataset.taskPreviewElapsedIndex)];
    if (task) node.textContent = formatTaskDuration(getTaskElapsedSeconds(task));
  });
}

function renderActiveTaskPreview() {
  elements.activeTaskPreviewList.replaceChildren();
  const previewTasks = activeTasks.map(task => ({ task, pending: false }));
  elements.activeTaskPreviewList.classList.toggle("is-single", previewTasks.length === 1);

  if (!activeTasksAvailable || !previewTasks.length) {
    const empty = document.createElement("div");
    empty.className = "active-task-preview-empty";
    empty.textContent = activeTasksAvailable
      ? t("activeTaskNoRunningPreview")
      : t("activeTaskUnavailable");
    elements.activeTaskPreviewList.append(empty);
    return;
  }

  previewTasks.slice(0, 3).forEach(({ task, pending }, index) => {
    const row = document.createElement("div");
    row.className = [
      "active-task-preview-row",
      pending ? "is-completed" : "",
      pending ? `is-${normalizePendingTaskOutcome(task.outcome)}` : ""
    ].filter(Boolean).join(" ");
    const dot = document.createElement("span");
    dot.className = "active-task-preview-dot";
    dot.setAttribute("aria-hidden", "true");

    const identity = document.createElement("div");
    identity.className = "active-task-preview-identity";
    const project = document.createElement("strong");
    project.textContent = task.projectName || t("activeTaskProjectFallback");
    const model = document.createElement("span");
    const modelNames = getActiveTaskModelNames(task);
    model.textContent = pending
      ? t(pendingTaskStatusKey(task))
      : (modelNames.length ? modelNames.slice(0, 2).join("; ") : "—");
    identity.append(project, model);

    const elapsed = document.createElement("strong");
    elapsed.className = "active-task-preview-elapsed";
    if (!pending) elapsed.dataset.taskPreviewElapsedIndex = String(index);
    elapsed.textContent = formatTaskDuration(
      pending ? task.elapsedSeconds : getTaskElapsedSeconds(task)
    );

    const cost = document.createElement("strong");
    cost.className = "active-task-preview-cost";
    cost.textContent = formatActiveTaskCost(task);
    row.append(dot, identity, elapsed, cost);
    elements.activeTaskPreviewList.append(row);
  });
}

function taskVisible(task, pending) {
  const query = elements.taskSearch.value.trim().toLowerCase();
  if (query && !(String(task.projectName || "") + " " + getActiveTaskModelNames(task).join(" ")).toLowerCase().includes(query)) return false;
  const filter = elements.taskFilter.value;
  return filter === "all" || (filter === "running" && !pending) || (filter === "pending" && pending) ||
    (filter === "goal" && Boolean(task.goalStatus)) || (filter === "subagent" && task.taskKind === "subagent");
}

function sortTaskRows() {
  const compare = elements.taskSort.value === "cost" ? (a, b) => (b.estimatedCostUsd || 0) - (a.estimatedCostUsd || 0)
    : elements.taskSort.value === "duration" ? (a, b) => (b.elapsedSeconds || 0) - (a.elapsedSeconds || 0)
    : (a, b) => b.startedAt - a.startedAt;
  activeTasks.sort(compare);
  pendingTasks.sort(compare);
}

function appendTaskContext(item, task, pending = false) {
  const meta = document.createElement("div");
  meta.className = "task-context";
  const kind = document.createElement("span");
  kind.className = "task-kind";
  kind.textContent = t(task.taskKind === "subagent" ? "taskKindSubagent" : task.goalStatus ? "taskKindGoal" : "taskKindTask");
  const identity = document.createElement("small");
  identity.textContent = t("taskIdentity", { id: task.id?.slice(0, 8) || "—", time: formatDate(pending ? task.endedAt || task.completedAt / 1000 : task.startedAt, true) });
  meta.append(kind, identity);
  item.append(meta);
  if (task.goalStatus) {
    const goal = document.createElement("small");
    goal.className = "task-goal-state";
    const key = { active: "taskGoalActive", paused: "taskGoalPaused", blocked: "taskGoalBlocked", complete: "taskGoalComplete" }[task.goalStatus] || "taskGoalLimited";
    goal.textContent = [t(key), task.goalTokenBudget ? t("taskGoalBudget", { used: formatTokenCount(task.goalTokensUsed), budget: formatTokenCount(task.goalTokenBudget) }) : null].filter(Boolean).join("; ");
    item.append(goal);
    const usage = document.createElement("div");
    usage.className = "task-goal-usage";
    usage.textContent = t("goalUsage", { tokens: formatTokenCount(task.goalTokensUsed), time: task.goalTimeUsedSeconds === null ? "—" : formatTaskDuration(task.goalTimeUsedSeconds) });
    item.append(usage);
  }
}

function confirmAllCompletedTasks() {
  for (const task of pendingTasks.filter(task => task.outcome === "completed")) dismissedPendingTaskIds.add(activeTaskIdentity(task));
  pendingTasks = pendingTasks.filter(task => task.outcome !== "completed");
  renderActiveTaskPreview();
  renderActiveTaskDetails();
}

let monitorUpdateState = null;
function renderMonitorUpdate(state = monitorUpdateState) {
  monitorUpdateState = state;
  if (!state) return;
  const key = { checking: "monitorUpdateChecking", downloading: "monitorUpdateDownloading", ready: "monitorUpdateReady", error: "monitorUpdateError", development: "monitorUpdateDevelopment" }[state.status] || "monitorUpdateIdle";
  elements.monitorUpdateStatus.textContent = t(key, { version: state.version || state.currentVersion, percent: state.percent });
  elements.monitorUpdateStatus.dataset.state = state.status;
  elements.monitorUpdateInstall.hidden = state.status !== "ready";
  elements.monitorUpdateCheck.disabled = ["checking", "downloading", "ready", "development"].includes(state.status);
}

function createTaskModelRows(task) {
  const list = document.createElement("div");
  list.className = "task-model-table";
  for (const model of task.models || []) {
    const row = document.createElement("div");
    row.className = "task-model-row";
    const name = document.createElement("strong");
    name.textContent = model.model;
    const cost = document.createElement("strong");
    cost.className = "task-model-cost";
    cost.textContent = Number.isFinite(model.estimatedCostUsd) ? formatUsd(model.estimatedCostUsd) : t("modelCostUnpriced");
    const usage = document.createElement("small");
    usage.textContent = t("taskModelUsage", { input: formatTokenCount(model.inputTokens), cached: formatTokenCount(model.cachedInputTokens), output: formatTokenCount(model.outputTokens) });
    row.append(name, cost, usage);
    list.append(row);
  }
  return list;
}

function renderActiveTaskDetails() {
  const previousScroll = elements.activeTaskList.scrollTop;
  const pageScroll = document.getElementById("workspaceContent").scrollTop;
  const focusedDetail = elements.activeTaskList.contains(document.activeElement) ? document.activeElement.dataset.taskDetailId : null;
  const focusedAction = elements.activeTaskList.contains(document.activeElement) ? {
    identity: document.activeElement.dataset.pendingTaskId,
    action: document.activeElement.dataset.pendingTaskAction
  } : null;
  sortTaskRows();
  renderActiveTaskPreview();
  elements.activeTaskList.replaceChildren();
  renderActiveTaskRecords();
  elements.confirmAllTasks.disabled = !pendingTasks.some(task => task.outcome === "completed");

  if ((!activeTasksAvailable && !pendingTasks.length) ||
      (!activeTasks.length && !pendingTasks.length)) {
    const empty = document.createElement("div");
    empty.className = "active-task-empty";
    empty.textContent = activeTasksAvailable || pendingTasks.length
      ? t("activeTaskEmptyDetail")
      : t("activeTaskUnavailable");
    elements.activeTaskList.append(empty);
    return;
  }

  if (activeTasks.length) {
    const runningHeading = document.createElement("h3");
    runningHeading.className = "active-task-list-section";
    runningHeading.textContent = t("activeTaskRunningSection");
    elements.activeTaskList.append(runningHeading);
  }
  activeTasks.forEach((task, index) => {
    if (!taskVisible(task, false)) return;
    const item = document.createElement("article");
    item.className = "active-task-item is-running";

    const heading = document.createElement("div");
    heading.className = "active-task-item-heading";
    const projectName = document.createElement("strong");
    projectName.textContent = task.projectName || t("activeTaskProjectFallback");
    const status = document.createElement("span");
    status.textContent = t("activeTaskRunningStatus");
    heading.append(projectName, status);

    const stats = document.createElement("div");
    stats.className = "active-task-item-stats";
    appendActiveTaskStat(
      stats,
      t("activeTaskTimeLabel"),
      formatTaskDuration(getTaskElapsedSeconds(task)),
      index
    );
    appendActiveTaskStat(stats, t("activeTaskCostLabel"), formatActiveTaskCost(task));

    const models = createTaskModelRows(task);

    item.append(heading);
    appendTaskContext(item, task);
    item.append(stats, models);
    if (task.hasUnpricedModels || task.partial) {
      const note = document.createElement("small");
      note.className = "active-task-note";
      note.textContent = [
        task.hasUnpricedModels ? t("activeTaskUnpriced") : null,
        task.partial ? t("activeTaskPartialCost") : null
      ].filter(Boolean).join("; ");
      item.append(note);
    }
    const details = document.createElement("button"); details.type = "button"; details.className = "text-button"; details.textContent = t("taskDetails");
    details.dataset.taskDetailId = activeTaskIdentity(task); item.append(details);
    elements.activeTaskList.append(item);
  });

  if (pendingTasks.length) {
    const pendingHeading = document.createElement("h3");
    pendingHeading.className = "active-task-list-section";
    pendingHeading.textContent = t("activeTaskPendingSection");
    elements.activeTaskList.append(pendingHeading);
  }
  pendingTasks.forEach((task, index) => {
    if (!taskVisible(task, true)) return;
    const item = document.createElement("article");
    item.className = [
      "active-task-item",
      "is-completed",
      `is-${normalizePendingTaskOutcome(task.outcome)}`
    ].join(" ");

    const heading = document.createElement("div");
    heading.className = "active-task-item-heading";
    const projectName = document.createElement("strong");
    projectName.textContent = task.projectName || t("activeTaskProjectFallback");
    const status = document.createElement("span");
    status.textContent = t(pendingTaskStatusKey(task));
    heading.append(projectName, status);

    const stats = document.createElement("div");
    stats.className = "active-task-item-stats";
    appendActiveTaskStat(
      stats,
      t("activeTaskTimeLabel"),
      formatTaskDuration(task.elapsedSeconds)
    );
    appendActiveTaskStat(stats, t("activeTaskCostLabel"), formatActiveTaskCost(task));

    const actions = document.createElement("div");
    actions.className = "active-task-completed-actions";
    const returnButton = document.createElement("button");
    returnButton.className = "glass-button active-task-return";
    returnButton.type = "button";
    returnButton.dataset.pendingTaskAction = "return";
    returnButton.dataset.pendingTaskIndex = String(index);
    returnButton.dataset.pendingTaskId = activeTaskIdentity(task);
    returnButton.textContent = t("activeTaskReturnCodex");
    const confirmButton = document.createElement("button");
    confirmButton.className = "glass-button primary active-task-confirm";
    confirmButton.type = "button";
    confirmButton.dataset.pendingTaskAction = "confirm";
    confirmButton.dataset.pendingTaskIndex = String(index);
    confirmButton.dataset.pendingTaskId = activeTaskIdentity(task);
    confirmButton.textContent = t("activeTaskConfirm");
    actions.append(returnButton, confirmButton);
    item.append(heading);
    appendTaskContext(item, task, true);
    item.append(stats, createTaskModelRows(task), actions);
    elements.activeTaskList.append(item);
  });
  if (!elements.activeTaskList.querySelector(".active-task-item")) {
    const empty = document.createElement("p"); empty.className = "active-task-empty"; empty.textContent = t("noMatchingTasks"); elements.activeTaskList.append(empty);
  }
  elements.activeTaskList.scrollTop = previousScroll;
  if (!elements.activeTaskModal.hidden) document.getElementById("workspaceContent").scrollTop = pageScroll;
  if (focusedDetail) [...elements.activeTaskList.querySelectorAll("[data-task-detail-id]")].find(node => node.dataset.taskDetailId === focusedDetail)?.focus({preventScroll:true});
  renderTaskDrawer();
  if (focusedAction?.identity) {
    const control = [...elements.activeTaskList.querySelectorAll("button")].find(button =>
      button.dataset.pendingTaskId === focusedAction.identity && button.dataset.pendingTaskAction === focusedAction.action);
    control?.focus({ preventScroll: true });
  }
}

function renderTaskPerformance(task = latestPerformanceTask) {
  // Snapshot freshness is checked at the IPC boundary. A live parent can start
  // before a completed child; do not let its older start time freeze the board.
  if (task) latestPerformanceTask = task;
  const latest = latestPerformanceTask;
  const telemetry = latest?.telemetry || {};
  const valid = value => Number.isFinite(value) && value >= 0;
  const rate = value => valid(value) ? new Intl.NumberFormat(language === "zh" ? "zh-CN" : "en-US", { maximumFractionDigits: 1 }).format(value) : "—";
  const identity = latest ? `${latest.projectName || t("taskKindTask")}; ${latest.endedAt ? formatDate(latest.endedAt) : t("activeTaskRunningStatus")}` : t("latestTaskEmpty");
  elements.latestTaskIdentity.textContent = latest?.projectName || t("latestTaskEmpty");
  elements.latestTaskIdentity.title = identity;
  elements.latestTaskFirstToken.textContent = valid(telemetry.firstTokenMs)
    ? telemetry.firstTokenMs < 1000 ? `${Math.round(telemetry.firstTokenMs)}ms` : `${rate(telemetry.firstTokenMs / 1000)}s` : "—";
  elements.latestTaskFirstToken.title = valid(telemetry.firstTokenMs) ? `${telemetry.firstTokenMs} ms` : t("noData");
  elements.latestTaskTokens.textContent = valid(telemetry.totalTokens)
    ? `${telemetry.partial ? "≥" : ""}${new Intl.NumberFormat(language === "zh" ? "zh-CN" : "en-US", { notation: "compact", maximumFractionDigits: 1 }).format(telemetry.totalTokens)}` : "—";
  elements.latestTaskTokens.title = valid(telemetry.totalTokens) ? `${telemetry.partial ? "≥" : ""}${telemetry.totalTokens.toLocaleString()} Tokens` : t("noData");
  elements.latestTaskPeak.textContent = rate(telemetry.peakTokensPerSecond);
  elements.latestTaskMin.textContent = rate(telemetry.minTokensPerSecond);
  elements.latestTaskAverage.textContent = rate(telemetry.averageTokensPerSecond);
  elements.latestTaskCacheHit.textContent = valid(telemetry.cacheHitRate) && telemetry.cacheHitRate <= 100 ? `${rate(telemetry.cacheHitRate)}%` : "—";
  const scope = t("taskTelemetryScope", { task: identity });
  elements.taskPerformance.title = scope;
  elements.taskPerformance.setAttribute("aria-label", `${t("latestTaskTitle")}: ${identity}. ${scope}`);
  elements.taskPerformanceScope.textContent = scope;
}

function renderActiveTasks(result = {}) {
  activeTasksAvailable = Boolean(result.available);
  activeTasksTruncated = Boolean(result.truncated);
  activeTasks = activeTasksAvailable && Array.isArray(result.tasks)
    ? result.tasks.slice().sort((left, right) => left.startedAt - right.startedAt)
    : [];
  renderTaskPerformance(result.latestTask);
  const concurrentCount = activeTasksAvailable ? `${activeTasksTruncated ? "≥" : ""}${activeTasks.length}` : "—";
  const agentCount = activeTasks.filter(task => task.taskKind === "subagent").length;
  elements.taskConcurrency.textContent = t("taskConcurrency", { count: concurrentCount });
  const concurrentHint = activeTasksAvailable ? t("taskConcurrencyHint", { count: concurrentCount,
    agents: `${activeTasksTruncated ? "≥" : ""}${agentCount}` }) : t("taskConcurrencyUnknown");
  elements.taskConcurrency.title = concurrentHint;
  elements.taskConcurrency.setAttribute("aria-label", concurrentHint);
  elements.taskConcurrency.classList.toggle("is-running", activeTasksAvailable && activeTasks.length > 0);
  activeTaskRecords = normalizeActiveTaskRecords(result.records);
  mergePendingTasks(
    Array.isArray(result.pendingTasks) ? result.pendingTasks : result.completedTasks
  );
  activeTaskObservedAt = Number.isFinite(result.observedAt) ? result.observedAt : null;

  elements.activeTaskCard.classList.toggle("is-running", activeTasks.length > 0);
  elements.activeTaskCard.classList.toggle(
    "is-single-task",
    activeTasks.length === 1
  );
  elements.activeTaskCard.classList.toggle(
    "is-unavailable",
    !activeTasksAvailable && !pendingTasks.length
  );
  renderStatScopeButtons();
  renderActiveTaskRecords();
  const hiddenTaskCount = Math.max(0, activeTasks.length - 3);
  elements.activeTaskMoreIndicator.hidden = hiddenTaskCount === 0;
  elements.activeTaskMoreIndicator.textContent = hiddenTaskCount
    ? t("activeTaskMore", { count: hiddenTaskCount })
    : "";
  elements.autoRefreshLabel.textContent = t(activeTasks.length ? "autoRefreshActive" : "autoRefresh");
  renderActiveTaskPreview();

  if (activeTasks.length) renderActiveTaskClock();

  if (!elements.activeTaskModal.hidden) renderActiveTaskDetails();
  syncWorkbench();
  startPresentationClock();
}

function openActiveTasks() {
  renderActiveTaskDetails();
  openSecondaryModal(elements.activeTaskModal, elements.activeTaskClose);
}

function closeActiveTasks() {
  closeSecondaryModal(elements.activeTaskModal, elements.activeTaskCard);
}

async function handlePendingTaskAction(event) {
  const button = event.target.closest("[data-pending-task-action]");
  if (!button) return;
  const index = Number(button.dataset.pendingTaskIndex);
  if (!Number.isInteger(index) || !pendingTasks[index]) return;
  const action = button.dataset.pendingTaskAction;
  dismissedPendingTaskIds.add(activeTaskIdentity(pendingTasks[index]));
  pendingTasks.splice(index, 1);
  renderActiveTaskPreview();
  renderActiveTaskDetails();
  const hiddenTaskCount = Math.max(0, activeTasks.length - 3);
  elements.activeTaskMoreIndicator.hidden = hiddenTaskCount === 0;
  elements.activeTaskMoreIndicator.textContent = hiddenTaskCount
    ? t("activeTaskMore", { count: hiddenTaskCount })
    : "";
  if (action === "return") {
    try {
      await window.codexMonitor.focusCodex();
    } catch {}
  }
}

function openResetCredits() {
  openSecondaryModal(elements.resetCreditModal, elements.resetCreditClose);
  requestAnimationFrame(() => positionResetCalendars(elements.resetCreditModal));
}

function closeResetCredits() {
  closeSecondaryModal(elements.resetCreditModal, elements.resetCreditButton);
}

function openTokenUsage() {
  tokenChartSeries = [];
  openSecondaryModal(elements.tokenUsageModal, elements.tokenUsageClose);
  requestAnimationFrame(() => renderTokenUsageModal(false));
}

function closeTokenUsage() {
  closeSecondaryModal(elements.tokenUsageModal, elements.tokenOverview, {
    onClose() {
      cancelAnimationFrame(tokenChartAnimationFrame);
      tokenChartAnimationActive = false;
      hideTokenChartTooltip(false);
    }
  });
}

function openOfficialResetHistory() {
  openSecondaryModal(elements.officialResetHistoryModal, elements.officialResetHistoryClose);
  requestAnimationFrame(() => positionResetCalendars(elements.officialResetHistoryModal));
}

function closeOfficialResetHistory() {
  closeSecondaryModal(elements.officialResetHistoryModal, elements.officialResetButton);
}

function openClientUpdateHistory() {
  renderClientUpdateHistory();
  openSecondaryModal(elements.clientUpdateHistoryModal, elements.clientUpdateHistoryClose);
}

function closeClientUpdateHistory() {
  closeSecondaryModal(elements.clientUpdateHistoryModal, elements.clientUpdateCard);
}

function formatSubscriptionPlan(planType) {
  const normalized = String(planType || "unknown").toLowerCase();
  const names = {
    prolite: "PRO LITE",
    self_serve_business_usage_based: "BUSINESS",
    enterprise_cbp_usage_based: "ENTERPRISE"
  };
  return names[normalized] || normalized.replaceAll("_", " ").toUpperCase();
}

function renderSubscriptionCountdown() {
  if (elements.subscriptionModal.hidden) return;
  const subscription = latestSnapshot?.subscription || {};
  const renewalAt = subscription.renewalAt;
  if (!Number.isFinite(renewalAt)) {
    elements.subscriptionCountdown.textContent = t("subscriptionTimeUnavailable");
    return;
  }
  const remainingSeconds = Math.max(0, Math.floor(renewalAt - Date.now() / 1000));
  if (remainingSeconds <= 0) {
    elements.subscriptionCountdown.textContent = t("subscriptionRenewalDue");
    return;
  }
  const days = Math.floor(remainingSeconds / 86_400);
  const hours = Math.floor((remainingSeconds % 86_400) / 3_600);
  const minutes = Math.floor((remainingSeconds % 3_600) / 60);
  const seconds = remainingSeconds % 60;
  elements.subscriptionCountdown.textContent = t("subscriptionCountdownValue", {
    days,
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0")
  });
}

function renderSubscriptionDetails() {
  const subscription = latestSnapshot?.subscription || {};
  const planType = subscription.planType || latestSnapshot?.data?.planType || "unknown";
  elements.subscriptionPlan.textContent = formatSubscriptionPlan(planType);
  elements.subscriptionAssistedDays.textContent = Number.isFinite(subscription.assistedWorkDays)
    ? t("subscriptionAssistedDays", { count: formatTokenCount(subscription.assistedWorkDays) })
    : t("subscriptionAssistedUnavailable");
  elements.subscriptionExpiry.textContent = Number.isFinite(subscription.expiresAt)
    ? formatDate(subscription.expiresAt, true)
    : t("subscriptionTimeUnavailable");
  elements.subscriptionNote.textContent = Number.isFinite(subscription.expiresAt)
    ? t(subscription.projected ? "subscriptionProjectedNote" : "subscriptionExactNote")
    : t("subscriptionTimeUnavailable");
  renderSubscriptionCountdown();
}

function openSubscription() {
  if (!latestSnapshot?.online || elements.connectionLabel.disabled) return;
  renderSubscriptionDetails();
  openSecondaryModal(elements.subscriptionModal, elements.subscriptionClose);
  requestAnimationFrame(renderSubscriptionCountdown);
  startPresentationClock();
}

function closeSubscription() {
  closeSecondaryModal(elements.subscriptionModal, elements.connectionLabel);
}

function renderConnectionStatusDialog(isOnline = connectionState === "online") {
  elements.connectionStatusModal.classList.toggle("is-online", isOnline);
  elements.connectionStatusModal.classList.toggle("is-offline", !isOnline);
  elements.connectionStatusTitle.textContent = t(
    isOnline ? "connectionOnlineTitle" : "connectionDisconnectedTitle"
  );
  elements.connectionStatusMessage.textContent = t(
    isOnline ? "connectionOnlineMessage" : "connectionDisconnectedIntro"
  );
  elements.connectionIssueList.hidden = isOnline;
}

function openConnectionStatus() {
  if (connectionState === "checking") return;
  renderConnectionStatusDialog();
  openSecondaryModal(elements.connectionStatusModal, elements.connectionStatusDone);
}

function closeConnectionStatus() {
  closeSecondaryModal(elements.connectionStatusModal, elements.connectionStatusButton);
}

function renderOnline(snapshot) {
  const { data } = snapshot;
  connectionState = "online";
  lastQuotaData = data;
  elements.connectionStrip.className = "connection-strip is-online";
  elements.connectionStatusButton.disabled = false;
  elements.connectionStatusButton.title = t("openConnectionStatus");
  elements.connectionStatusButton.setAttribute("aria-label", t("openConnectionStatus"));
  elements.connectionLabel.textContent = t("connected", {
    plan: formatSubscriptionPlan(data.planType)
  });
  elements.connectionLabel.disabled = snapshot.subscription?.available !== true;
  elements.connectionLabel.title = elements.connectionLabel.disabled ? "" : t("openSubscription");
  elements.connectionLabel.setAttribute(
    "aria-label",
    elements.connectionLabel.disabled ? elements.connectionLabel.textContent : t("openSubscription")
  );
  if (!elements.connectionStatusModal.hidden) renderConnectionStatusDialog(true);

  setQuota(
    elements.fiveHourPanel,
    elements.fiveHourReset,
    elements.fiveHourNumber,
    elements.fiveHourProgress,
    elements.fiveHourUsed,
    data.windows.fiveHour,
    !data.windows.fiveHour
  );
  setQuota(
    elements.weeklyPanel,
    elements.weeklyReset,
    elements.weeklyNumber,
    elements.weeklyProgress,
    elements.weeklyUsed,
    data.windows.weekly
  );
  setQuota(
    elements.reservePanel,
    elements.reserveReset,
    elements.reserveNumber,
    elements.reserveProgress,
    elements.reserveUsed,
    data.reserve,
    !data.reserve
  );

  renderWeeklyProjection(data.weeklyProjection);
  renderResetCredits(data.resets, data.events.newReset, data.events.manualReset);
  renderClientUpdate(snapshot.clientUpdate);
  if (!elements.subscriptionModal.hidden) renderSubscriptionDetails();
}

function renderOffline(snapshot) {
  connectionState = "offline";
  renderWeeklyProjection(null);
  elements.connectionStrip.className = "connection-strip is-offline";
  elements.connectionStatusButton.disabled = false;
  elements.connectionStatusButton.title = t("openConnectionStatus");
  elements.connectionStatusButton.setAttribute("aria-label", t("openConnectionStatus"));
  elements.connectionLabel.textContent = t("connectionDisconnectedLabel");
  elements.connectionLabel.disabled = true;
  elements.connectionLabel.removeAttribute("title");
  elements.connectionLabel.setAttribute("aria-label", t("connectionDisconnectedLabel"));
  if (!elements.connectionStatusModal.hidden) renderConnectionStatusDialog(false);
  renderResetCredits(
    lastQuotaData?.resets || {},
    { history: snapshot.receivedResetHistory || receivedResetHistory },
    { history: snapshot.consumedResetHistory || consumedResetHistory }
  );
  renderClientUpdate(snapshot.clientUpdate);
  if (!automaticOfflineAlertShown) {
    automaticOfflineAlertShown = true;
    openConnectionStatus();
  }
}

function updateLastChecked() {
  if (connectionState === "online" && !elements.weeklyProjectionMarker.hidden &&
      latestSnapshot?.data?.weeklyProjection?.fiveResetAt <= Date.now() / 1000) renderWeeklyProjection(null);
  if (!latestSnapshot?.checkedAt) {
    elements.lastChecked.textContent = t("waiting");
    return;
  }
  const minutes = Math.floor((Date.now() - latestSnapshot.checkedAt) / 60_000);
  elements.lastChecked.textContent = minutes < 1 ? t("checkedNow") : t("checkedMinutes", { count: minutes });
}

function render(snapshot) {
  if (snapshot.online) renderOnline(snapshot);
  else renderOffline(snapshot);
  renderCheckpoints(snapshot.resetCheckpoints);
  renderTokenUsage(snapshot.tokenUsage);
  renderTokenCost(snapshot.tokenCost);
  renderActiveTasks(snapshot.activeTasks);
  updateLastChecked();
  syncWorkbench();
}

function applySnapshot(snapshot) {
  if (!snapshot) return;
  const currentTasks = latestSnapshot?.activeTasks;
  latestSnapshot = currentTasks?.observedAt > snapshot.activeTasks?.observedAt
    ? { ...snapshot, activeTasks: currentTasks } : snapshot;
  render(latestSnapshot);
}

function startPresentationClock() {
  const needed = !document.hidden &&
    (activeTasks.length > 0 || !elements.subscriptionModal.hidden || Boolean(currentCheckpointCommitment()));
  if (!needed) {
    if (presentationFrame !== null) cancelAnimationFrame(presentationFrame);
    presentationFrame = null; return;
  }
  if (presentationFrame !== null) return;
  const tick = () => {
    presentationFrame = null;
    const second = Math.floor(Date.now() / 1000);
    if (second !== lastPresentationSecond) {
      lastPresentationSecond = second;
      renderActiveTaskClock();
      if (latestCheckpoints?.commitment) renderCheckpointClock();
      if (!elements.subscriptionModal.hidden) renderSubscriptionCountdown();
      updateLastChecked();
    }
    startPresentationClock();
  };
  presentationFrame = requestAnimationFrame(tick);
}

async function refresh({ initial = false, silent = false } = {}) {
  if (isRefreshing) return false;
  const startedAt = Date.now();
  isRefreshing = true;
  if (!silent) elements.refreshButton.classList.add("is-spinning");
  if (initial) elements.loadingLayer.classList.remove("is-hidden");
  try {
    applySnapshot(await window.codexMonitor.readQuota());
  } catch {
    latestSnapshot = {
      ...latestSnapshot,
      online: false,
      checkedAt: Date.now(),
      errorCode: "NETWORK_ERROR",
      data: null
    };
    render(latestSnapshot);
  } finally {
    isRefreshing = false;
    elements.refreshButton.classList.remove("is-spinning");
    elements.loadingLayer.classList.add("is-hidden");
  }
  return true;
}

async function initialize() {
  const settings = await window.codexMonitor.readSettings();
  language = settings.language === "en" ? "en" : "zh";
  alwaysOnTop = settings.alwaysOnTop === true;
  backgroundDataUrl = settings.backgroundDataUrl || null;
  backgroundOpacity = Number.isFinite(settings.backgroundOpacity) ? settings.backgroundOpacity : .34;
  savedBackgroundOpacity = backgroundOpacity;
  backgroundAppearance = { ...backgroundAppearance, ...settings.appearance };
  savedAppearance = { ...backgroundAppearance };
  elements.pinButton.checked = alwaysOnTop;
  document.getElementById("closeBehavior").value = settings.closeBehavior === "quit" ? "quit" : "tray";
  if (typeof settings.monitorVersion === "string" && /^[0-9][a-zA-Z0-9.+-]{0,49}$/.test(settings.monitorVersion)) {
    elements.appVersion.textContent = "V" + settings.monitorVersion;
    document.getElementById("aboutVersion").textContent = "V" + settings.monitorVersion;
  }
  const savedSort = window.Workbench.restore("cqm2.taskSort", "time");
  elements.taskSort.value = ["time", "cost", "duration"].includes(savedSort) ? savedSort : "time";
  window.Workbench.init({ t, onDiagnose: openConnectionStatus, onNavigate(route) {
    closeTaskDrawer();
    cancelAnimationFrame(tokenChartAnimationFrame); tokenChartAnimationActive = false;
    hideTokenChartTooltip(false);
    if (route.page === "tasks") {
      elements.taskFilter.value = route.tab === "pending" ? "pending" : route.tab === "running" ? "running" : "all";
      renderActiveTaskDetails();
    }
    requestAnimationFrame(() => {
      if (window.Workbench.visible(elements.tokenUsageChart)) renderTokenUsageModal(false);
      if (!elements.tokenCostModal.hidden) renderTokenCostDetails();
      if (!elements.subscriptionModal.hidden) renderSubscriptionDetails();
      drawTokenSparkline(); positionResetCalendars(); startPresentationClock();
    });
  } });
  workbenchReady = true;
  applyLanguage(); applyBackground(); initializeCropper();
  renderClientUpdate(); renderTokenUsage(); renderTokenCost(); renderActiveTasks();
  const click = (id, callback) => document.getElementById(id).addEventListener("click", callback);
  for (const [ids, close] of [
    [["activeTaskClose","activeTaskDone"],closeActiveTasks],
    [["tokenUsageClose","tokenUsageDone"],closeTokenUsage],
    [["tokenCostClose","tokenCostDone"],closeTokenCost],
    [["resetCreditClose","resetCreditDone"],closeResetCredits],
    [["subscriptionClose","subscriptionDone"],closeSubscription],
    [["officialResetHistoryClose","officialResetHistoryDone"],closeOfficialResetHistory],
    [["clientUpdateHistoryClose","clientUpdateHistoryDone"],closeClientUpdateHistory],
    [["resetProbabilityClose","resetProbabilityDone"],()=>window.Workbench.navigate("overview")],
    [["settingsClose"],closeBackgroundPopover],
    [["statScopeClose","statScopeDone"],()=>closeStatScope()],
    [["taskDrawerClose"],closeTaskDrawer]
  ]) for (const id of ids) click(id,()=>close());
  for (const [id, open] of [["connectionStatusButton",openConnectionStatus],["connectionLabel",openSubscription],["resetCreditButton",openResetCredits],["officialResetButton",openOfficialResetHistory],["clientUpdateCard",openClientUpdateHistory],["tokenOverview",openTokenUsage],["activeTaskCard",openActiveTasks],["taskPerformance",openActiveTasks]]) {
    click(id,open);
    const node=document.getElementById(id);
    if (node.tagName !== "BUTTON") node.addEventListener("keydown",event=>{
      if(event.target===node && ["Enter"," "].includes(event.key)){event.preventDefault();open();}
    });
  }
  click("languageButton",async()=>{ language=language === "zh"?"en":"zh"; await window.codexMonitor.setLanguage(language); applyLanguage(); });
  elements.pinButton.addEventListener("change",async()=>{
    try { alwaysOnTop=await window.codexMonitor.setAlwaysOnTop(elements.pinButton.checked); }
    finally { elements.pinButton.checked=alwaysOnTop; }
  });
  document.getElementById("closeBehavior").addEventListener("change",async event=>{
    event.target.value=await window.codexMonitor.setCloseBehavior(event.target.value);
  });
  click("refreshButton",()=>refresh());
  click("connectionStatusDone",closeConnectionStatus);
  click("taskInterruptionDone",closeTaskInterruptionAlert);
  click("resetProbabilityButton",()=>window.Workbench.navigate("quota","forecast"));
  click("resetOfficialLink",openOfficialResetHistory);
  click("checkpointSignalSource",()=>{ const commitment=currentCheckpointCommitment(); if(commitment)window.codexMonitor.openResetSource?.(commitment.sourceUrl); });
  click("checkpointDashboardSource",()=>window.codexMonitor.openResetSource?.(latestCheckpoints?.probabilityMode === "source-experimental"?"https://codex-reset.com/":latestCheckpoints?.sourceUrl));
  click("tokenCostHelp",event=>{ event.stopPropagation(); closeStatScope(()=>openTokenCost()); });
  document.querySelectorAll("[data-stat-scope]").forEach(button=>button.addEventListener("click",event=>{event.preventDefault();event.stopPropagation();openStatScope(button);}));
  click("confirmAllTasks",()=>{confirmAllCompletedTasks();syncWorkbench();});
  elements.activeTaskList.addEventListener("click",event=>{
    const detail=event.target.closest("[data-task-detail-id]");
    if(detail){selectedTaskIdentity=detail.dataset.taskDetailId;renderTaskDrawer();elements.taskDetailDrawer.hidden=false;elements.taskDrawerClose.focus();return;}
    handlePendingTaskAction(event);
  });
  elements.taskFilter.addEventListener("change",renderActiveTaskDetails);
  elements.taskSearch.addEventListener("input",renderActiveTaskDetails);
  elements.taskSort.addEventListener("change",()=>{window.Workbench.remember("cqm2.taskSort",elements.taskSort.value);renderActiveTaskDetails();});
  click("fullCostScan",async()=>{
    if(elements.fullCostScan.disabled)return;elements.fullCostScan.disabled=true;
    try{
      const cost=await window.codexMonitor.rescanCost();
      if(latestSnapshot)latestSnapshot={...latestSnapshot,tokenCost:cost,tokenUsage:window.TokenUsage.combineTokenUsage(latestSnapshot.tokenUsage,cost)};
      renderTokenUsage(latestSnapshot?.tokenUsage);renderTokenCost(cost);
    }catch{elements.costScanProgress.textContent=t("costScanFailed");elements.fullCostScan.disabled=false;}
  });
  elements.tokenPeriodSwitch.addEventListener("click",event=>{
    const button=event.target.closest("[data-token-period]");
    if(!button || button.dataset.tokenPeriod===tokenPeriod)return;
    tokenPeriod=button.dataset.tokenPeriod;renderTokenUsageModal(true);
  });
  elements.tokenUsageChart.addEventListener("pointermove",updateTokenChartTooltip);
  elements.tokenUsageChart.addEventListener("pointerleave",()=>hideTokenChartTooltip());
  const chooseBackgroundFile=async()=>{
    elements.backgroundError.hidden=true;
    try{const result=await window.codexMonitor.chooseBackground();
      if(result?.error){showBackgroundError(result.error === "FILE_TOO_LARGE"?"backgroundTooLarge":"backgroundInvalidDimensions");return;}
      if(result?.dataUrl)await importBackground(result.dataUrl);
    }catch{showBackgroundError("unsupportedImage");}
  };
  click("chooseBackground",chooseBackgroundFile);click("backgroundDropZone",chooseBackgroundFile);
  elements.backgroundDropZone.addEventListener("keydown",event=>{if(["Enter"," "].includes(event.key)){event.preventDefault();chooseBackgroundFile();}});
  for(const eventName of ["dragenter","dragover","dragleave","drop"])elements.backgroundDropZone.addEventListener(eventName,event=>{
    event.preventDefault();event.stopPropagation();
    elements.backgroundDropZone.classList.toggle("is-dragging",eventName === "dragenter" || eventName === "dragover");
    if(eventName === "drop")readDroppedImage(event.dataTransfer?.files?.[0]);
  });
  document.addEventListener("dragover",event=>event.preventDefault());document.addEventListener("drop",event=>event.preventDefault());
  click("editBackground",async()=>{const source=await window.codexMonitor.readBackgroundSource();if(source)openCropper(source);});
  click("clearBackground",async()=>{await window.codexMonitor.clearBackground();backgroundDataUrl=null;applyBackground();});
  elements.opacitySlider.addEventListener("input",event=>{backgroundOpacity=Number(event.target.value)/100;applyBackground();});
  const bindings={backgroundX:"x",backgroundY:"y",backgroundZoom:"zoom",backgroundBlur:"blur",backgroundVeil:"veil",cardOpacity:"cardOpacity"};
  for(const [id,key]of Object.entries(bindings))document.getElementById(id).addEventListener("input",event=>{backgroundAppearance[key]=Number(event.target.value);applyBackground();});
  document.getElementById("backgroundFit").addEventListener("change",event=>{backgroundAppearance.fit=event.target.value;applyBackground();});
  document.getElementById("allowBackgroundUpscale").addEventListener("change",event=>{backgroundAppearance.allowUpscale=event.target.checked;applyBackground();});
  document.getElementById("reducedTransparency").addEventListener("change",event=>{backgroundAppearance.reducedTransparency=event.target.checked;applyBackground();});
  click("applyAppearance",async()=>{
    const button=document.getElementById("applyAppearance");button.disabled=true;
    try{
      backgroundAppearance=await window.codexMonitor.setAppearance(backgroundAppearance);
      backgroundOpacity=await window.codexMonitor.setBackgroundOpacity(backgroundOpacity);
      savedAppearance={...backgroundAppearance};savedBackgroundOpacity=backgroundOpacity;
      applyBackground();document.getElementById("appearanceStatus").textContent=t("appearanceSaved");
    }catch{document.getElementById("appearanceStatus").textContent=t("appearanceSaveFailed");}
    finally{button.disabled=false;}
  });
  click("cancelAppearance",()=>{backgroundAppearance={...savedAppearance};backgroundOpacity=savedBackgroundOpacity;applyBackground();document.getElementById("appearanceStatus").textContent="";});
  const update=await window.codexMonitor.readMonitorUpdate?.();renderMonitorUpdate(update);
  click("monitorUpdateCheck",async()=>renderMonitorUpdate(await window.codexMonitor.checkMonitorUpdate()));
  click("monitorUpdateInstall",async()=>{elements.monitorUpdateInstall.disabled=true;try{await window.codexMonitor.installMonitorUpdate();}finally{elements.monitorUpdateInstall.disabled=false;}});
  rendererUnsubscribers.push(window.codexMonitor.onMonitorUpdate?.(renderMonitorUpdate));
  rendererUnsubscribers.push(window.codexMonitor.onRefresh(()=>refresh()));
  rendererUnsubscribers.push(window.codexMonitor.onAlwaysOnTop(enabled=>{alwaysOnTop=enabled;elements.pinButton.checked=enabled;}));
  unsubscribeSnapshot=window.codexMonitor.onSnapshot?.(snapshot=>{if(!isRefreshing)applySnapshot(snapshot);});
  unsubscribeTasks=window.codexMonitor.onTasks?.(result=>{
    if(latestSnapshot?.activeTasks?.observedAt>result.observedAt)return;
    if(latestSnapshot)latestSnapshot={...latestSnapshot,activeTasks:result};renderActiveTasks(result);
  });
  unsubscribeCheckpoints=window.codexMonitor.onCheckpoints?.(checkpoint=>{if(latestSnapshot)latestSnapshot={...latestSnapshot,resetCheckpoints:checkpoint};renderCheckpoints(checkpoint);});
  rendererUnsubscribers.push(window.codexMonitor.onCost?.(cost=>{
    if(latestSnapshot)latestSnapshot={...latestSnapshot,tokenCost:cost,tokenUsage:window.TokenUsage.combineTokenUsage(latestSnapshot.tokenUsage,cost)};
    renderTokenUsage(latestSnapshot?.tokenUsage);renderTokenCost(cost);
  }));
  chartResizeObserver=new ResizeObserver(()=>{
    requestAnimationFrame(()=>{if(window.Workbench.visible(elements.tokenUsageChart))renderTokenChart(false);drawTokenSparkline();layoutCropper(true);applyBackground();});
  });
  chartResizeObserver.observe(document.getElementById("workspaceContent"));chartResizeObserver.observe(elements.cropStage);
  document.addEventListener("keydown",event=>{
    if(event.key === "F5"){event.preventDefault();refresh();return;}
    const modal=[...document.querySelectorAll('[aria-modal="true"]')].find(node=>!node.hidden && !node.inert);
    if(event.key === "Tab" && modal){
      const controls=[...modal.querySelectorAll('button,input,select,[tabindex="0"]')].filter(node=>!node.disabled && window.Workbench.visible(node));
      const first=controls[0],last=controls.at(-1);
      if(event.shiftKey && (document.activeElement===first || !modal.contains(document.activeElement))){event.preventDefault();last?.focus();}
      else if(!event.shiftKey && (document.activeElement===last || !modal.contains(document.activeElement))){event.preventDefault();first?.focus();}
    }
    if(event.key!=="Escape")return;
    if(!elements.cropModal.hidden){if(!elements.cropApply.disabled)closeCropModal();}
    else if(!elements.statScopeModal.hidden)closeStatScope();
    else if(!elements.taskInterruptionModal.hidden)closeTaskInterruptionAlert();
    else if(!elements.connectionStatusModal.hidden)closeConnectionStatus();
    else if(!elements.taskDetailDrawer.hidden)closeTaskDrawer();
  });
  for(const [node,close]of [[elements.connectionStatusModal,closeConnectionStatus],[elements.statScopeModal,()=>closeStatScope()],[elements.cropModal,()=>{if(!elements.cropApply.disabled)closeCropModal();}]])node.addEventListener("click",event=>{if(event.target===node)close();});
  document.addEventListener("visibilitychange",()=>{if(document.hidden){cancelAnimationFrame(tokenChartAnimationFrame);tokenChartAnimationActive=false;}startPresentationClock();});
  window.addEventListener("online",()=>refresh({silent:true}));window.addEventListener("offline",()=>refresh({silent:true}));
  await refresh({initial:true});startPresentationClock();
}

window.addEventListener("DOMContentLoaded",()=>initialize().catch(()=>{
  console.error("Workspace initialization failed");
  elements.loadingLayer.classList.add("is-hidden");elements.connectionLabel.textContent=t("connectionDisconnectedLabel");
}));
window.addEventListener("beforeunload",()=>{
  unsubscribeSnapshot?.();unsubscribeTasks?.();unsubscribeCheckpoints?.();rendererUnsubscribers.forEach(unsubscribe=>unsubscribe?.());
  chartResizeObserver?.disconnect();if(presentationFrame!==null)cancelAnimationFrame(presentationFrame);cancelAnimationFrame(tokenChartAnimationFrame);
});

---
name: dashi-ppt
description: 制作 PPT、演示文稿、幻灯片、汇报材料时使用。Dashi PPT 基于预置视觉主题组合页面,生成可离线打开、可在浏览器编辑的 HTML 演示,支持导出 PPTX / PDF 文件。
---

# Dashi PPT

Dashi PPT 生成静态 HTML 横向翻页 PPT。使用本 skill 时,先把用户的自然语言需求整理成 JSON 计划,再调用本地项目生成器输出 `index.html` 和 `assets/`。

> **高校场景先看这里**:用户要做毕业答辩 / 学位论文答辩 / 开题报告 / 中期检查 / 课程汇报 / 组会汇报 / 文献精读 / 读书分享,或提到了自己的学校、学院、导师——主题直接用 `campus` 高校版,**不用再让用户选风格**。生成只按「使用规则」里 `campus` 那几条做(**直接手写 `goal.json`**,见「campus 稿的生成流程」),本文其余讲「标准 3+1 / PageContentPack / `goal:scaffold` / v4 bespoke」的章节对 campus 都不适用,不用读、不用执行。用户说了「不用问我」「直接生成」「你来定」就不再提问:题目、姓名、学校、导师等用户给的照写,没给的(日期、页数、数据)自己定,并在交付说明里列出假设。


## 版本

当前版本: `0.4.14`

每次完成用户请求、准备最终回复前,运行:

```bash
node <skill-root>/scripts/check_latest_version.mjs
```

如果脚本有输出,把输出内容附在最终回复末尾提醒用户更新;如果脚本无输出或检查失败,保持静默,不要提版本检查。

## Skill 目录

当前 `SKILL.md` 所在目录就是 Skill 根目录,下文记为 `<skill-root>`。

内置生成器目录:

`<skill-root>/project`

渲染脚本:

- macOS / Linux: `<skill-root>/scripts/render_goal_deck.sh`
- Windows PowerShell: `<skill-root>/scripts/render_goal_deck.ps1`

版本检查脚本:

`<skill-root>/scripts/check_latest_version.mjs`

## 生成原则

本 Skill 为每个逻辑页生成 3 个模板方案和 1 个 Agent 定制方案,输出可离线打开的 HTML PPT。

前三个模板方案使用“锁模板填文案”:保留所选页面组件的原始视觉、结构、数量、显隐、强调、配色、图表类型和图片槽位,只替换可见文字内容。除非用户明确要求调整页面属性,不要改任何非文案 props。第四个方案由 Agent 在当前主题视觉语言内按本页内容定制,不属于模板候选。

成果验收是默认流程。每次生成后都要判断最终产物是否达到用户目标;默认检查目标、内容、结构、明显可见问题和交付完整性,不做截图审美精修,不因普通断行反复返工。用户明确要求“视觉精修”“100% 检查”“帮我调到满意”时,再扩展为视觉 QA。

## 使用规则

- 运行生成器需要 Node.js 20+ 和 npm;首次生成时渲染脚本会在 Skill 内置 `project/` 目录安装依赖。Windows 用 `render_goal_deck.ps1`(直接 PowerShell,不经 WSL/bash);macOS / Linux 用 `render_goal_deck.sh`。
- 风格选择提问:用户可见回复必须嵌入 `<skill-root>/assets/skill/theme-style-grid.png` 的 Markdown 图片,先展开绝对路径;这是回复展示用内置风格图,不可写入 `goal.json` 或任何 media 字段;列出当前可选风格和极简“适合/人群”,不能只在内部进度提示中提到风格图。
- 开工前确认两件事:主题风格、是否需要图片/视频。用户未明确表达且非整体委托时,先提问等答复,不得代选;无法提问的环境(脚本/批处理)才自选,并在交付说明中列出所选与理由。
- 委托模式:仅当用户对整体明确委托(“都你来定”“不用问,直接开干”“不用问我,直接生成”)时,才自选主题、默认 HTML、默认不使用 image-gen,最终说明假设。用户只说内容/文案“随意”“自拟”时,仅自拟内容;风格、页数、媒体等已给的不得擅自改变,未给的按上一条先问。
- 非交互/一次性执行(无法追问)时:未指定风格按内容主题自选已验收主题;无真实素材且不能生图时优先选无媒体页,不调 image-gen;最终说明全部假设。
- Deck 语言跟随用户沟通语言:非中文用户在 `goal.json` 顶层加 `"language": "en"`;全部文案字段用目标语言撰写,页面自带的默认中文文案(含结尾页“感谢阅读”类装饰字段)一律覆盖,不得残留中文。编辑器界面语言自动跟随打开者的系统语言,右上角可手动切换,无需在生成时处理。
- 交付格式:默认 HTML;“生成 PPT”“做 PPT”“做一个 PPT”“制作 ppt”表示 PPT 呈现形态。只有明确 `PPTX`、`PowerPoint`、`可编辑 PPTX`、`导出 PPTX`、`PPT 格式` 或“格式/文件类型为 PPT/PPTX”时才交付 PPTX 文件。
- PPTX 文件:仍先生成 HTML 并启动本机预览服务,再调用本机 HTTP 导出服务;最终只给 PPTX 文件路径或下载结果。
- 当前可选风格: `theme01` 轻拟态风、`theme02` 炫光紫绿风、`theme03` 深浅代码风、`theme04` 玻璃糖果风、`theme05` 色谱图表风、`theme06` 深色图谱风、`theme07` 冷白调研风、`theme08` 黑金实验风、`theme09` 深蓝杂志风、`theme10` 金色指数风、`theme11` 高能增长风、`theme12` 声波霓虹风、`campus` 高校版。
- 普通自动选择不选 `theme10`;只有用户明确指定,或金融/投资指数内容强相关且 inspect 确认可填时才用。
<!-- theme-choice-hints:start -->
  - `theme01` 轻拟态风 | 适合: 产品介绍 / 企业汇报 | 人群: 创业团队 / 产品经理
  - `theme02` 炫光紫绿风 | 适合: 科技发布会 / AI/自动驾驶/机器人主题 | 人群: 科技公司创始人 / 技术负责人
  - `theme03` 深浅代码风 | 适合: 技术方案 / 开发者大会 | 人群: 工程师 / 技术管理者
  - `theme04` 玻璃糖果风 | 适合: 年轻化品牌 / 消费产品 | 人群: 品牌团队 / 设计师
  - `theme05` 色谱图表风 | 适合: 数据报告 / 市场分析 | 人群: 数据分析师 / 咨询顾问
  - `theme06` 深色图谱风 | 适合: 高密度数据展示 / 战略分析 | 人群: 战略团队 / 投资人
  - `theme07` 冷白调研风 | 适合: 调研报告 / 白皮书 | 人群: 研究机构 / 咨询团队
  - `theme08` 黑金实验风 | 适合: 高端发布 / 品牌提案 | 人群: 高端品牌 / 创意总监
  - `theme09` 深蓝杂志风 | 适合: 品牌故事 / 人物访谈 | 人群: 公关团队 / 媒体编辑
  - `theme10` 金色指数风 | 适合: 金融数据 / 投资报告 | 人群: 投资机构 / 金融分析师
  - `theme11` 高能增长风 | 适合: 增长复盘 / 商业计划 | 人群: 创业者 / 增长团队
  - `theme12` 声波霓虹风 | 适合: 音乐娱乐 / 潮流活动 | 人群: 娱乐品牌 / 活动策划
  - `campus` 高校版 | 适合: 毕业答辩 / 开题报告 | 人群: 高校学生 / 教师
<!-- theme-choice-hints:end -->
- `campus` 高校版遵循新主题标准(`docs/theme-standard.md`):页面 key 是 `campus_<id>`(如 `campus_temp_cover`),选页只认页面声明的角色;goal 顶层可写 `brand`(校名 `name` / `nameEn`、校徽 `mark` / `logo`(及 `logoHasName` / `logoPlate` 两个布尔开关)、页眉页脚 `headerNote` / `footerNote`、高亮色(校色)`accent`、章节导航 `chapters`,以及外观开关 `fill`:`gradient`|`solid`、`nav`:`band`|`tabs`|`rail`|`inline`|`slant`|`underline`|`cells`|`folder`|`solid`|`steps`、`titleStyle`:`ribbon`|`bar`|`wing`,都可省略,第一个取值是默认值),整份 deck 的校名、章节导航、高亮色和外观都从这里读,旧主题忽略它。
  - **campus 稿的生成流程(与其他主题不同,必须按这个做)**:campus **不走**下文的「标准 3+1 / PageContentPack / `goal:scaffold` / contentMap / projection」流程——那套的自动选页和结构投影是给其他主题设计的,用在 campus 上会选错页(封面、目录被换成别的页)、内容也投影不进去。campus 稿**直接手写 `goal.json`**:
    1. 顶层写 `"themePack": "campus"`、`title` / `goal` / `audience` / `owner`、`randomSeed`、`brand`(见下面几条)和 `slides`;**不写 `schemaVersion`**。
    2. `slides` 每页一个对象 `{"layout": "campus_<id>", "props": {...}}`,一页只写这一个 layout:第 1 页固定 `campus_temp_cover`(封面),第 2 页 `campus_temp_agenda`(目录),最后一页 `campus_temp_closing`(结语);中间各页按下面的「campus 选页对照」逐页指定页面,不要用 `layout:query` 的自动排序结果替代对照表(它会把特色页排在对口页面前面)。
    3. 封面 props:`kicker`(场景名,如「本科毕业论文答辩」)、`title`(题目)、`presenterLabel` / `presenter`(答辩人)、`advisor`(指导教师)、`unit`(学院 / 单位)、`date`;目录 props:`itemCount` + `items[]`(每项 `no` / `title` / `note`(英文小标,可省)/ `desc`(一句说明,可省)),条目与 `brand.chapters` 的章节一一对应(致谢、参考文献不进目录、不单独成章,`chapterIndex` 写最后一章)。结语页 `title` 写 4–6 个字(如「谢谢聆听」),长句放 `subtitle`。
    4. 写每个内容页的 props 前,先运行 `npm --prefix <skill-root>/project run inspect:layout -- --brief campus_<id> campus_<id> …`(可以一次列出本稿要用的全部页面,每页只有几行:字段名、括号里是字数上限、数组每项的键和条数范围、数量控件、开关和可选值、图片位;`--compact` 是完整 JSON,一般用不到);文案不要超过括号里的字数上限,超了渲染会报错;数组条数要和对应的数量控件一致(例如 `items` 写 4 条就同时写 `"itemCount": 4`);每个内容页都写 `chapterIndex`(属于第几章,1 起)、`sectionNo`(如 `"2.1"`)和 `title`。**不要去读组件源码**,`inspect:layout` 和样例足够。
    5. 完整样例随技能提供:`<skill-root>/references/examples/campus-thesis-defense-xmu.json`(带学校的 9 页短稿,先看这份)、`<skill-root>/references/examples/campus-thesis-defense-engineering.json`(工科毕业答辩)、`<skill-root>/references/examples/campus-thesis-defense-management.json`(经管文科毕业答辩)、`<skill-root>/references/examples/campus-proposal-defense.json`(硕士开题)——照它们的写法写。
    6. 写完直接用渲染脚本渲染,脚本会做校验;报错按提示改对应页的 props。面向用户的稿子每个可见文案字段都要写成真实内容,不能留默认演示文案。
    7. **没有图片时不要留空图位**:用户没给图片就不写 `images`,并把这一页的图位关掉——`--brief` 的「控件」里凡是图位相关的开关 / 选项都选「不显示」(例如 `campus_background_figure` 写 `"imageSide": "none"`、`campus_feasibility` 写 `"mediaAt": "none"`、`campus_case_study` / `campus_acknowledgement` 写 `"showPhoto": false`;`mediaMode` 是 `auto` 的图示页不写图片会自动原生绘制,不用管);关不掉图位的页(`figure_matrix`、`screenshot_grid`、`annotated_figure`、`stage_figures`、`timeline_figures`、`image_text_split`、`paper_card`(左侧论文首页)、`chapter_opener`(右侧实景照片)等,`--brief` 的「图片」行会写「这页的图位关不掉」)在没有图片时不要选,换成对照表里同类的无图页面。`caption` / `source` 这类图注字段在关掉图位后不用写,不要写「配图位:请替换」之类的占位话。
    8. **没有真实数据 / 文献时**:用户没给实验数据、案例数据而又让你自拟时,数字写成合理的示意值,并在这一页的备注类字段(图注、表注、结论条)里标「示意数据」,交付说明里提醒用户替换;没有真实参考文献就不做 `references_list` 页,研究现状页写研究方向 / 方法流派而不是编造的作者和年份;不要出现「学者 A」「示例同学」「XX」这类占位名字。**人名不要编**:用户没给导师、答辩人、合作者的姓名就不写这个字段(封面会自动隐藏或留空),不要自己起一个名字填上去。
    9. **交付**:生成后把预览地址给用户。用户要 PPTX 时(或在豆包这类带右侧工作台的 Agent APP 里交付时),**由你运行导出命令**:在 `<skill-root>/project` 下 `npm run export:pptx -- <本次输出目录>/ppt <本次输出目录>/<题目>.pptx`,选了学校的稿子第一次导出会先下载该校原生模板,命令超时设 10 分钟以上;然后把这个 PPTX 文件作为文件交付给用户(发文件卡片 / 在右侧工作台打开)——这样用户点开就能在右侧工作台里查看和编辑。不要只让用户自己去预览页里点「导出」:预览页的「导出」按钮下载的文件不会出现在对话和工作台里(本地电脑上点「立即查看」是弹出独立窗口,云电脑里这个按钮用不了)。
    下文凡是讲「3 个模板方案 / v4 bespoke / contentMap / projection / PageContentPack / `--layout-variants`」的规则,都不适用于 campus。
  - 外观开关:`fill` 渐变 / 纯色实底;`nav` 顶部通栏章节标签 / 顶部胶囊标签 / 左侧竖栏 / 并进标题行 / 斜切标签 / 下划线 / 平铺方格 / 文件夹页签 / 深色通栏胶囊 / 进度步骤(用户也能在预览面板「全稿外观」里直接切换);`titleStyle` 书签箭头 / 竖条 / 圆徽。用户没提就不写。页眉的章节标签每页固定显示:**campus 稿必须写 `chapters`**(2–6 个,按稿子的真实章节,每项 4–6 字为宜、不超过 8 字),并给每个内容页设 `chapterIndex`(当前第几章,1 起);不写 `chapters` 会显示占位的通用章节名。
  - 学校信息(用户说「我是 XX 大学的」时):`name` 写学校中文全称;`nameEn` 只在确知官方英文名时写(建议全大写),不确定就问用户,不要编;`footerNote` 写「XX大学 · XX学院 · 本科毕业论文答辩」这类(不写时页脚默认用「校名 · 学院名称」占位,带出校名;选了 `school` 的见下条);`mark` 一般不写(默认取校名首字)。`accent` 用用户给的校色;用户没给时不要凭记忆猜具体学校的标准色,保持默认并告诉用户可以在预览面板「学校信息 → 校色」里改。过浅 / 过暗 / 接近灰的校色会被主题自动规整成白字看得清的深浅(面板里会提示调整后的色值)。
  - 学校 LOGO:**只用用户提供的图片文件,不联网下载、不自己画**。先 `npm --prefix <skill-root>/project run media:stage -- <deck 的 ppt 目录> <logo 文件>`,把返回的 `relative`(`assets/user-media/<hash>.png`)写进 `brand.logo`;横向的「校徽 + 校名」组合标(宽高比约 2.2 以上)同时写 `"logoHasName": true`(页眉只显示 LOGO,不再画文字校名);白色 / 浅色 LOGO 写 `"logoPlate": false`(深色页眉上不垫白底),并提醒用户白色页眉样式上会看不清、最好再给一个深色版本。没有 LOGO 就不写 `logo`,显示文字校徽。用户也可以在预览面板「学校信息」里改校名、拖入 LOGO、换校色,改动全稿生效、自动保存。
  - 学校定制封面目录(`brand.school`):用户的学校在下面 12 所之中就写 key——`sjtu` 上海交通大学、`scu` 四川大学、`sysu` 中山大学、`henu` 河南大学、`seu` 东南大学、`thu` 清华大学、`pku` 北京大学、`zju` 浙江大学、`whu` 武汉大学、`xmu` 厦门大学、`ynu` 云南大学、`neu` 东北大学;封面 `campus_temp_cover`、目录 `campus_temp_agenda` 换成这所学校的定制设计(3D 建筑 / 校园视频),`name` / `nameEn` / `logo` / `accent` 不写时自动取学校的,不要另写。**不在其中就不写 `school`**(不要借用别校),用通用封面目录,照样可以写 `name` / `nameEn` / `accent` / `logo`。选了学校时 `footerNote` 一般不写:正文页页脚自动显示「校名 · 单位」(封面写了 `unit` 时)或只显示校名。
    - 封面只写通用字段:`title`(完整论文题目,40 字以内,不要为凑字数删改)、`kicker`(场景名,如「本科毕业论文答辩」「硕士学位论文开题答辩」)、`presenterLabel` / `presenter`(答辩人)、`advisor`(导师,如「王建华 教授」)、`unit`(学院 / 单位)、`date`;`subtitle` 有就写。`keyword`、`motto`、`titleEn`、`coverVariant` 都不写:变体按标题长度自动选(原版 / 长标题版 / 关键词大字版);关键词版的大字按场景名自动推短词(含「开题」→ 开题报告;中期 → 中期检查;博士 / 硕士 + 答辩 → 学位答辩;答辩 → 毕业答辩;汇报 → 学习汇报;课程 / 课堂 → 课程汇报;读书 → 读书分享;文献 / 精读 → 文献精读;组会 → 组会汇报;分享 → 主题分享),推不出来才用学校自己的短语,完整题目放到副标题位置。目录写 2–6 条 `items[]`:`title`(4–10 字)、可选英文小标 `note` 和一句 `desc`(16 字内),条目数决定版式。
    - 各校通用字段的落点(没列的字段照常显示;「不显示」的字段写了也看不到,需要时请用户改在别处):`sjtu` 封面只有题目 + 副标题,场景 / 答辩人 / 导师 / 单位 / 日期不显示;`scu` 导师、单位并进通栏下方一行,题目超过 11 字时通栏放场景名、题目放副标题行(此时 `subtitle` 不显示);`sysu` 答辩人 · 导师 · 日期在胶囊里,`subtitle`、`unit` 不显示;`henu` 四栏信息依次是答辩人 / 导师 / 单位 / 日期;`seu` 图签栏写场景、题目、导师、答辩人、日期,`unit` 不显示;`thu` 答辩人 / 导师 / 单位 / 日期并进左下地点胶囊;`pku` 答辩人 / 导师 / 单位 / 日期在请柬「英文」行(两行);`zju` 底部四个槽位按图标固定:奖杯 = 场景(副标题为空时场景显示在副标题行)、团队 = 答辩人 + 导师、学院 = 单位、日历 = 日期,空的槽位隐藏;`whu` 答辩人 / 导师 / 日期在封面页脚,`unit` 不显示;`xmu` 答辩人 / 导师 / 日期在讲堂信息行,`unit` 不显示;`ynu` 答辩人 / 导师 / 单位 / 日期在信息胶囊;`neu` 导师并进「寄自」一行。
    - **导出 PPTX 时,选了学校的稿子封面 / 目录会换成设计师的原生页(带 3D 建筑模型 / 校园视频,这是高校版的核心亮点)**:导出命令发现本机没有这所学校的原生模板,会自动下载这一所的模板(45–90 MB,只在第一次导出这所学校时下载,日志里有「正在下载 XX 大学的原生封面模板 n%」),所以**导出命令要给足时间(至少 10 分钟),看到下载进度不要中断、不要改用别的导出方式**。是否换成功以导出结果里的提示为准:提示「已换成学校原生页」→ 告诉用户封面 / 目录带 3D 模型或视频、在 PowerPoint 里可以旋转模型 / 播放视频并有平滑切换,文件约 50–90 MB,装了设计字体标题才完全还原(清华只有封面是原生页);提示「找不到…原生模板」→ 说明这次模板没下载下来,封面 / 目录是静态画面(文字可编辑),并再导出一次重试,仍不行就如实告诉用户。导出提示里列出的「字段被缩小 / 可能溢出」要转告用户。不选学校(通用封面)的稿子没有原生页,不涉及下载。
    - 还没做完定制设计的学校,封面目录暂时是通用版,校名、校徽、校色照常带出。用户也可以在预览面板「学校信息 → 学校」里选。
  - `campus_status_table` 的 `rows[].status` 直接写状态词,徽标外观按词表自动对应:完成 已完成/完成/已达成/达成/已实现/通过/已结题/已发表/已录用;超额 超额完成/超额/超额达成/提前完成/超出预期;进行中 进行中/推进中/在研/部分完成/已启动/待发表/在投;未开始 未开始/待开展/计划中/待启动/未完成;风险 高/高风险/较高/严重、中/中风险/中等/一般、低/低风险/较低/轻微。词表外的词显示为中性灰。
  - `campus_formula_notes` 的 `formulas[].expr` / `totalExpr` / `terms[].expr` 写 LaTeX 子集:`x_i`、`x^{2}`、`\frac{a}{b}`、`\sqrt{x}`、`\sum_{i=1}^{n}`、`\hat{x}`、`\text{SSIM}`、`\mathbf{x}`、`\hl{…}`(高亮关键项)、希腊字母与 `\nabla` `\odot` `\cdot` `\times` `\le` `\approx` `\|`;多字母上下标写花括号,如 `T_{urban}`、`x_{k-1}`;JSON 里反斜杠写成 `\\`。复杂公式改给公式截图:写 `props.images`,自动切到图片模式。
  - `campus_figure_matrix` 用「图片数量 `figureCount` + 列数 `colCount`」排网格(行数 = 张数 ÷ 列数向上取整,如 6 张 3 列 = 2×3);`images`、`figures` 按张数,`cols` 按列数,`rows` 按行数写。
  - **campus 选页对照**(答辩常见内容 → 推荐页面;表里省略 `campus_` 前缀)。候选仍以 `layout:query --role` 为准,内容明显属于下表某一类时,优先选对口的页面,或在 goal 里直接指定 layout:

    | 答辩内容 | 推荐页面 |
    | --- | --- |
    | 章节过渡 | `chapter_opener` |
    | 研究背景 | `background_figure`(成段文字 + 配图,可带数字开场);现象列举 `lead_quotes_subject`;关键数字 `metric_grid` |
    | 研究意义 / 概念 | `significance_cards`、`key_statement` |
    | 国内外研究现状 | `domestic_abroad`(国外 / 国内两栏 + 研究述评)、`literature_table`(学者 × 方法表 + 本文切入点)、单篇文献 `paper_card`(要有论文首页截图;没有时文献概况用 `metric_grid`) |
    | 研究内容总览 / 研究问题 | `problem_work_map`(问题 → 本文工作 → 研究目标)、`objective_contents`(总目标 + 内容卡)、`parallel_columns` |
    | 论文结构 / 章节安排 | `thesis_structure` |
    | 研究思路 / 技术路线 | `tech_route`(分层分支路线图)、`method_roadmap`(方法清单 + 步骤)、`flow_chain` |
    | 理论框架 / 研究假设 | `variable_model`(X → M → Y + 假设清单)、`layer_pyramid`、`hub_spokes` |
    | 系统架构 / 功能模块 | `layer_architecture`、`tree_structure` |
    | 业务流程 / 算法流程 | `swimlane_flow`(多角色)、`decision_flow`(带判断分支)、`flow_chain`、`cycle_loop` |
    | 模型结构 / 原理示意 | `model_pipeline`(算法类常连续多页)、`annotated_figure`(大图 + 编号标注)、`stage_figures`(原理图 → PCB → 实物) |
    | 数据库设计 | `er_schema` |
    | 公式 | `formula_notes` |
    | 实验设置 / 数据集 | `setup_tables` |
    | 定量对比 | `experiment_compare`、`bar_chart_insight`、`data_table` |
    | 训练 / 参数曲线 | `curve_grid`(2–6 张小图)、`line_chart_compare` |
    | 消融实验 | `ablation_table` |
    | 定性结果图 | `figure_matrix`、`finding_figure`、`figure_gallery` |
    | 混淆矩阵 / 相关系数 | `heatmap_matrix` |
    | 优化前后 | `before_after`、`versus_compare` |
    | 系统实现截图 | `screenshot_grid`、`image_text_split` |
    | 功能 / 性能测试 | `test_cases` |
    | 问卷结果 | `survey_bars`;占比 `donut_breakdown` |
    | 回归 / 描述性统计 | `stats_table` |
    | 案例分析 | `case_study` |
    | 问题 → 原因 → 对策 | `cause_countermeasure`;两列成对 `paired_rows` |
    | 方案比较 / 技术选型 | `option_matrix`、`versus_compare`、`quadrant_matrix` |
    | 创新点 | `innovation_points` |
    | 结论 / 总结与展望 | `summary_outlook`、`numbered_list`、`key_statement` |
    | 可行性分析 | `feasibility` |
    | 进度安排 | `schedule_table`(表格式,开题常用)、`gantt_schedule`(横条)、`timeline_milestones` |
    | 研究基础 / 发展历程 | `timeline_figures`(节点带图)、`timeline_milestones` |
    | 预期成果 | `expected_outcomes` |
    | 科研成果 / 获奖 | `achievement_list`、`honor_wall` |
    | 经费预算 / 决算 | `budget_table` |
    | 申报 / 结题完成情况 | `status_table` |
    | 团队 | `team_lead`(负责人 + 骨干)、`team_members`(等权并列) |
    | 个人简介(奖项答辩) | `profile_metrics`、`radar_profile`、`project_cards` |
    | 评审 / 盲审意见、答辩问答 | `review_comments`、`qa_response` |
    | 参考文献 | `references_list` |
    | 致谢 | `acknowledgement` |

    按稿件类型的典型页面顺序(封面、目录、结语之外):
    - 本科毕设 · 工科系统:`background_figure` → `domestic_abroad` / `literature_table` → 技术选型 `option_matrix` → `layer_architecture` → `tree_structure` → `swimlane_flow` / `decision_flow` → `er_schema` → `screenshot_grid`(每个功能模块一页)→ `test_cases` → `summary_outlook` → `acknowledgement`。硬件类在系统设计后加 `stage_figures`。
    - 本科毕设 · 算法实验:`background_figure` → `literature_table` → `problem_work_map` → `model_pipeline`(可连续多页)→ `formula_notes` → `setup_tables` → `curve_grid` → `experiment_compare` → `ablation_table` → `figure_matrix` / `finding_figure` → `summary_outlook` → `acknowledgement`。实验章占全稿三到四成。
    - 本科毕设 · 经管文科:`background_figure` → `significance_cards` → `domestic_abroad` → `thesis_structure` → `variable_model`(实证类)或 `method_roadmap` → `case_study` → `cause_countermeasure`(可 2–3 页)→ `survey_bars` / `stats_table`(有数据时)→ `innovation_points` → `summary_outlook` → `references_list` → `acknowledgement`。
    - 开题报告:`background_figure` → `significance_cards` → `domestic_abroad` / `literature_table` → `objective_contents` → `problem_work_map` → `tech_route` → `feasibility` → `schedule_table` → `expected_outcomes` → `innovation_points` → `references_list`。
    - 硕博答辩:`background_figure` → `literature_table` → `problem_work_map` → 每项工作一章(`chapter_opener` → `model_pipeline` / `tech_route` → 实验页)→ `summary_outlook` → `achievement_list` → `review_comments` → `acknowledgement`。
    - 组会文献精读 / 读书分享(讲别人的论文或书,不是自己的课题):`metric_grid`(文献 / 书的概况)或 `background_figure` → `problem_work_map` / `lead_quotes_subject` → `tech_route` / `timeline_milestones` → 结果页(`donut_breakdown` / `bar_chart_insight` / `heatmap_matrix`)或观点页(`key_statement` / `hub_spokes` / `versus_compare`)→ 亮点 `innovation_points` → 局限与启发 `numbered_list` → 讨论题 `qa_response`;用户没给具体论文时不要编作者、期刊和年份,只写研究内容,数字标「示意数据」。
    - 项目申报 / 结题:`background_figure` / `domestic_abroad` → `objective_contents` → `schedule_table` / `gantt_schedule` → `team_lead` + `timeline_figures`(研究基础)→ `expected_outcomes` → `budget_table`;结题再加 `status_table`、`achievement_list`。
  - **campus 特色页**(label 以「特色 ·」开头的 23 页:立体柱、大数字、领奖台、道路、山峰、靶心、漏斗、拼图、天平、齿轮、积木、扇形卡、勋章、立体书等):一份稿子用 1–3 页,放在总结性、需要视觉重心的位置(核心成果、三大优势、研究目标、创新点汇总、阶段历程),不要连续两页都用特色页,也不要用它承载大段正文或完整数据表。
  - **段内强调 `**词**`**:用两个星号包住要强调的词(可以多处),显示为加粗校色字 + 浅色荧光笔,星号不显示;没配对的星号原样显示。只有这些字段支持:`campus_background_figure` 的 `paragraphs[].body`,`campus_significance_cards` 的 `items[].desc`,`campus_domestic_abroad` 的 `abroadItems[].body` / `domesticItems[].body` / `gap` / `focus`,`campus_problem_work_map` 的 `pairs[].problem` / `pairs[].work` / `goal`,`campus_objective_contents` 的 `goal` / `items[].desc`,`campus_innovation_points` 的 `points[].desc`,`campus_thesis_structure` 的 `chapters[].desc`,`campus_acknowledgement` 的 `letter` / `thanks[].body`。每段强调 1–2 处为宜。导出 PPTX 后整段是一个可编辑文本框,强调词在 PPTX 里不保留加粗着色。
  - **图的来源(`mediaMode`)**:`campus_model_pipeline` / `tech_route` / `swimlane_flow` / `decision_flow` / `er_schema` / `variable_model`、`campus_formula_notes`、`campus_setup_tables` 默认是 `auto`:goal 里写了 `props.images` 就显示图片位,没写就原生绘制(公式页是文字排版,实验设置页是数据集划分表);只有用户明确要原生图或图片时才写 `diagram` / `image`。`campus_test_cases` 的截图位是开关:传图时同时写 `"showPhoto": true`。
  - **图示页用 props 描述节点与连线**(不写坐标,`annotated_figure` 的标注点除外):`swimlane_flow` 的 `steps[]` 写 `lane`(第几条泳道,1 起)、`col`(第几列 = 时间顺序,1–8)、`next`(下一步序号,0 = 没有)、`branch`(第二出口,0 = 没有)及 `nextLabel` / `branchLabel`;`decision_flow` 的 `nodes[]` 第一个是开始、最后一个是结束,写了 `no`(「否」出口文字)的是判断,`noTo` 填上游序号 = 回流、填下游序号 = 跳转,`noTo: 0` 且写 `side` = 走旁支,`sideTo` 是旁支并回的序号;`er_schema` 的 `relations[]` 写 `from` / `to`(表序号,1 起)、`fromField` / `toField`(第几个字段行,0 = 表头)、`label`(`1 : N` 等基数)、`verb`;`model_pipeline` 的 `modules[].flow` 是箭头上的数据形态,`groups[].from` / `to` 框出相邻模块;`tech_route` 的 `branches[].labels` 是每条分支自上而下 1–3 个节点;`variable_model` 的 `hypotheses[].from` / `to` 写变量代码(X / X1 / M / Y / W,调节假设的 `to` 写被调节的假设编号如 H1),留空则只进清单不画线;`annotated_figure` 的 `points[].x` / `y` 是标注点在图上的百分比位置(0–100)。
  - **数据页的数据格式**:`campus_stats_table` 的 `rows[].c1`–`c5` 是各模型的系数文字,末尾写 `*` / `**` / `***` 自动显示为校色星号,`s1`–`s5` 是括号里的标准误或 t 值;做描述性统计时列头写「均值 / 标准差 / 最小值 / 最大值」并关掉 `showSe`、`showSummary`。`campus_heatmap_matrix` 的 `size` 是行列数(3–8),`labels[].name` 是行列共用的类别名,`rows[i].v1`–`v8` 是第 i 行各列的数值;`mode` 为 `confusion`(混淆矩阵,写计数)或 `correlation`(相关系数,-1 ~ 1,`decimals: 2`)。这两页右侧解读的 `insights[].value` 写这条结论的关键数字(如 `0.82`、`+3.1%`),没有数字就留空,不要写序号(左边已自动编号 01、02…)。`campus_survey_bars` 的 `questions[].p1`–`p5` 是五级选项的百分比(依次对应 `levels`,按合计换算成 100%),`mode: "single"` 时只用 `value`。`campus_ablation_table` 的 `rows[].m1`–`m5` 写 `true` / `false`(是否启用模块),`v1`–`v4` 是指标值,`metrics[].better` 写 `high` / `low`。`campus_test_cases` 顶部 `stats` 是手填的,改了用例或结论要同步改总数、通过数、通过率。`campus_achievement_list` 在 4 类 × 5 条或 3 类 × 5 条时每条控制在约 32 字以内。`campus_team_lead` 的 `images[0]` 是负责人,`images[1]` 起是骨干。`campus_references_list` 的 `refs` 每项是一条完整著录文本,不写 `[1]` 编号(自动生成),类型标 `[J]` / `[M]` / `[D]` 写在条目里。
  - **`campus_curve_grid` 的数据是扁平的**:各小图共用一组横轴取值 `points[].label`,第 1 张图的三条系列读 `a1` / `a2` / `a3`,第 2 张读 `b1`–`b3`,依次到第 6 张的 `f1`–`f3`;`charts[]` 是每张图的子图号、标题、单位、小数位,`series[]` 是共用图例。两张图(损失、精度)× 两条系列 × 3 个轮次的写法:
    ```json
    {"chartCount": 2, "seriesCount": 2, "pointCount": 3,
     "series": [{"name": "本文方法"}, {"name": "基线"}],
     "charts": [{"tag": "(a)", "title": "训练损失", "unit": "", "decimals": 2}, {"tag": "(b)", "title": "验证精度", "unit": "%", "decimals": 1}],
     "points": [{"label": "10", "a1": 1.20, "a2": 1.35, "b1": 71.2, "b2": 68.0},
                {"label": "20", "a1": 0.84, "a2": 1.02, "b1": 80.5, "b2": 75.3},
                {"label": "30", "a1": 0.61, "a2": 0.88, "b1": 84.9, "b2": 78.1}]}
    ```
- 不使用旧 token、旧主题、旧媒体槽、旧风格分支或旧入场动画控制。
- 选页先用 `npm --prefix <skill-root>/project run layout:query -- --theme <themePack> --role <role> --limit 8 --seed <randomSeed>:slide-<n>`;每个逻辑页的 3 个模板方案必须是结构指纹不同的 layout。相同 seed 和输入必须稳定,也不要固定只用未打散列表的前三条。跨逻辑页允许在候选稀缺时复用,由既有跨页 layout/组合/family 软惩罚降低重复。需要媒体槽时加 `--needs-media`、`--planned-images <n>`、`--provided-images <n>` 或 `--image-gen`。
- 字段不清楚、对象/数组/count、图片/媒体:先运行 `npm --prefix <skill-root>/project run inspect:layout -- --compact <layout...>` 检查该页 3 个模板方案;单 layout 写 props 时运行 `props:safe`;schema v2 结构投影 goal 运行 goal spec 校验,不要用 `props:safe --write` 回填 props。
- 把 `layout:query` / `inspect:layout` 的 JSON 管道给程序解析时,改用 `node <skill-root>/project/scripts/layout-query.mjs` / `node <skill-root>/project/scripts/inspect-layout.mjs`:`npm run` 会在 stdout 前打印生命周期 banner,污染 JSON。
- 标准 3+1 deck:必须先逐页写 `output/<deck-name>/page-content-pack.json`,每页使用稳定 id 和下列完整 PageContentPack 结构;再运行 `npm --prefix <skill-root>/project run goal:scaffold -- --title <title> --goal <goal> --theme <themePack> --pages <n> --layout-variants 3 --content-plan output/<deck-name>/page-content-pack.json --seed <randomSeed> --chunk-size 5 --out output/<deck-name>/goal.json`。schema v2 的 3 个模板方案和 v4 定制方案必须由该 content plan 生成;没有 `--content-plan` 时不要使用 `--layout-variants 3`。
  ```json
  {
    "pages": [{
      "id": "page-1",
      "presentation": {
        "pageIntent": "cover",
        "coreMessage": "本页唯一核心结论",
        "title": {"full": "完整标题", "short": "短标题"},
        "summary": {"full": "完整摘要", "short": "短摘要"},
        "items": [{"id": "fact-1", "label": "指标名称", "detail": {"full": "完整说明", "short": "短说明"}, "value": 42, "displayValue": "42", "unit": "%", "required": true, "priority": "high"}],
        "chartData": [{"id": "fact-1", "label": "指标名称", "value": 42, "displayValue": "42", "unit": "%"}],
        "media": [{"src": "assets/example.png", "kind": "image", "type": "image/png", "alt": "图片说明"}]
      }
    }]
  }
  ```
- 文案长度和数组数量:优先按 `fillPlan.text[].maxChars`、`fillPlan.arrays[].visibleCount`、`fillPlan.arrays[].nestedArrays` 写;`display` / `metric` 字段只写短词、短句或数字。
- Html 字段(如 `headlineHtml` / `quoteHtml`)写文案只用 `<br>` 换行加 `<b>` / `<em>` 行内强调,禁止 `<span>` 等自由 HTML;主题默认值里的 `<span class>` 依赖主题 CSS,只是占位,不要照抄。`validate:goal-spec` 会拦截自由 HTML。
- 可见数组项必须写实文案;被 count/显隐控制隐藏的尾项可保留“请输入文本”占位。
- 元素出现动画使用页面组件自带的原生效果。
- 页面切换动画可以在预览控制面板里调整。
- 面向用户交付的 deck 默认不显示风格/主题切换选项;风格切换只保留在内部调试 demo 页面。用户明确要求保留主题切换时,在 goal 顶层写 `preview: {"themeSwitcher": true}`。
- 不手写自由 HTML slide。新生成 deck 使用 `schemaVersion: 2`;每个逻辑页只保存一份 `content`,前三项只保存 `{kind:"template", layout, contentMap, projection}` 的结构目标与 source binding,第四项保存 `{kind:"bespoke", adjustable:false, composition, contentMap, projection}` 的网格/type/style 与 source binding;goal 不持久化模板 props 或 bespoke 文案、指标、列表、图表、media src/alt 业务副本。v4 不写 `layout`、`props` 或 `controls`。
- 每套主题的前 5 页 `themeXX_page001` 到 `themeXX_page005` 都是封面候选。一个 deck 只能有 1 个逻辑封面页;标准 PageContentPack 3+1 中 `pageIntent=cover` 优先使用可承载的封面候选,只有前 5 页能形成 3 个结构不同的真实模板时才整页使用封面布局,否则整页回退到第 6 页以后的真实正文布局,同一逻辑页禁止混用封面与正文布局。
- 同一逻辑页的 3 个模板方案必须结构不同;不要只换页码或镜像同一结构。跨逻辑页不要求 3N 个 layout 绝对唯一,保留 scaffold 既有的 layout、组合和 family 复用软惩罚。
- 面向用户交付的 deck 不能依赖页面默认文案。除非用户明确要默认 demo,每一页业务内容都必须先写入 PageContentPack,不直接写入 variant props/composition。
- `slide.content.presentation` 是唯一业务事实源;模板在运行时按 `contentMap + projection.structure` 即时生成 props,bespoke 按 `contentMap + itemBindings/chartBindings/mediaBindings` 即时注入 composition。修改 canonical content 后 4 个方案必须一起更新。
- v4 必须独立分析用户目标、受众、本页叙事作用、重点信息和当前主题特征后设计;继承主题颜色、字体、间距、形状、媒体和图表语言,使用受限 `composition` 元素,不新增事实、不写自由 HTML/JSX,也不是前三个模板的小改。生成失败时仍输出安全的 `kind:"bespoke"` 组合。
- v4 `composition` 写 `designIntent`、主题背景语义和 12×8 网格元素;元素类型只用 `text` / `metric` / `list` / `quote` / `media` / `shape` / `chart`。
- 3 个模板方案各自的可见文案槽必须由 `contentMap` 或 `projection.structure` 绑定 canonical content,未使用槽位由结构投影显式关闭或置空;遗漏会交付模板演示文案。
- 优先只写 `layout:query` / `inspect:layout` 暴露的文案字段。字段是对象或数组时按 `fillPlan` 和 `propShapes` 填内部 key。`copyKeys` 已展开嵌套路径(如 `copy.quote`、`items[].label`),按列出的路径直接填。
- `inspect:layout` 标 `contentLocked: true` 的页正文由组件固定、props 填不进:换一页能填正文的布局,或仅当用户接受其默认正文时使用。数组按 `fillPlan.arrays[].visibleCount` 填满可见项;`decorativeKeys` 是装饰位,不要填。
- 不要改页面元数据、组件源码、className、CSS、样式字段或默认视觉结构来完成内容填充。schema v2 业务内容只写 PageContentPack,结构目标与 binding 由 scaffold 生成。
- 允许用顶层 `text` 覆盖可见文字槽位,但只用于替换文字内容。不要在普通生成中启动浏览器批量抽取全页面文本槽位;只有用户明确要求“彻底清除所有模板默认文案/逐页校对可见文案”时才做运行时槽位抽取。
- 禁止复用 `output/` 里已有的旧 `goal.json` 或旧 HTML。每次请求都新建本次输出目录和本次 JSON 计划。
- 输出目录写在当前会话工作目录,不要写入 `<skill-root>/project/output`。
- HTML 交付:给用户的预览地址只给 `http://127.0.0.1:<port>/`(不给 https 或 .local 变体);本机 HTTP 可导出 HTML/PDF/PPTX,本地 HTML 或 `file://` 不能导出可编辑 PPTX。不要返回 `theme-preview`。在自带浏览器的 Agent APP(如 Codex)里生成时,提醒用户导出 PDF/PPTX 前把该地址在系统浏览器中打开。
- PPTX 交付:调用 `/api/export-editable-pptx`;最终只给 PPTX 文件路径或下载结果。
- 无浏览器会话、脚本直调、或预览导出接口返回 403/5xx 时:改用 `npm run export:pptx -- <deck>/ppt <out.pptx>`(PDF 用 `export:pdf`)直接产出文件,不需要先起浏览器会话。
- 如果输出正文里出现与用户主题无关的默认文案,例如 AI Capital / 投融资 / SoundWave / 声浪 / Key Metrics / Roadmap / End of Report 等,必须重写 JSON 后重新渲染,不能交付。

## 媒体工作流

- 媒体字段只写 `mediaSlots[].canPresetMedia: true` 的槽,按该槽 `presetProp` / `fieldPath` 写路径;`goal.json` 只引用 deck 内相对媒体路径,不可引用临时目录、外部绝对路径、`file://` 或远程 URL。
- 视觉素材任务先判断意图:无图但需要视觉素材时先问是否预留图片槽;无真实素材且不能生图时优先选无媒体页。用户提供素材库/素材目录路径即视为有图意图:至少选 2 个带媒体槽页面并填入合适素材。素材路径不可访问时改选无媒体页并在交付说明中告知,不在页面内留占位提示文字。用户同意用 `--planned-images <n>` / `--needs-media`,用户给素材用 `--provided-images <n>` / `--provided-media`,用户明确要求原创视觉图/生图时,Codex 环境用 image-gen 生成图片并加 `--image-gen`;未明确生图时先询问用户。`plannedImages` / `needsVisual` / `imageGen` 只表示选页意图,除非用户明确选择预留空槽,交付前必须写入真实媒体路径,不能交付空媒体槽或伪造路径。
- 用户本地图片/视频先运行 `npm --prefix <skill-root>/project run media:stage -- <deck-output-dir-or-ppt-dir> <media-file...>`,使用返回的 `relative` 路径;AVIF 会转成浏览器可用格式。image-gen 输出也先落到本次 deck 目录。
- 渲染后核对 goal 引用的每个图片/视频:`ppt/<relative>` 存在且 HTML 包含文件名;缺失时只补最终 `ppt/assets` 并重跑校验。图片/视频素材每个最多使用一次;同一逻辑页的 4 个方案共用同一份素材,算 1 次逻辑使用,不同逻辑页不要重复填充同一素材。素材用完后,媒体插槽留空或改选无媒体插槽页面。
- 需要 image-gen 生成 2 张以上独立图片时,用多个 subagent 并行生成,不要串行逐张等待;每张图独立生成,不要用一张拼图/素材板再拆分。subagent 只用于生图,不用于选题、文案、选页或校验。

## 工作流

1. 提炼用户目标: `title`、`goal`、`audience`、`owner`、页数、内容重点和最终产物格式;同时形成验收清单,记录用户显式要求、已确认选项和必要假设。用户未指定页数时默认 10 页左右,不少于 8 页。
2. 确认 `themePack`。用户未指定时先询问风格;用户选定后生成 `randomSeed`,例如 `<主题>-<日期>-<3位随机词>`,保证随机选页可复现。
3. 判断图片意图:无图但需要视觉素材时先问是否预留图片槽;用户给本地素材先 `media:stage`;明确生图时用 image-gen。
4. 先按上方 `{"pages":[...]}` JSON 骨架和逐页语义 brief 写完整 `output/<deck-name>/page-content-pack.json`,再把该 JSON 和 `--seed <randomSeed>` 通过 `--content-plan` 传给 `goal:scaffold`;不要另走手写 3+1 骨架路径。
5. 每页只承载一个主要信息角色。业务值只写一次到 PageContentPack;scaffold 仅保存 3 个模板的结构投影/source binding 和 v4 的结构 composition/source binding,不要手工复制 props、文案、指标、列表、图表或 media 值。
6. scaffold 把 schema v2 JSON 写入本次工作目录的 `output/<deck-name>/goal.json`;每页包含 `selectedVariant: "v1"` 和恰好 3 template + 1 bespoke。渲染前运行 goal spec 校验;不要对该结构投影 goal 运行 `props:safe --write`,以免把运行时 props 写回存储模型。
7. 图表页填入自己的数据后,页内 insight/读图/结论类文案字段必须据新数据一并改写,不保留默认结论。
8. 运行渲染脚本输出 `output/<deck-name>/ppt/index.html`;脚本会使用 Skill 内置生成器,不要切回外部项目目录。
9. 渲染后核对素材路径,缺失时补最终 `ppt/assets`。
10. 确认脚本完成 `validate:swiss` 和 `validate:goal-copy` 校验。
11. 渲染脚本会启动本地 HTTP 预览服务并输出 `http://127.0.0.1:<port>/`;需要指定端口时设置 `DASHI_PPT_PREVIEW_PORT` 后再运行脚本(端口用 5200-5999 段,4178/4300/4400 为用户保留端口不可用)。只能用该预览服务,不得用 `python -m http.server`、`npx serve` 等静态服务器替代:静态服务器没有导出和自动保存接口。预览服务下编辑自动保存到 `index.html` 本体;`file://` 打开的本地文件不自动保存,交付前需导出。
12. 对最终产物执行成果验收:默认 comparison 应按逻辑页连续输出全部 4N 页,selected-only 输出 N 页;逐组核对 4 个方案内容一致、构图不同,并确认 v4 无模板属性控件但可选择、保存和导出。
13. 状态为“待修正”时定位不合格页,修改文案/数据/媒体,必要时更换 layout 或重新生成对应页;重新渲染、运行全部校验并复验。
14. 运行 `node <skill-root>/scripts/check_latest_version.mjs` 做静默版本检查。
15. 验收通过后按交付格式回复:HTML 只给 `http://127.0.0.1:<port>/`;PPTX 调用 `/api/export-editable-pptx` 后只给文件路径或下载结果。

## 成果验收与返工

机器校验通过只是技术基线,不等于成果达标。最终验收以用户原始需求、已确认选项、明示假设和最终渲染产物为准:

- 目标一致性:Deck 回答用户的核心问题,重点、结论和语气适合目标受众。
- 内容覆盖:指定的主题、必含要点、页数、风格、语言、媒体和产物格式都已落实,无跑题、缺项或无关模板文案。
- 逐页检查:每页都服务于整体目标;标题、正文、数据、图表和 insight 相互一致,没有重复、断层、空白页或明显不匹配的 layout。
- 叙事完整性:开场、论证/展开和结论/行动顺序清晰,页与页之间有逻辑承接。
- 交付完整性:最终文件存在且能打开,页数和格式正确,素材可用,首尾页非空白。

有浏览器能力时,最终一轮必须逐页打开预览,检查内容可见、媒体正常,无明显溢出、遮挡或裁切;不创建专用 Chrome profile,不默认做截图审美精修。无浏览器能力的脚本/批处理环境至少复核 `goal.json`、校验结果和输出文件,并不得声称已完成视觉验收。

验收状态只有“通过”“待修正”“阻塞”。发现任一不合格项就标记“待修正”:文案、数据、insight 或媒体错误时改对应 props;页面信息角色或容量不匹配时重新 `layout:query` 并更换 layout;内容缺失时补写或重新生成对应页。修正后从 `props:safe`、`validate:goal-spec`、渲染、素材核对、`validate:swiss`、`validate:goal-copy` 到成果验收全部重跑。

默认最多修正 2 轮。验收通过后才能交付;两轮后仍不通过则标记“阻塞”,说明未达标项和阻塞原因,不得将其表述为已完成成果。

示例命令(macOS / Linux):

```bash
<skill-root>/scripts/render_goal_deck.sh \
  output/client-review/goal.json \
  output/client-review/ppt/index.html
```

Windows PowerShell:

```powershell
& "<skill-root>/scripts/render_goal_deck.ps1" `
  "output/client-review/goal.json" `
  "output/client-review/ppt/index.html"
```

## JSON 结构

```json
{
  "schemaVersion": 2,
  "title": "美国 AI 融资调研",
  "goal": "面向投资团队汇报 2024-2026 年美国 AI 大额融资结构、资本流向和后续判断",
  "audience": "投资团队 / 产业研究团队",
  "owner": "研究团队",
  "randomSeed": "ai-funding-20260609-a7k",
  "pageCount": 1,
  "themePack": "theme01",
  "variantOutputMode": "comparison",
  "slides": [
    {
      "id": "s1",
      "content": {
        "section": "融资调研",
        "title": "美国 AI 融资调研",
        "titleTop": "美国 AI",
        "titleBottom": "融资调研",
        "summary": "2024-2026 年大额融资结构、资本流向与后续判断",
        "year": "2026",
        "points": ["融资结构", "资本流向", "后续判断"]
      },
      "selectedVariant": "v1",
      "variants": [
        {"id": "v1", "kind": "template", "layout": "theme01_page001", "props": {}, "contentMap": {"kicker": "section", "titleTop": "titleTop", "titleBottom": "titleBottom", "lead": "summary"}},
        {"id": "v2", "kind": "template", "layout": "theme01_page002", "props": {}, "contentMap": {"enKicker": "section", "titleTop": "titleTop", "titleBottom": "titleBottom", "subtitle": "summary"}},
        {"id": "v3", "kind": "template", "layout": "theme01_page003", "props": {}, "contentMap": {"kicker": "section", "titleTop": "titleTop", "titleBottom": "titleBottom", "bigNumber": "year"}},
        {
          "id": "v4",
          "kind": "bespoke",
          "adjustable": false,
          "composition": {
            "designIntent": {
              "objective": "快速建立调研范围",
              "audience": "投资团队",
              "narrativeRole": "封面定调",
              "emphasis": "研究对象与决策价值",
              "rationale": "用单一标题中心和三项范围提示缩短理解路径"
            },
            "background": "dark",
            "elements": [
              {"id": "title", "type": "text", "grid": {"column": 1, "row": 1, "width": 10, "height": 2}, "role": "title", "text": ""},
              {"id": "scope", "type": "list", "grid": {"column": 1, "row": 4, "width": 7, "height": 3}, "items": []}
            ]
          },
          "contentMap": {"elements[0].text": "title", "elements[1].items": "points"}
        }
      ]
    }
  ]
}
```

如果 `slides` 为空,`pageCount` 只适合临时草稿预览。新生成 deck 面向用户交付前必须落成 schema v2 的 3 template + 1 bespoke;旧单版式和旧 3 候选 goal 仍可读取。

## 页面角色

`role` 只用于草稿选页,最终 JSON 的前三个方案必须落成具体 `layout`,v4 必须落成无 layout 的 bespoke composition。角色说明见 `references/layout-roles.md`;真实模板候选以 `layout:query` 输出为准。

单版式草稿的 `cover` 只能从当前主题前 5 页选择；标准 PageContentPack 3+1 按上文的真实候选承载规则选择同质模板池。`image` / `media` 候选基于真实 `mediaSlots`,不是页面标题关键词。动态背景页可用 `ambient` 作为氛围页或章节页。

可以直接指定页面:

```json
{"layout": "theme01_page030", "props": {"title": "典型案例"}}
```

## 交付能力

生成后的预览页默认把 N 个逻辑页展开为 4N 个方案页。右侧面板可在同组 4 页之间跳转或标记最终方案;前三个模板方案可调 props,v4 显示为固定的 Agent 定制方案。`variantOutputMode:"comparison"` 导出 4N 页,`"selected-only"` 导出 N 页。面向用户交付的页面底部不显示页码标识、翻页引导、圆点导航或索引提示。

## 页面属性契约

普通生成不要读 `layout-manifest.json`。先用 `layout:query` 输出的候选摘要。只有需要更细契约时,再用 `npm --prefix <skill-root>/project run inspect:layout -- --compact <layout...>` 看页面契约:

- `copyKeys`: 可安全改写的文案/数据字段。
- `copyBudgets`: 文案长度预算;`display` / `metric` 超长会被 goal spec 拦截。
- `propShapes`: `copyKeys` / 数组字段的内部形状;写 `copy`、`cells`、`items`、`rows` 等对象字段时只使用这里列出的 key。
- `fillPlan.arrays[].itemFields[].enum`: 该字段为结构枚举,只能从列出的值中选,不是自由文案。
- `mediaSlots`: 图片/视频写入字段、count key、默认数量和最大数量。
- `countBindings`: 数量参数与数组字段的绑定。
- `fillPlan` 里数值字段看 `numericBounds` 填数:`enforced:false` 是提示、真实数据可超出,`enforced:true` 必须遵守,`semantics:'normalized'` 填 0-1 比例;定长嵌套数组看 `fixedLength`/`fixedLengths` 按下标填,不试错。
- `controlKeys`: 右侧面板可操作字段,不是普通内容填充清单;仅用户明确要求调整页面属性时使用。默认只填 `copyKeys`、可见数组和真实媒体槽。

## 校验

- 渲染前必须运行 `validate:goal-spec`。
- 输出后必须运行 `validate:swiss`。
- 输出后必须运行 `validate:goal-copy`。
- 改动展示 demo 后运行 `npm run showcase:update`。

# Dashi PPT 高校版 · 大学生的答辩 / 开题 / 组会 PPT Skill

![Version](https://img.shields.io/badge/version-v0.4.15-2EA44F?style=flat-square)
![Release](https://img.shields.io/badge/%E6%AD%A3%E5%BC%8F%E7%89%88-Stable-2EA44F?style=flat-square)
![豆包](https://img.shields.io/badge/%E8%B1%86%E5%8C%85%E5%B7%A5%E4%BD%9C-Supported-3370FF?style=flat-square)
![Claude Code](https://img.shields.io/badge/Claude%20Code-Supported-6B5B95?style=flat-square)
![Codex](https://img.shields.io/badge/Codex-Supported-222222?style=flat-square)
![PPTX Export](https://img.shields.io/badge/PPTX-%E5%8F%AF%E7%BC%96%E8%BE%91%E5%AF%BC%E5%87%BA-D24726?style=flat-square)
[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL--3.0-blue?style=flat-square)](./LICENSE)

[Dashi PPT Skill](https://github.com/chuspeeism/dashi-ppt-skill) 的高校版。告诉 AI 你的学校、题目和场合，它会做出一整套带**学校专属封面、校徽和校色**的 PPT：封面、目录、正文一次排好，能在浏览器里接着改，改完导出**可编辑的 PPTX**。

- **12 所学校专属封面和动画**，其他学校也能换上自己的校名、校徽、校色
- **100+ 个学术场景版式**：研究背景、文献精读、技术路线、实验对比、消融实验、致谢……
- **仪式感开场动画**，答辩第一页就抓住老师
- **全局换色、换学校**，一改整套统一，不用一页页调

![武汉大学本科答辩：封面到正文](https://github.com/chuspeeism/dashi-ppt-campus/releases/download/readme-assets-v1/hero.gif)

## 在豆包里用（三步）

1. 打开豆包电脑版，进入「豆包工作」，在左侧「工作台」里找到 **高校学生工作台**，点「使用」。
2. 在输入框里发送下面这句话，等它装好（几分钟）：

   ```text
   从 Github 上安装 chuspeeism/dashi-ppt-campus 这个 Skill
   ```

3. 新建一个工作任务，点输入框下方的「**技能**」，选中 `dashi-ppt-campus`，再写上你的要求发送。例如：

   ```text
   帮我做一个武汉大学的本科毕业论文答辩 PPT，题目《管理会计在企业经营管理中的应用研究》，经济与管理学院会计学专业，答辩人李雨桐，指导教师张丽副教授。内容包括研究绪论、理论与方法、应用与案例、问题与对策、结论与展望。15 页左右，做完导出 PPTX。
   ```

几分钟后就能拿到完整的 PPT 和可编辑的 PPTX 文件。

> **小提示**
> - 「技能」列表里找不到 `dashi-ppt-campus`：到「插件 · 技能 · 伙伴 → 管理 → 技能」里确认 **Dashi Ppt Campus** 的开关是打开的；或者不选技能，直接在要求开头写「用 dashi-ppt-campus 技能，帮我做……」。
> - **本地电脑模式**：回复末尾会给一个预览链接，点开后在右侧网页里可以改文字、换学校、换配色，右上角「导出 → PPTX」；下载完成后点「立即查看」，还能用豆包自带的 PPT 编辑器继续改。
> - **云电脑模式**：点回复里的 PPTX 文件卡片，右侧就能直接翻看整套 PPT。
> - 有论文或开题报告的话，一起上传给它，内容会更贴近你的研究。

## 12 所学校的专属封面

北京大学、清华大学、上海交通大学、浙江大学、武汉大学、东南大学、中山大学、厦门大学、四川大学、东北大学、河南大学、云南大学。

![各校封面](https://github.com/chuspeeism/dashi-ppt-campus/releases/download/readme-assets-v1/covers.jpg)

导出 PPTX 时，这些学校的封面和目录会换成设计师做的原生页（3D 建筑模型或校园视频，在 PowerPoint 里可以旋转模型、播放视频；清华大学目前只有封面是原生页）。每所学校第一次导出时会自动下载这所学校的模板（45–90 MB），之后不再重复下载。

其他学校也可以用：封面和目录用通用版式，校名、校徽、校色照常带出。

## 为学术场景做的正文页

答辩、开题、组会、文献精读、读书分享常用的页面都有：数据结论页、代表性文献精读、技术路线、模型结构、实验对比、热力图、构成占比、读后反思、讨论题……

![正文页示例](https://github.com/chuspeeism/dashi-ppt-campus/releases/download/readme-assets-v1/pages.jpg)

## 生成后在浏览器里接着改

生成的 PPT 是一个网页，打开就能横向翻页，也能直接编辑：

- 点进文字直接改
- 右侧面板「学校信息」里换学校、改校名、拖入自己的 LOGO、换校色，整套同时生效
- 调整导航栏样式、标题装饰、卡片数量和排法等页面参数
- 右上角「导出」：PPTX（可编辑）/ PDF / HTML，网页里看到的样子就是导出后的样子

![换学校、换主题色](https://github.com/chuspeeism/dashi-ppt-campus/releases/download/readme-assets-v1/switch-school.gif)

## 在其他 AI Agent 里安装（Claude Code / Codex 等）

用 npm 一键安装或更新（自动探测常见技能目录）：

```bash
# 国内（走 npmmirror 镜像，不需要访问 GitHub）
npx --registry=https://registry.npmmirror.com dashi-ppt-campus-skill@latest

# 国际
npx dashi-ppt-campus-skill@latest
```

- 装到豆包工作的本地技能目录：在命令末尾加 `--doubao`。
- 指定位置：`--dir <技能根目录>`；更新所有探测到的目录：`--all`；只列出目录：`--list`。
- 手动安装：在技能目录里 `git clone https://github.com/chuspeeism/dashi-ppt-campus dashi-ppt-campus`，然后重新打开会话。

技能目录名是 `dashi-ppt-campus`，和原版 Dashi PPT（`dashi-ppt`）可以同时安装、互不覆盖。本机需要 Node.js 20+ 和 npm，首次生成时依赖会自动准备到 `~/.dashi-ppt/`（国内网络会自动切换到镜像源）。

## 版本与更新

当前正式版：**v0.4.15**（2026-11-17），npm 包 [`dashi-ppt-campus-skill`](https://www.npmjs.com/package/dashi-ppt-campus-skill) 同步发布。各版本的变化见 [Releases](https://github.com/chuspeeism/dashi-ppt-campus/releases)。

- 在豆包里：对它说「把 dashi-ppt-campus 更新到最新版」，或重新发送一次安装那句话。
- 在其他 Agent 里：重新运行上面的 npx 命令即可，已准备好的依赖和已下载的学校模板不会重复下载。
- 技能会在完成任务后静默检查新版本，有新版本时才在回复末尾提醒你。

## 常见问题

**生成要多久？** 一般 10–20 分钟，页数多、模型慢或用云电脑时会更久。

**内容里的数据是真的吗？** 你给了的（题目、姓名、导师、数据）照写；没给的会先合理自拟，并在交付说明里列出来，答辩前请换成你论文里的真实数据。

**它和原版 Dashi PPT 什么关系？** 高校版在原版的基础上加了高校主题、学校专属封面、学术版式和学校信息面板，原版的 12 套视觉风格也都保留着。职场、商业类的 PPT 用 [原版](https://github.com/chuspeeism/dashi-ppt-skill) 更合适。

## 开源协议

[AGPL-3.0](./LICENSE)

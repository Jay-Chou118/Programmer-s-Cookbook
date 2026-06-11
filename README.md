# 🍳 404食堂 | 代码能跑，菜也能做

> 当编程语言的关键字遇上人间烟火气，每一行代码都值得被用心烹饪

<div align="center">

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML-5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/zh-CN/docs/Web/HTML)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![GSAP](https://img.shields.io/badge/GSAP-3.12-88CE02?logo=gsap&logoColor=white)](https://gsap.com/)
[![Kling AI](https://img.shields.io/badge/Kling-AI-FF6600?logo=openai&logoColor=white)](https://klingai.com/)

**编程语言关键字 × 美食菜谱 · 7 种语言 · 28+ 道菜谱 · 社区投稿 · AI 生成 · 可灵配图**

</div>

---

## ✨ 功能亮点

### 🎨 视觉体验
- **玻璃态拟物设计** — 半透明卡片 + 动态光效，7 种语言独立主题配色
- **代码雨特效** — Matrix 风格背景 + 星空粒子，程序员专属浪漫
- **明暗主题切换** — 一键切换深色/浅色模式，全站自适应
- **入场动画** — GSAP 驱动的卡片飞入、标签切换过渡

### 🍳 制作助手（核心交互）
- **"编译成菜"动画** — 点击"开始制作"后播放 3-5 秒终端打字动画，每种语言有专属编译风格（Python 的 `>>>`、Rust 的 `cargo build`、Java 的 `javac` 等），代码逐行输入，最后弹出详情页
- **倒计时器** — 根据菜谱预计用时自动设置，支持开始/暂停/重置
- **采购清单** — 主料/辅料/调料分类展示，逐项勾选标记"已备齐"
- **TodoList 步骤** — 每个烹饪步骤可勾选，实时进度条追踪完成度
- **完成庆祝** — 全部步骤完成后弹出庆祝动画，计时器自动停止

### 🤖 AI 能力
- **AI 菜谱生成** — 输入编程关键字，AI 自动生成菜名、创意描述、原料和步骤，支持一键投稿到社区
- **可灵 AI 配图** — 接入快手自研可灵大模型（Kling AI），为每道菜生成精美配图。JWT 签名认证，异步任务轮询

### 👥 社区与互动
- **社区投稿** — 自定义菜谱（语言、关键字、菜品、原料、步骤），投稿菜谱同时出现在对应语言标签和社区标签
- **收藏功能** — 一键收藏喜欢的菜谱，独立"收藏"标签页统一管理
- **点赞功能** — 为喜欢的菜谱点赞，显示点赞计数
- **今日推荐** — 每天基于日期推荐一道菜谱
- **全局搜索** — 按关键字、菜名、编程语言实时检索

### 🎁 程序员彩蛋
- 搜索框输入 `sudo` → "权限不足：需要 root 权限才能烹饪"
- 搜索框输入 `rm -rf` → 危险操作弹窗（"开玩笑的，什么都没删"）
- 搜索框输入 `hello world` → "欢迎来到 404食堂"
- 连续点击标题 5 次 → 触发 emoji 模式（番茄炒蛋 → 🍅🍳）

### 📱 其他特性
- **菜谱海报生成** — 一键生成精美分享海报，支持下载
- **键盘快捷键** — 数字键 1-7 切换语言，8 社区，9 收藏，Ctrl+K 聚焦搜索，Esc 关闭弹窗
- **响应式布局** — 完美适配 PC、平板、手机
- **本地持久化** — 基于 localStorage 存储社区菜谱、收藏、点赞数据

---

## 📖 菜谱一览

| 语言 | 关键字菜谱 |
|------|-----------|
| 🐍 **Python** | `import` 番茄炒蛋 · `def` 红烧肉 · `for` 韭菜鸡蛋饺子 · `if/else` 酸辣土豆丝 |
| ☕ **Java** | `class` 麻婆豆腐 · `public static void main` 宫保鸡丁 · `new` 炸春卷 · `interface` 广式月饼 |
| ⚡ **C++** | `template` 白菜猪肉水饺 · `while` 土豆炖牛肉 · `return` 回锅肉 · `namespace` 鸳鸯火锅 |
| 🟨 **JavaScript** | `function` 火腿三明治 · `const` 扬州炒饭 · `async/await` 豪华泡面 · `this` 蛋炒饭 |
| 🔵 **Go** | `goroutine` 小笼包 · `chan` 旋转寿司 · `defer` 蛋炒饭 · `select` 三菜一汤 |
| 🦀 **Rust** | `fn` 手工拉面 · `let` 戚风蛋糕 · `match` 冒菜 · `impl` 意大利披萨 |
| 🟣 **Kotlin** | `val` 卤味拼盘 · `when` 珍珠奶茶 · `data class` 沙拉 · `suspend` 番茄牛腩汤 |

每道菜谱包含：关键字释义、取名创意、原料明细、烹饪步骤、难度/时间/热量标注。

---

## 🚀 快速开始

### 环境要求

- Python 3.x（用于本地服务器）
- 现代浏览器（Chrome / Firefox / Safari / Edge）

### 本地运行

```bash
# 1. 克隆仓库
git clone https://github.com/Jay-Chou118/Programmer-s-Cookbook.git
cd "Programmer's Cookbook"

# 2. 配置可灵 API（可选，用于 AI 配图）
cp js/config.template.js js/config.js
# 编辑 js/config.js，填入你的 Access Key 和 Secret Key

# 3. 启动本地服务
python3 -m http.server 8080

# 4. 浏览器打开 http://localhost:8080
```

> 💡 文件夹名含单引号，终端中需用引号包裹：`cd "Programmer's Cookbook"`

### 可灵 API 配置（可选）

本项目支持接入**快手自研可灵 AI** 为菜谱生成配图：

1. 登录 [可灵开发者平台](https://klingai.com/dev/api-key) 获取 Access Key 和 Secret Key
2. 复制模板文件：`cp js/config.template.js js/config.js`
3. 在 `js/config.js` 中填入真实密钥
4. `js/config.js` 已被 `.gitignore` 排除，**不会提交到 GitHub**

---

## 📁 项目结构

```
404食堂/
├── index.html              # 页面骨架 + CDN 库引入
├── css/
│   ├── style.css           # 基础样式：卡片、搜索框、代码雨、主题切换
│   ├── detail.css          # 详情页样式：模态框、计时器、进度条、TodoList
│   ├── welcome.css         # 欢迎弹窗、投稿表单、浮动按钮样式
│   ├── features.css        # 今日推荐、收藏/点赞按钮样式
│   ├── easter.css          # 彩蛋弹窗、海报生成样式
│   ├── compile.css         # "编译成菜"终端动画样式
│   └── kling.css           # 可灵 AI 生成弹窗样式
├── js/
│   ├── config.js           # ⚠️ 可灵 API 密钥（已被 .gitignore 排除）
│   ├── config.template.js  # 密钥配置模板（提交到 GitHub）
│   ├── data.js             # 菜谱数据：7 种语言共 28 道官方菜谱
│   ├── effects.js          # 视觉特效：粒子背景、代码雨、GSAP 动画
│   ├── ui.js               # 核心交互：卡片渲染、标签切换、搜索、主题切换
│   ├── detail.js           # 制作助手：计时器、TodoList、采购清单
│   ├── welcome.js          # 欢迎弹窗、投稿表单、社区菜谱渲染
│   ├── features.js         # 今日推荐、收藏/点赞、收藏页渲染
│   ├── easter.js           # 程序员彩蛋、海报生成
│   ├── compile.js          # "编译成菜"终端动画
│   ├── aigen.js            # AI 菜谱生成器
│   ├── kling.js            # 可灵 AI 图片生成（JWT 认证 + 异步轮询）
│   └── main.js             # 入口脚本：初始化、键盘快捷键、统计信息
├── .gitignore              # 排除 config.js 等敏感文件
├── README.md
├── KUAISHOU_COMPETITION.md # 快手比赛专项文档
└── COMPETITION_PLAN.md     # 比赛竞争力方案
```

模块化设计，无构建工具、无后端依赖，纯前端开箱即用。

---

## 🛠️ 技术栈

| 技术 | 用途 |
|------|------|
| **HTML5** | 语义化页面结构 |
| **Tailwind CSS** (CDN) | 响应式布局 + 工具类样式 |
| **GSAP** | 入场动画 + 卡片过渡 |
| **Three.js** | Matrix 代码雨背景 |
| **Particles.js** | 星空粒子背景 |
| **Vanilla JavaScript** | 全部交互逻辑（无框架依赖） |
| **Web Crypto API** | JWT HMAC-SHA256 签名（可灵认证） |
| **RemixIcon** | 图标库 |
| **Google Fonts** | Fira Code + Noto Sans SC |
| **localStorage** | 社区投稿、收藏、点赞数据持久化 |

---

## 🎹 键盘快捷键

| 快捷键 | 功能 |
|--------|------|
| `1` | Python |
| `2` | Java |
| `3` | C++ |
| `4` | JavaScript |
| `5` | Go |
| `6` | Rust |
| `7` | Kotlin |
| `8` | 社区 |
| `9` | 收藏 |
| `Ctrl + K` | 聚焦搜索框 |
| `Esc` | 关闭弹窗 |

---

## 🛣️ 后续方向

### 近期
- [ ] 投稿菜谱支持图片上传
- [ ] PWA 离线支持
- [ ] 多语言国际化（英文版）

### 服务端扩展
- [ ] **后端 API 服务** — 将社区投稿、收藏、点赞数据从 localStorage 迁移到服务端数据库
- [ ] **用户系统** — 注册/登录，投稿关联真实作者
- [ ] **评论系统** — 菜谱下方支持用户评论和讨论
- [ ] **排行榜** — 周榜/月榜，增加竞争和粘性

### 架构建议

当前所有用户数据存储在浏览器 `localStorage` 中，仅限单设备使用。扩展服务端后可实现多设备同步：

```
推荐技术栈：
├── 后端框架：Node.js (Express/Koa) 或 Python (FastAPI/Flask)
├── 数据库：PostgreSQL / MongoDB
├── 认证：JWT / OAuth 2.0
├── 文件存储：MinIO / AWS S3 / 阿里云 OSS
└── 部署：Docker + Nginx
```

---

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

> ⚠️ **安全提醒**：`js/config.js` 包含可灵 API 密钥，已被 `.gitignore` 排除。提交代码前请确认未将密钥文件加入版本控制。

---

## 📄 许可证

MIT License — 自由使用、修改和分发。

---

> 吃饱了，才有力气 debug。

<div align="center">

**Made with ❤️ & 🍳 by Programmers**

</div>

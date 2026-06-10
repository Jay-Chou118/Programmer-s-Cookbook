# 🍳 Programmer's Cookbook

> 当编程语言的关键字遇上人间烟火气，每一行代码都值得被用心烹饪

<div align="center">

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML-5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/zh-CN/docs/Web/HTML)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![GSAP](https://img.shields.io/badge/GSAP-3.12-88CE02?logo=gsap&logoColor=white)](https://gsap.com/)

**编程语言关键字 x 美食菜谱 · 7 种语言 · 28+ 道菜谱 · 社区投稿 · 收藏点赞**

</div>

---

## ✨ 功能亮点

### 🎨 视觉体验
- **玻璃态拟物设计** — 半透明卡片 + 动态光效
- **代码雨特效** — Matrix 风格背景，程序员专属浪漫
- **明暗主题切换** — 一键切换深色/浅色模式
- **语言主题配色** — 每种编程语言拥有独立的主题色

### 🍳 制作助手
- **倒计时器** — 根据菜谱预计用时自动设置倒计时，支持开始/暂停/重置
- **采购清单** — 主料/辅料/调料分类展示，逐项勾选标记"已备齐"
- **TodoList 步骤** — 每个烹饪步骤可勾选，实时进度条追踪完成度
- **完成庆祝** — 全部步骤完成后弹出庆祝动画，计时器自动停止

### 👥 社区投稿
- **自定义菜谱** — 支持用户投稿自己的关键字菜谱（语言、关键字、菜品、原料、步骤）
- **双渠道展示** — 投稿菜谱同时出现在对应语言标签和社区汇总标签
- **本地持久化** — 基于 localStorage 存储，刷新不丢失
- **完整体验** — 社区菜谱同样支持"开始制作"（计时器 + TodoList）

### 🌟 发现与互动
- **今日推荐** — 每天基于日期推荐一道菜谱，点击直接进入制作详情
- **收藏功能** — 一键收藏喜欢的菜谱，独立的"收藏"标签页统一管理
- **点赞功能** — 为喜欢的菜谱点赞，显示点赞计数
- **全局搜索** — 按关键字、菜名、编程语言实时检索
- **键盘快捷键** — 数字键 1-7 切换语言，8 社区，9 收藏，Ctrl+K 聚焦搜索
- **响应式布局** — 完美适配 PC、平板、手机

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

- Python 3.x（系统预装）
- 现代浏览器（Chrome / Firefox / Safari / Edge）

### 本地运行

```bash
# 1. 克隆仓库
git clone https://github.com/Jay-Chou118/Programmer-s-Cookbook.git
cd "Programmer's Cookbook"

# 2. 启动本地服务
python3 -m http.server 8080

# 3. 浏览器打开
# http://localhost:8080
```

> 💡 文件夹名含单引号，终端中需用引号包裹：`cd "Programmer's Cookbook"`

---

## 📁 项目结构

```
Programmer's Cookbook/
├── index.html          # 页面骨架 + CDN 库引入
├── css/
│   ├── style.css       # 基础样式：卡片、搜索框、代码雨、主题切换
│   ├── detail.css      # 详情页样式：模态框、计时器、进度条、TodoList
│   ├── welcome.css     # 欢迎弹窗、投稿表单、浮动按钮样式
│   └── features.css    # 今日推荐、收藏/点赞按钮样式
├── js/
│   ├── data.js         # 菜谱数据：7 种语言共 28 道官方菜谱
│   ├── effects.js      # 视觉特效：粒子背景、代码雨、GSAP 动画
│   ├── ui.js           # 核心交互：卡片渲染、标签切换、搜索、主题切换
│   ├── detail.js       # 制作助手：计时器、TodoList、采购清单
│   ├── welcome.js      # 欢迎弹窗、投稿表单、社区菜谱渲染
│   ├── features.js     # 今日推荐、收藏/点赞、收藏页渲染
│   └── main.js         # 入口脚本：初始化、键盘快捷键、统计信息
└── README.md
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
| **Vanilla JavaScript** | 全部交互逻辑 |
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
- [ ] 为菜谱增加配图（AI 生成或实拍）
- [ ] 投稿菜谱支持图片上传
- [ ] PWA 离线支持
- [ ] 多语言国际化（英文版）

### 服务端扩展
- [ ] **后端 API 服务** — 将社区投稿、收藏、点赞数据从 localStorage 迁移到服务端数据库，实现多设备同步
- [ ] **用户系统** — 注册/登录，投稿关联真实作者，收藏和点赞跨设备保留
- [ ] **数据管理后台** — 审核社区投稿、管理官方菜谱、查看统计数据
- [ ] **评论系统** — 菜谱下方支持用户评论和讨论
- [ ] **投稿图片存储** — 对接对象存储（如 S3/OSS）保存菜谱配图

### 架构建议

当前所有用户数据（投稿、收藏、点赞）存储在浏览器 `localStorage` 中，仅限单设备单浏览器使用。扩展服务端后可实现：

```
推荐技术栈：
├── 后端框架：Node.js (Express/Koa) 或 Python (FastAPI/Flask)
├── 数据库：PostgreSQL / MongoDB
├── 认证：JWT / OAuth 2.0
├── 文件存储：MinIO / AWS S3 / 阿里云 OSS
└── 部署：Docker + Nginx
```

前端只需将 `localStorage` 读写替换为 `fetch` API 调用，页面结构和交互逻辑无需大改。

---

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

也欢迎直接在网页中通过**社区投稿**功能提交你的关键字菜谱！

---

## 📄 许可证

MIT License — 自由使用、修改和分发。

---

> 吃饱了，才有力气 debug。

<div align="center">

**Made with ❤️ & 🍳 by Programmers**

</div>

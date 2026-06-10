# 🍳 Programmer's Cookbook

> 用代码的温度，烹饪生活的美味

<div align="center">

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML-5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/zh-CN/docs/Web/HTML)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![JavaScript](https://img.shields.io/badge/JS-Vanilla-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)

**一个以编程语言关键字为菜名的趣味菜谱网页**

</div>

---

## 📖 项目简介

这是一本专属于程序员的菜谱——每一道菜，都以编程语言的关键字命名。

- 🐍 **Python** 区的 `import` 番茄炒蛋、`def` 红烧肉、`for` 韭菜鸡蛋饺子
- ☕ **Java** 区的 `class` 麻婆豆腐、`public static void main` 宫保鸡丁、`new` 炸春卷
- ⚡ **C++** 区的 `template` 白菜猪肉水饺、`while` 土豆炖牛肉、`return` 回锅肉
- 🟨 **JavaScript** 区的 `function` 火腿三明治、`const` 扬州炒饭、`async/await` 豪华泡面

每道菜谱包含：
- **关键字释义** — 该关键字在对应语言中的标准定义
- **取名创意** — 关键字与菜品之间的趣味关联
- **原料明细** — 主料 / 辅料 / 调料，用量精确
- **烹饪步骤** — 可直接上手制作的详细做法

---

## 🚀 快速开始

### 环境要求

- Python 3.x（系统预装）
- 现代浏览器（Chrome / Firefox / Safari / Edge）

### 本地运行

**1. 克隆仓库**

```bash
git clone https://github.com/Jay-Chou118/Programmer-s-Cookbook.git
cd "Programmer's Cookbook"
```

> 💡 **注意**：文件夹名包含单引号 `'`，在终端中需要转义或使用引号包裹。

**2. 启动本地服务**

```bash
# macOS / Linux
python3 -m http.server 6666

# Windows (PowerShell / CMD)
python -m http.server 6666
```

**3. 访问页面**

浏览器打开 → http://localhost:6666

**4. 停止服务**

终端中按下 `Ctrl + C`

---

## 📁 项目结构

```
Programmer's Cookbook/
└── index.html          # 唯一文件：HTML + CSS + JS + 所有菜谱内容
```

项目采用**极简设计**——所有代码整合在单个 HTML 文件中，无构建工具、无后端、无数据库，开箱即用。

---

## 🎨 技术选型

| 技术 | 用途 | 说明 |
|------|------|------|
| **HTML5** | 页面结构 | 语义化标签，SEO 友好 |
| **Tailwind CSS** (CDN) | 样式框架 | Utility-first，快速构建响应式布局 |
| **Vanilla JavaScript** | 交互逻辑 | 标签切换、卡片渲染、一键复制 |
| **Google Fonts** | 字体 | Fira Code（代码字体）+ Noto Sans SC（中文字体） |

---

## 🖥️ 功能特性

- ✅ **语言分类导航** — 点击标签切换 Python / Java / C++ / JavaScript 专区
- ✅ **菜谱卡片** — 关键字高亮、释义、创意、原料、步骤五大模块
- ✅ **悬浮动效** — 卡片上浮 + 阴影加深，增强交互反馈
- ✅ **一键复制** — 点击复制整道菜谱的原料和做法
- ✅ **响应式布局** — 自动适配 PC、平板、手机屏幕
- ✅ **程序员配色** — 每种语言使用其官方品牌色

---

## 🔧 常见问题

### 1. 端口 6666 被占用

```bash
# 更换为其他端口
python3 -m http.server 8080
# 然后访问 http://localhost:8080
```

### 2. 终端 cd 进入目录报错

文件夹名 `Programmer's Cookbook` 包含单引号，需要正确转义：

```bash
# macOS / Linux
cd ~/Desktop/Programmer\'s\ Cookbook

# 或使用双引号
cd ~/Desktop/"Programmer's Cookbook"

# Windows (PowerShell)
cd Desktop\"Programmer's Cookbook"
```

### 3. Git 推送失败

若提示 `remote origin already exists`：

```bash
git remote remove origin
git remote add origin https://github.com/Jay-Chou118/Programmer-s-Cookbook.git
git push -u origin main
```

若提示认证失败，请提前配置 GitHub SSH 密钥或 Personal Access Token。

### 4. 离线时样式失效

项目通过 CDN 引入 Tailwind CSS 和 Google Fonts，离线或无网络时样式会回退到浏览器默认样式。如需纯离线使用，可将样式文件下载到本地引入。

---

## 🛣️ 后续拓展方向

### 内容拓展

- [ ] 新增编程语言专区：Go、Rust、PHP、C# 等
- [ ] 扩充各语言关键字菜谱（每个语言 5-10 道）
- [ ] 为每道菜谱增加菜品配图

### 功能交互

- [ ] 全局搜索框 — 按语言、关键字、菜名检索
- [ ] 明暗主题切换
- [ ] 菜谱收藏 / 点赞功能
- [ ] 随机抽取"今日程序员菜品"

### 架构优化

- [ ] 将 CSS / JS 拆分为独立文件
- [ ] 添加页面加载动画和分类切换过渡
- [ ] 增加打印样式优化

---

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

## 📄 许可证

MIT License — 自由使用、修改和分发。

---

## 🙏 致谢

感谢每一位"用代码调味生活"的程序员厨师。

> 吃饱了，才有力气 debug。

---

<div align="center">

**Made with 💻 & 🍳 by Programmers, for Programmers**

⭐ 如果这个项目让你会心一笑，请给个 Star 吧！

</div>

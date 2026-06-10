# 🍳 Programmer's Cookbook

> 用代码的温度，烹饪生活的美味

<div align="center">

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML-5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/zh-CN/docs/Web/HTML)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![GSAP](https://img.shields.io/badge/GSAP-3.12-88CE02?logo=gsap&logoColor=white)](https://gsap.com/)
[![Three.js](https://img.shields.io/badge/Three.js-r128-000000?logo=three.js&logoColor=white)](https://threejs.org/)

**一个以编程语言关键字为菜名的趣味菜谱网页 · 增强交互版**

[🍳 在线预览](https://jay-chou118.github.io/Programmer-s-Cookbook/) · [📖 查看源码](https://github.com/Jay-Chou118/Programmer-s-Cookbook)

</div>

---

## ✨ 功能亮点

### 🎨 视觉体验
- **玻璃态拟物设计** — 现代感十足的半透明卡片，配合动态光效
- **粒子背景动画** — 使用 Particles.js 打造流动的星空效果
- **代码雨特效** — Matrix 风格的背景代码雨，程序员专属浪漫
- **自定义光标** — 磁性吸附式光标，悬停交互反馈
- **明暗主题切换** — 一键切换深色/浅色模式

### 🎬 交互动画
- **GSAP 动画引擎** — 流畅的卡片入场、标签切换动画
- **悬浮动效** — 卡片悬浮上浮 + 光泽扫过 + 阴影加深
- **Toast 通知** — 优雅的操作反馈提示
- **键盘快捷键** — 数字键 1-4 切换语言，Ctrl+K 聚焦搜索

### 🔍 实用功能
- **全局搜索** — 按关键字、菜名、编程语言实时检索
- **一键复制** — 复制完整菜谱（原料 + 做法）到剪贴板
- **难度/时间/热量** — 每道菜标注烹饪信息
- **响应式布局** — 完美适配 PC、平板、手机

---

## 📖 项目简介

这是一本专属于程序员的菜谱——每一道菜，都以编程语言的关键字命名。

| 语言 | 关键字菜谱 |
|------|-----------|
| 🐍 **Python** | `import` 番茄炒蛋 · `def` 红烧肉 · `for` 韭菜鸡蛋饺子 · `if/else` 酸辣土豆丝 |
| ☕ **Java** | `class` 麻婆豆腐 · `public static void main` 宫保鸡丁 · `new` 炸春卷 · `interface` 广式月饼 |
| ⚡ **C++** | `template` 白菜猪肉水饺 · `while` 土豆炖牛肉 · `return` 回锅肉 · `namespace` 鸳鸯火锅 |
| 🟨 **JavaScript** | `function` 火腿三明治 · `const` 扬州炒饭 · `async/await` 豪华泡面 · `this` 蛋炒饭 |

每道菜谱包含：
- **关键字释义** — 该关键字在对应语言中的标准定义
- **取名创意** — 关键字与菜品之间的趣味关联
- **原料明细** — 主料 / 辅料 / 调料，用量精确
- **烹饪步骤** — 可直接上手制作的详细做法
- **烹饪信息** — 难度、时间、热量标注

---

## 🚀 快速开始

### 环境要求

- Python 3.x（系统预装）
- 现代浏览器（Chrome / Firefox / Safari / Edge）
- 稳定的网络连接（CDN 资源加载）

### 本地运行

**1. 克隆仓库**

```bash
# macOS / Linux
git clone https://github.com/Jay-Chou118/Programmer-s-Cookbook.git
cd "Programmer's Cookbook"

# Windows (PowerShell)
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
├── index.html          # 唯一文件：HTML + CSS + JS + 所有菜谱内容
└── README.md           # 项目说明文档
```

项目采用**极简设计**——所有代码整合在单个 HTML 文件中，无构建工具、无后端、无数据库，开箱即用。

---

## 🛠️ 技术栈

| 技术 | 用途 | 说明 |
|------|------|------|
| **HTML5** | 页面结构 | 语义化标签，SEO 友好 |
| **Tailwind CSS** (CDN) | 样式框架 | Utility-first，快速构建响应式布局 |
| **GSAP** | 动画引擎 | 专业级 Web 动画，流畅过渡效果 |
| **Three.js** | 3D 背景 | 代码雨特效渲染 |
| **Particles.js** | 粒子系统 | 星空粒子背景动画 |
| **Vanilla JavaScript** | 交互逻辑 | 标签切换、搜索、复制、主题切换 |
| **RemixIcon** | 图标库 | 丰富的开源图标资源 |
| **Google Fonts** | 字体 | Fira Code（代码字体）+ Noto Sans SC（中文字体） |

---

## 🎹 键盘快捷键

| 快捷键 | 功能 |
|--------|------|
| `1` | 切换到 Python 专区 |
| `2` | 切换到 Java 专区 |
| `3` | 切换到 C++ 专区 |
| `4` | 切换到 JavaScript 专区 |
| `Ctrl + K` | 聚焦搜索框 |

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

项目通过 CDN 引入 Tailwind CSS、GSAP、Three.js 等库，离线或无网络时样式和动画会失效。如需纯离线使用，可将这些库下载到本地引入。

### 5. 页面加载慢

由于使用了多个 CDN 资源，首次加载可能需要几秒。建议：
- 使用较新版本的浏览器
- 确保网络连接稳定
- 或使用本地缓存工具

---

## 🛣️ 后续拓展方向

### 内容拓展
- [ ] 新增编程语言专区：Go、Rust、PHP、C# 等
- [ ] 扩充各语言关键字菜谱（每个语言 8-10 道）
- [ ] 为每道菜谱增加菜品配图（AI 生成或实拍）
- [ ] 增加"程序员冷知识"小贴士

### 功能交互
- [ ] 菜谱收藏功能（localStorage 持久化）
- [ ] 随机抽取"今日程序员菜品"
- [ ] 难度/菜系标签筛选
- [ ] 打印样式优化
- [ ] PWA 支持（离线可用）

### 架构优化
- [ ] 将 CSS / JS 拆分为独立文件
- [ ] 添加页面加载动画
- [ ] 增加分类切换过渡动画
- [ ] 引入 Vue/React 重构（可选）

---

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

欢迎提交 Issue 和 PR，一起让这个项目更有趣！

---

## 📄 许可证

MIT License — 自由使用、修改和分发。

---

## 🙏 致谢

- [Tailwind CSS](https://tailwindcss.com/) — 实用优先的 CSS 框架
- [GSAP](https://gsap.com/) — 专业级 Web 动画库
- [Three.js](https://threejs.org/) — WebGL 3D 库
- [Particles.js](https://vincentgarreau.com/particles.js/) — 粒子背景动画
- [RemixIcon](https://remixicon.com/) — 开源图标库
- [Google Fonts](https://fonts.google.com/) — 免费字体资源

感谢每一位"用代码调味生活"的程序员厨师。

> 吃饱了，才有力气 debug。

---

<div align="center">

**Made with 💻 & 🍳 by Programmers, for Programmers**

⭐ 如果这个项目让你会心一笑，请给个 Star 吧！

</div>

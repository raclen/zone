# Zone - Anhe 个人空间

Anhe 的个人空间站点，使用 Astro 构建的纯静态网站，部署在 Cloudflare Pages。

## 🌐 在线访问

- **生产站点**：https://raclen.cyou
- **GitHub 仓库**：https://github.com/raclen/zone

## 📂 站点结构

```
https://raclen.cyou/
├── /                    → 个人空间首页（项目导航）
└── /anheplayer/         → AnhePlayer 播放器介绍与下载
```

## 🎨 特性

### 个人空间首页 (`/`)
- 简洁的个人介绍
- 项目卡片网格展示
- 响应式布局，易于扩展

### AnhePlayer 页面 (`/anheplayer/`)
- **深色科技感视觉**：深蓝→紫渐变、品牌蓝霓虹光晕、毛玻璃卡片
- **动态版本与下载**：从 GitHub Releases API 自动拉取最新版本、安装包链接与累计下载量
- **智能系统识别**：自动推荐当前操作系统对应的安装包
- **健壮兜底**：API 失败时回退到静态直链，保证下载按钮始终可用
- **响应式设计**：桌面端、平板、移动端全覆盖
- **SEO 友好**：完整 meta、Open Graph、sitemap

## 📦 技术栈

- **框架**：[Astro](https://astro.build/) 5.x（纯静态输出，无 SSR）
- **样式**：原生 CSS（CSS 变量 + 响应式 + 深色主题）
- **图标**：内联 SVG
- **部署**：Cloudflare Pages

## 🚀 快速开始

### 环境要求

- Node.js 22+
- pnpm 9+

### 安装依赖

```bash
pnpm install
```

### 本地开发

```bash
pnpm dev
```

访问 `http://localhost:4321`

### 构建生产版本

```bash
pnpm build
```

生成静态文件到 `dist/` 目录。

### 预览构建产物

```bash
pnpm preview
```

## 🌍 部署到 Cloudflare Pages

### 方式一：Git 连接（推荐，自动 CI）

1. 推送代码到 GitHub 仓库。
2. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/) → Pages → 创建项目 → 连接 Git 仓库。
3. 选择 `raclen/zone` 仓库。
4. 构建配置：
   - **Framework preset**: Astro
   - **Build command**: `npm run build`
   - **Output directory**: `dist`
   - **Root directory**: `/`
   - **Node version**: 22（环境变量 `NODE_VERSION=22`）
5. 点击部署，Cloudflare 会自动构建并上线。
6. 绑定自定义域名：Pages 项目 → 自定义域 → 添加 `raclen.cyou` → 按引导配置 DNS。

每次 `git push` 到 main 分支，Cloudflare 会自动触发重新构建。

### 方式二：Wrangler CLI 直传

适合快速上线或本地部署，无需 Git 仓库。

```bash
# 构建
pnpm build

# 部署（首次会提示登录 Cloudflare 账号）
npx wrangler pages deploy dist --project-name zone
```

后续更新只需重新 `build` + `deploy`。

**注意**：CLI 部署不会自动触发 CI，适合手动发布或测试环境。生产环境推荐方式一。

## 🔧 配置与定制

### 更新站点域名

编辑 `astro.config.mjs`（已配置为 `https://raclen.cyou`）：

```js
export default defineConfig({
  site: "https://raclen.cyou", // 更改域名后需更新
  // ...
});
```

同时更新 `public/robots.txt` 中的 sitemap URL。

### 添加新页面

在 `src/pages/` 创建新的 `.astro` 文件：

```
src/pages/
├── index.astro          # 首页
├── anheplayer/
│   └── index.astro      # 播放器介绍
├── blog/
│   └── index.astro      # 博客（示例）
└── about.astro          # 关于页面（示例）
```

Astro 会自动将文件映射为路由：
- `index.astro` → `/`
- `about.astro` → `/about`
- `blog/index.astro` → `/blog/`

### 调整配色

编辑 `src/styles/global.css` 中的 CSS 变量（`:root` 块）：

```css
:root {
  --brand: #1677f2; /* 主品牌色 */
  --brand-bright: #20a7ff; /* 高亮色 */
  /* ... */
}
```

### 修改 AnhePlayer 功能卡片

编辑 `src/data/features.ts`，新增/修改功能条目。图标 key 在 `src/components/Features.astro` 的 `icons` 对象中映射。

### 新增/调整平台安装包

编辑 `src/data/platforms.ts`：

- 修改 `PLATFORMS` 数组添加新平台。
- 调整 `match` 子串以匹配 GitHub Release 的文件名。
- 更新 `fallbackUrl` 规则（如文件名格式变化）。

无需改动模板组件，下载区会自动适配。

## 📂 项目结构

```
zone/
├── public/              # 静态资源（favicon、logo、robots.txt、og-image）
├── src/
│   ├── assets/          # 图片等资源（Astro 优化）
│   │   ├── logo.svg
│   │   └── screenshots/ # 播放器截图
│   ├── components/      # UI 组件（Nav/Hero/Features...）
│   ├── data/            # 数据文件（features/platforms）
│   ├── layouts/         # 布局模板（Layout.astro）
│   ├── pages/           # 路由页面
│   │   ├── index.astro          # 首页
│   │   └── anheplayer/
│   │       └── index.astro      # 播放器介绍
│   └── styles/          # 全局样式（global.css）
├── astro.config.mjs     # Astro 配置
├── package.json
└── README.md
```

## 🛠 开发注意事项

- **页面路由**：`src/pages/` 下的目录结构直接映射为 URL 路径。
- **组件复用**：`Layout.astro`、`global.css` 等可跨页面复用。
- **API 兜底**：AnhePlayer 下载区同时实现了 API 动态拉取与静态兜底，确保用户始终能下载（即使 GitHub API 限流/断网）。
- **版本号硬编码**：`platforms.ts` 中的 `FALLBACK_VERSION` 需手动与最新 Release 保持同步（每次发版后更新一次）。
- **响应式测试**：开发完成后务必用浏览器 DevTools 测试移动端/平板视口，验证导航菜单、按钮、网格布局正常。

## 🐛 常见问题

**Q: 下载按钮一直显示"载入中"？**  
A: 检查浏览器控制台是否有 CORS 或网络错误。GitHub API 有匿名请求频率限制（60次/小时/IP），超限后会触发兜底逻辑，按钮仍可用但显示兜底版本。

**Q: 本地开发时图片 404？**  
A: 确保图片文件已放入 `src/assets/` 且在组件中正确 import。`public/` 目录的文件用绝对路径 `/filename` 引用。

**Q: 构建时 TypeScript 报错？**  
A: 运行 `pnpm astro check` 查看详细错误。常见原因：data 文件类型不匹配、import 路径错误。

**Q: Cloudflare Pages 构建失败？**  
A: 检查构建日志：
  1. Node 版本是否设为 22
  2. Build command 是否为 `npm run build`（Cloudflare 自动用 npm，即使本地用 pnpm）
  3. 依赖安装是否成功（检查 `package.json` 与 lock 文件是否提交）

## 📄 开源协议

本项目代码采用 MIT 协议开源。

AnhePlayer 播放器本身基于 [MusicFreeDesktop](https://github.com/maotoumao/MusicFreeDesktop)，采用 AGPL-3.0 协议。

## 🙏 致谢

- AnhePlayer 基于 [MusicFreeDesktop](https://github.com/maotoumao/MusicFreeDesktop)
- 构建于 [Astro](https://astro.build/)
- 部署在 [Cloudflare Pages](https://pages.cloudflare.com/)

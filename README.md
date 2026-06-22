# Zone

`zone` 是我的个人站点仓库，基于 Astro 构建，部署在 Cloudflare Pages。

当前站点包含三块主要内容：

- `/`：个人首页
- `/blog`：博客文章、标签、归档、搜索、RSS
- `/anheplayer`：AnhePlayer 介绍与下载页

## 在线地址

- 生产站点：`https://raclen.cyou`
- GitHub 仓库：`https://github.com/raclen/zone`

## 技术栈

- Astro 6
- Tailwind CSS 4
- MD/MDX 内容系统
- Pagefind 搜索
- Giscus 评论
- Cloudflare Pages

## 本地开发

环境要求：

- Node.js 22+
- pnpm 9+

安装依赖：

```bash
pnpm install
```

启动开发环境：

```bash
pnpm dev
```

默认访问地址：

```text
http://localhost:4321
```

构建生产版本：

```bash
pnpm build
```

预览构建产物：

```bash
pnpm preview
```

## 站点结构

```text
https://raclen.cyou/
├── /                    个人首页
├── /blog                博客列表
├── /blog/[slug]         文章详情
├── /tags                标签页
├── /archives            归档页
├── /search              搜索页
├── /rss.xml             RSS
└── /anheplayer          AnhePlayer 页面
```

## 内容与评论

博客文章位于 `src/content/blog/`。

评论系统使用 Giscus，配置在 [astro-paper.config.ts](/home/ubuntu/Github/zone/astro-paper.config.ts)：

- `repo`: `raclen/zone`
- `category`: `General`
- `mapping`: `url`
- `theme`: `preferred_color_scheme`

Giscus 的详细配置说明见 [GISCUS_SETUP.md](/home/ubuntu/Github/zone/GISCUS_SETUP.md)。

## 自动同步文章

仓库保留了一个文章同步脚本：

```bash
pnpm sync-blog
```

它会从 `raclen/raclen.github.io` 仓库中拉取带 `blog` 标签的 Issues，并同步到本仓库的 `src/content/blog/`。

GitHub Actions 工作流文件是 [.github/workflows/sync-blog.yml](/home/ubuntu/Github/zone/.github/workflows/sync-blog.yml)。

当前行为：

- 只同步文章，不再同步评论 JSON
- 自动提交 `src/content/blog/*.md` 和 `src/content/blog/.sync-meta.json`
- 支持手动触发 `workflow_dispatch`

当前定时执行时间：

- 北京时间每天 `08:00`
- 北京时间每天 `20:00`

说明：

- GitHub Actions 的 `cron` 使用 UTC，所以配置为 `0 0,12 * * *`

## 部署到 Cloudflare Pages

推荐直接连接 GitHub 仓库部署。

建议构建配置：

- Framework preset：`Astro`
- Build command：`npm run build`
- Output directory：`dist`
- Root directory：`/`
- Node version：`22`

每次推送到 `main` 后，Cloudflare Pages 会自动重新构建。

## 关键配置文件

- [astro-paper.config.ts](/home/ubuntu/Github/zone/astro-paper.config.ts)：站点信息、分页、功能开关、分享链接、Giscus
- [astro.config.mjs](/home/ubuntu/Github/zone/astro.config.mjs)：Astro 构建配置
- [src/content.config.ts](/home/ubuntu/Github/zone/src/content.config.ts)：内容集合定义
- [scripts/sync-blog.js](/home/ubuntu/Github/zone/scripts/sync-blog.js)：Issue 到文章的同步脚本
- [.github/workflows/sync-blog.yml](/home/ubuntu/Github/zone/.github/workflows/sync-blog.yml)：文章同步定时任务

## 项目目录

```text
zone/
├── public/
├── scripts/
├── src/
│   ├── components/
│   ├── content/
│   │   └── blog/
│   ├── data/
│   ├── layouts/
│   ├── pages/
│   ├── styles/
│   └── utils/
├── .github/workflows/
├── astro-paper.config.ts
├── astro.config.mjs
├── package.json
└── README.md
```

## 常用命令

```bash
pnpm dev
pnpm build
pnpm preview
pnpm sync-blog
```

## 许可

本仓库代码采用 MIT 协议。

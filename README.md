# Zone

`zone` 是我的个人站点仓库，基于 Astro 构建，部署在 Cloudflare Pages。

当前站点包含三块主要内容：

- `/`：个人首页
- `/blog`：博客文章、标签、归档、搜索、RSS
- `/llm-api`：大模型 API 中转站导航（公益 / 收费分类）

AnhePlayer 介绍与下载页已拆分为独立项目（`cf-anheplayer`），独立域名部署。

## 在线地址

- 生产站点：`https://raclen.ee.cd`
- AnhePlayer 站点：`https://anhe-player.loc.cc`
- GitHub 仓库：`https://github.com/raclen/zone`

## 技术栈

- Astro 6
- Tailwind CSS 4
- MD/MDX 内容系统
- Pagefind 搜索
- CWD 评论（自建，Cloudflare Workers + D1 + KV）
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
https://raclen.ee.cd/
├── /                    个人首页
├── /blog                博客列表
├── /blog/[slug]         文章详情
├── /tags                标签页
├── /archives            归档页
├── /friends             友链页
├── /about               关于我
├── /search              搜索页
├── /rss.xml             RSS
└── /llm-api             大模型 API 中转站导航
```

## 友链信息

提供给其他博主添加友链时的信息：

```yaml
- title: 当下的七炎
  intro: 记录技术、工具、投资与日常思考。
  link: https://raclen.ee.cd
  image: https://avatars.githubusercontent.com/u/7697758?v=4
```

已收录的友链数据在 [src/data/friends.ts](src/data/friends.ts)，页面模板在 [src/pages/friends/index.astro](src/pages/friends/index.astro)。

## 内容与评论

博客文章位于 `src/content/blog/`。

评论系统使用自建的 **CWD**（Cloudflare Workers + D1 + KV），组件在 [CwdComments.astro](src/pages/blog/_components/CwdComments.astro)，配置在 [astro-paper.config.ts](astro-paper.config.ts)：

- `provider`: `cwd`
- `apiBaseUrl`: `https://cwd-api.raclen.qzz.io`
- `siteId`: `raclen.qzz.io`
- `canonicalOrigin`: `https://raclen.ee.cd`
- `widgetSrc`: `/vendor/cwd-widget/0.2.0-raclen.2/cwd.js`（产物已本地化，不依赖第三方 CDN）

与 Giscus 的关键差异：CWD 以**路径**而不是完整 URL 聚合评论，所以后续更换自定义域名时，评论和点赞不会按域名分裂。

本站自编译版还额外做了两处调整：

- 评论表单默认收起成一行「写评论」入口，点击后展开（`collapseForm`）
- 文章点赞条改为紧凑单行，去掉上游版本在评论区顶部留出的大片空白（`compactLikeBar`）

> 如需回退到 Giscus：还原 `src/pages/blog/_components/GiscusComments.astro`
> （`git show <commit>:src/pages/blog/_components/GiscusComments.astro`），并启用
> `astro-paper.config.ts` 中注释掉的 `giscus` 配置块。注意旧讨论是按完整 URL 建立的，
> 回退后只有那一份 URL 的讨论能被匹配到。

Giscus 时期的历史配置说明见 [GISCUS_SETUP.md](GISCUS_SETUP.md)（仅作存档）。

## 自动同步文章

仓库保留了一个文章同步脚本：

```bash
pnpm sync-blog
```

它会从 `raclen/zone` 仓库中拉取带 `blog` 标签的 open Issues，并同步到本仓库的 `src/content/blog/`。

GitHub Actions 工作流文件是 [.github/workflows/sync-blog.yml](.github/workflows/sync-blog.yml)。

当前行为：

- 只同步文章，不再同步评论 JSON
- 只读取带 `blog` 标签的 open Issues，避免普通 Issue 混入文章列表
- 取消 `blog` 标签或关闭的 Issue，对应文章会被删除
- 自动提交 `src/content/blog/*.md` 和 `src/content/blog/.sync-meta.json`
- 支持手动触发 `workflow_dispatch`

当前定时执行时间：

- 北京时间每天 `08:00`

说明：

- GitHub Actions 的 `cron` 使用 UTC，所以配置为 `0 0 * * *`

`scripts/` 下另有几个一次性 / 辅助脚本，平时不需要运行：

- [import-md-to-issues.js](scripts/import-md-to-issues.js)：把本地 Markdown 反向导入为 Issues（图片上传到 `blog-assets` 分支）
- [migrate-issues-to-zone.js](scripts/migrate-issues-to-zone.js)：把 `raclen.github.io` 的历史 Issues 迁移到 `zone`
- [tag-blog-issues.js](scripts/tag-blog-issues.js)：按标题 / 内容批量补打或清理 Issue 标签
- [blog-labels.js](scripts/blog-labels.js)：标签颜色映射与标签建议，供上面几个脚本复用

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

- [astro-paper.config.ts](astro-paper.config.ts)：站点信息、分页、功能开关、分享链接、评论（CWD）
- [astro.config.mjs](astro.config.mjs)：Astro 构建配置（站点域名、sitemap、Pagefind、Shiki）
- [src/config.ts](src/config.ts)：给代码消费的已解析配置，一般不改，改 `astro-paper.config.ts`
- [src/content.config.ts](src/content.config.ts)：内容集合定义
- [scripts/sync-blog.js](scripts/sync-blog.js)：Issue 到文章的同步脚本
- [.github/workflows/sync-blog.yml](.github/workflows/sync-blog.yml)：文章同步定时任务

## 项目目录

```text
zone/
├── public/
│   └── vendor/cwd-widget/   CWD 评论前端产物（自编译版本）
├── scripts/                 同步与迁移脚本
├── src/
│   ├── assets/
│   ├── components/
│   ├── content/
│   │   └── blog/            博客文章（自动同步）
│   ├── data/                友链、功能特性等静态数据
│   ├── i18n/
│   ├── layouts/
│   ├── pages/               页面与路由
│   ├── scripts/
│   ├── styles/
│   ├── types/
│   ├── utils/
│   ├── config.ts
│   └── content.config.ts
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

本仓库代码采用 MIT 协议，见 [LICENSE](LICENSE)。

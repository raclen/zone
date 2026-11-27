# Zone

`zone` 是七炎的个人站点「当下的七炎」仓库，记录技术、工具、投资与日常思考。基于 Astro 生成静态页面，部署目标为 Cloudflare Pages。

当前站点包含四块主要内容：

- `/`：个人首页与作品入口
- `/blog`：博客文章、标签、归档、搜索、RSS
- `/daily`：每日分享，按月份归档工具、链接与简短笔记
- `/llm-api`：大模型 API 中转站导航（公益 / 收费分类）

AnhePlayer 介绍与下载页已拆分为独立项目（`cf-anheplayer`），独立域名部署。

本仓库不是音乐播放器本体。`package.json` 中的 `anheplayer-web` 名称和宣传页描述属于历史元数据，项目定位以本文及当前页面实现为准。

## 在线地址

- 主站：[raclen.top](https://raclen.top)（当前构建与 canonical 配置）
- AnhePlayer 站点：[anhe-player.loc.cc](https://anhe-player.loc.cc)
- GitHub 仓库：[raclen/zone](https://github.com/raclen/zone)
- 通用博客模板：[raclen/issue-blog](https://github.com/raclen/issue-blog)（仅同步可复用模板功能，不携带本站文章、个人页面和私有评论配置）

旧域名 `raclen.ee.cd` 的临时跳转与到期说明见下方「域名与重定向」。这些地址和部署说明依据仓库配置，不代表对线上服务状态的实时核验。

## 技术栈

- Astro 6
- TypeScript
- Tailwind CSS 4
- MD/MDX 内容系统
- Pagefind 搜索
- Shiki 代码高亮、RSS、sitemap、JSON-LD
- CWD 评论（自建，Cloudflare Workers + D1 + KV）
- Cloudflare Pages 静态托管，附带临时域名跳转 Functions

主体站点不需要常驻 Node.js 服务；评论、点赞与阅读量通过独立的 CWD API 提供，并非存储在本站仓库内的评论 JSON。

## 本地开发

环境要求：

- Node.js **22.12.0+**（当前 Astro 6.4.8 的最低要求）
- 推荐 pnpm 9+；仓库同时保留 npm 和 pnpm 锁文件，部署工作流目前使用 npm

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
https://raclen.top/
├── /                    个人首页
├── /blog                博客列表
├── /blog/[slug]         文章详情（同步文章以 Issue 编号为 slug）
├── /tags                标签页
├── /tags/[tag]/[...]    标签下的分页文章列表
├── /archives            归档页
├── /daily               每日分享月份列表
├── /daily/[month]       月度分享（日目录、日期锚点、月份翻页）
├── /friends             友链页（保留页面，导航入口已隐藏）
├── /about               关于我
├── /search              搜索页
├── /rss.xml             RSS
├── /llm-api             大模型 API 中转站导航
├── /llms.txt            面向 AI 抓取的站点摘要与精选文章
└── /llms-full.txt       完整文章清单（元数据，不含全文）
```

当前博客使用 Fuwari 风格的卡片与侧栏布局，包含标签统计、年份归档、阅读目录、阅读进度条、字数 / 阅读时长及代码复制。文章结尾在发表超过 **100 个完整日** 后显示黄色信息时效提醒，依据首次发布日期计算；浏览器打开页面时会重新计算天数，不必等待重新构建。

搜索有顶部弹窗（`Ctrl+K` / `Cmd+K`）和独立 `/search` 页面两个入口。Pagefind 索引在生产构建时生成，验证完整搜索功能应使用 `pnpm build` 后的 `pnpm preview`，不能仅以开发环境判断。

首页展示 AnhePlayer、WeChat Suite、QQ Suite、ETF 投资助手和 issue-blog 等作品；API 导航的数据维护在 [src/pages/llm-api/llm-api.json](src/pages/llm-api/llm-api.json)，本站不提供 API 中转服务本身。

旧版 `/blog/archive` 页面及其专属布局、未引用组件已移除，统一使用 `/archives`；导航中的分享入口名称为「每日分享」。

## 友链信息

提供给其他博主添加友链时的信息：

```yaml
- title: 当下的七炎
  intro: 记录技术、工具、投资与日常思考。
  link: https://raclen.top
  image: https://avatars.githubusercontent.com/u/7697758?v=4
```

已收录的友链数据在 [src/data/friends.ts](src/data/friends.ts)，页面模板在 [src/pages/friends/index.astro](src/pages/friends/index.astro)。

## 内容与评论

博客文章位于 `src/content/blog/`，由 `src/content.config.ts` 中的 `posts` 集合消费；不再保留重复的 `blog` 集合。

Issue 同步文章使用稳定的编号文件名，例如 `200.md` 对应 `/blog/200/`。修改标题不改变 URL；旧标题链接由 `public/_redirects` 跳转到编号链接。同步元数据 `src/content/blog/.sync-meta.json` 中的 `aliases` 同时用于兼容历史评论标识，不能当作可随意删除的缓存。写作与迁移细节见 [BLOG.md](BLOG.md)。

每日分享位于 `src/content/daily/`，使用独立的 `daily` 集合，一个月份对应一个 `YYYY-MM.md` 文件。月页提供日期目录、`day-YYYY-MM-DD` 锚点和相邻月份导航；这里只写轻量条目，不走 GitHub Issues 自动同步。解析器见 [src/utils/parseDaily.ts](src/utils/parseDaily.ts)，页面见 [src/pages/daily/index.astro](src/pages/daily/index.astro) 与 [src/pages/daily/[month].astro](src/pages/daily/[month].astro)。

评论系统使用自建的 **CWD**（Cloudflare Workers + D1 + KV），组件在 [CwdComments.astro](src/pages/blog/_components/CwdComments.astro)，配置在 [astro-paper.config.ts](astro-paper.config.ts)：

- `provider`: `cwd`
- `apiBaseUrl`: `https://cwd-api.raclen.qzz.io`
- `siteId`: `raclen.qzz.io`
- `canonicalOrigin`: `https://raclen.top`
- `widgetSrc`: `/vendor/cwd-widget/0.2.0-raclen.3/cwd.js`（产物已本地化，不依赖第三方 CDN）

评论和文章点赞通过 `postSlug` 路径关联；历史文章优先使用 `.sync-meta.json` 中首个 `aliases` 对应的原路径，而不是新编号路径。PV 则通过 `postUrl` 完整 URL 关联，使用固定的 `canonicalOrigin` 与上述路径组成 URL，避免同一页面因不同访问域名分散计数。不要随意改动 `siteId`、历史别名或已有文章的存储标识。

本站自编译版包含以下调整：

- 评论表单默认收起成一行「写评论」入口，点击后展开（`collapseForm`）
- 文章点赞条改为紧凑单行，去掉上游版本在评论区顶部留出的大片空白（`compactLikeBar`）
- 显式传入的 `postSlug`、`postUrl` 在初始化和主题切换时保持不变，保留历史数据关联

组件来源、校验和回滚约束见 [CWD 0.2.0-raclen.3 说明](public/vendor/cwd-widget/0.2.0-raclen.3/README.md)。旧版 `.2` 保留用于回滚，但不能只切换脚本地址，必须同时恢复旧组件所需的历史 URL 兼容逻辑。

Giscus 时期的配置说明见 [GISCUS_SETUP.md](GISCUS_SETUP.md)（历史存档）。当前评论类型和页面只接入 CWD；恢复 Giscus 需要同时还原组件、类型及页面接线，不能只取消配置注释。旧 Discussions 按完整 URL 映射，也不会自动合并到 CWD。

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
- 取消 `blog` 标签或关闭的 Issue，在下一次有效同步时删除对应的受管文章；若返回的 Issue 列表完全为空，脚本会跳过同步，不执行全量删除
- 使用 `.sync-meta.json` 增量更新，并保留旧文件名别名与路径重定向
- 自动提交 `src/content/blog/*.md`、`src/content/blog/.sync-meta.json` 和 `public/_redirects`
- 支持手动触发 `workflow_dispatch`
- 修改 `main` 分支上的同步工作流文件也会触发；普通页面或文章提交不通过这个 `push` 条件触发同步
- 同步之后固定等待 180 秒，再调用 IndexNow；这不是部署完成检测，提交成功也不保证收录

`pnpm sync-blog` 会写入、更新或删除本地受管文章，并重写路径重定向；不是只读检查命令。脚本只读取进程环境中的 `GITHUB_TOKEN`，不会自动加载 `.env`。本地认证方式及注意事项见 [BLOG.md](BLOG.md)。

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

连接 GitHub 仓库、将 `main` 设为生产分支并开启自动部署后，提交会触发 Cloudflare Pages 重新构建。实际部署成功与否以 Pages 构建日志及线上访问为准。

### 域名与重定向

- 主域名在 `astro.config.mjs` 的 `site`、`astro-paper.config.ts` 的 `site.url` / `comments.canonicalOrigin` 及 `scripts/indexnow.mjs` 中保持为 `https://raclen.top`。
- `public/_redirects` 由同步脚本生成，负责旧文章标题路径到编号路径的 301 跳转，不负责域名级跳转。
- [functions/_middleware.js](functions/_middleware.js) 暂时将 `raclen.ee.cd` 301 到 `raclen.top`，保留路径与查询串。
- 该中间件在 **2026-12-18 08:00（北京时间）** 到期后停止跳转，对应代码中的 `2026-12-18T00:00:00Z`。到期不会自动删除文件；清理前需确认旧域名迁移和长期重定向方案。

### 搜索引擎与 AI 抓取辅助

构建会生成 sitemap，页面包含 canonical、OG 和 JSON-LD；RSS 提供文章订阅。`llms.txt` 提供站点摘要与最多 40 篇精选文章，`llms-full.txt` 提供全部公开文章的链接、日期和摘要，不是全文镜像。

IndexNow 脚本优先读取本地 `dist/sitemap-0.xml`，没有产物时才从内容目录拼接 URL。工作流本身不重新构建本地 `dist`；手动执行前应避免使用旧构建产物。用途、预览与验证步骤见 [INDEXNOW.md](INDEXNOW.md)。以上机制有助于内容发现，不保证被搜索引擎或 AI 服务收录。

## 关键配置文件

- [astro-paper.config.ts](astro-paper.config.ts)：站点信息、分页、功能开关、分享链接、评论（CWD）
- [astro.config.mjs](astro.config.mjs)：Astro 构建配置（站点域名、sitemap、Pagefind、Shiki）
- [src/config.ts](src/config.ts)：给代码消费的已解析配置，一般不改，改 `astro-paper.config.ts`
- [src/content.config.ts](src/content.config.ts)：`posts` 博客与 `daily` 每日分享集合定义
- [scripts/sync-blog.js](scripts/sync-blog.js)：Issue 到文章的同步脚本
- [.github/workflows/sync-blog.yml](.github/workflows/sync-blog.yml)：文章同步定时任务
- [scripts/indexnow.mjs](scripts/indexnow.mjs)：URL 提交脚本
- [functions/_middleware.js](functions/_middleware.js)：有到期时间的旧域名跳转

## 项目目录

```text
zone/
├── functions/               临时旧域名跳转中间件
├── public/
│   ├── _redirects           自动生成的旧文章路径重定向
│   └── vendor/cwd-widget/   CWD 评论前端产物（自编译版本）
├── scripts/                 同步与迁移脚本
├── src/
│   ├── assets/
│   ├── components/
│   ├── content/
│   │   ├── blog/            博客文章（自动同步，posts 集合）
│   │   └── daily/           每日分享（按月手工维护）
│   ├── data/                友链等静态数据
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
pnpm indexnow --dry-run
```

`pnpm indexnow --dry-run` 只预览 URL，不发出提交请求；去掉 `--dry-run` 才会向 IndexNow 提交。

## 文档导航

现行文档：

- [BLOG.md](BLOG.md)：Issue 写作、文章同步、短链接与评论关联
- [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)：当前实现结构、配置职责和维护边界
- [PROJECT_RULES.md](PROJECT_RULES.md)：长期约束与样式、数据兼容规则
- [PAGEFIND_FIX.md](PAGEFIND_FIX.md)：当前搜索实现及排查步骤
- [INDEXNOW.md](INDEXNOW.md)：URL 提交机制与验证

历史存档（不作为当前部署或操作指南）：

- [GISCUS_SETUP.md](GISCUS_SETUP.md)：旧 Giscus 评论方案
- [BLOG_IMPROVEMENTS.md](BLOG_IMPROVEMENTS.md)、[FINAL_SUMMARY.md](FINAL_SUMMARY.md)：早期博客优化与本地评论 JSON 方案
- [DESIGN.md](DESIGN.md)：早期 Figma 营销页面设计参考；当前页面采用 Fuwari 风格，样式以源码与 `PROJECT_RULES.md` 为准

文章数量、页面数量、构建耗时及云服务配额会变化，本文不将历史统计或测试结论作为当前状态。

## 许可

本仓库代码采用 MIT 协议，见 [LICENSE](LICENSE)。

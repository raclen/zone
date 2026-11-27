# 当前实现结构与维护说明

本文描述当前仓库实现，不是某次发布的验收报告。旧版 Astro 5、66 篇文章、标题长链接及固定构建耗时等统计不再作为当前状态依据。

## 项目边界

`zone` 是「当下的七炎」个人站点，包含作品首页、博客、每日分享、关于与友链页面、大模型 API 导航。AnhePlayer 宣传页已拆分为独立项目；本站只保留作品链接。

- 页面：Astro 6 + TypeScript，`output: "static"`。
- 样式：Tailwind CSS 4，AstroPaper 基础样式与 Fuwari 风格卡片 / 侧栏组合。
- 内容：Markdown / MDX，经 Content Collections 校验与转换。
- 搜索：构建期 Pagefind 索引，浏览器端查询。
- 动态互动：独立的 CWD API，Cloudflare Workers + D1 + KV。
- 部署目标：Cloudflare Pages；`functions/_middleware.js` 仅承担临时旧域名跳转。

Node.js 最低版本为 22.12.0。版本范围以 `package.json`、实际安装版本以锁文件和运行环境为准，不把依赖声明当作线上运行版本。

## 数据流

### Issue 博客

```text
raclen/zone 中带 blog 标签的 open Issues
                 ↓
GitHub Actions（北京时间每天 08:00 / 手动 / 工作流文件变更）
                 ↓
scripts/sync-blog.js
                 ↓
编号 Markdown + .sync-meta.json + public/_redirects
                 ↓
自动提交 → 已连接仓库的 Cloudflare Pages 构建
                 ↓
Astro HTML + Pagefind 索引 + RSS + sitemap + llms.txt 清单
```

同步只处理文章，不处理 Issue 评论 JSON。工作流同步后固定等待 180 秒并调用 IndexNow；它既不检查线上部署状态，也不在此步骤重新构建本地 `dist`。详见 [BLOG.md](BLOG.md) 与 [INDEXNOW.md](INDEXNOW.md)。

### 每日分享与导航

- 每日分享：手工维护 `src/content/daily/YYYY-MM.md`，`daily` 集合加载，`parseDaily.ts` 解析日期目录、锚点和月份导航。
- API 导航：维护 `src/pages/llm-api/llm-api.json` 中的 `freeSites` / `paidSites`，页面只展示链接，不提供中转 API。
- 友链：维护 `src/data/friends.ts`；页面保留，顶部导航不提供友链入口。

### 评论、点赞与阅读量

```text
文章 Issue 编号 + .sync-meta.json 历史 aliases
                 ↓
CwdComments.astro 选择稳定路径及固定主域名 URL
                 ↓
自托管 cwd-widget 0.2.0-raclen.3
                 ↓
独立 CWD API（评论 / 点赞 / PV）
```

评论与文章点赞按 `postSlug` 关联，PV 按 `postUrl` 关联。历史文章优先使用原路径，新文章使用当前路径；不要为了统一短链接而更换已有数据标识。CWD 后端源码、D1 数据和 KV 不在本仓库维护，不能把本站 Git 备份当作评论数据备份。

## 配置与目录职责

| 文件 / 目录 | 职责 |
| --- | --- |
| [astro-paper.config.ts](astro-paper.config.ts) | 站点信息、分页、功能开关、社交分享与 CWD 配置 |
| [astro.config.mjs](astro.config.mjs) | 主站 URL、静态构建、MDX、Pagefind、sitemap、Shiki 与 Vite |
| [src/config.ts](src/config.ts) | 解析配置与默认值，日常配置优先修改上面的入口 |
| [src/types/config.ts](src/types/config.ts) | 配置类型；当前评论 provider 仅支持 CWD |
| [src/content.config.ts](src/content.config.ts) | `posts` 与 `daily` 集合、日期与描述转换 |
| [src/layouts/AstroPaperLayout.astro](src/layouts/AstroPaperLayout.astro) | 基础 HTML、主题、SEO 与页面过渡 |
| [src/layouts/FuwariBlogLayout.astro](src/layouts/FuwariBlogLayout.astro) | 通用卡片 / 侧栏布局；文章详情自行组合基础布局和侧栏 |
| [src/components/fuwari](src/components/fuwari) | 文章卡片、个人信息、归档 / 标签挂件、目录和搜索弹窗 |
| [src/pages](src/pages) | 路由、内容页面、RSS 和 AI 抓取辅助端点 |
| [src/styles/astropaper.css](src/styles/astropaper.css) | 当前全局样式入口，导入主题、正文排版及 Fuwari 样式 |
| [scripts/sync-blog.js](scripts/sync-blog.js) | 增量同步、编号文件名、历史别名及路径重定向 |
| [.github/workflows/sync-blog.yml](.github/workflows/sync-blog.yml) | 同步调度、自动提交、固定等待与 IndexNow 调用 |
| [scripts/indexnow.mjs](scripts/indexnow.mjs) | URL 预览与批量提交 |
| [functions/_middleware.js](functions/_middleware.js) | 有到期时间的旧域名 301 |

## 必须保留的兼容边界

1. **文章 URL 与历史映射**：编号路径稳定；保留 `.sync-meta.json` 的 `aliases` 和生成的旧路径重定向。
2. **评论归属**：不要随意改动 `siteId`、历史 `postSlug` 或 `postUrl`；主题切换不能重置文章标识。
3. **组件版本**：CWD 配置、默认值、组件备用地址要指向同一版本目录。不要覆盖旧产物；回滚 `.2` 还需恢复其历史 URL 兼容代码。
4. **域名配置**：`astro.config.mjs`、`astro-paper.config.ts` 和 IndexNow 的主域名应一致；域名变更不等于可以改评论站点标识。
5. **跳转生命周期**：旧域名 `raclen.ee.cd` 的临时中间件在 2026-12-18 08:00（北京时间）停止跳转；到期不会自动删文件，也不能替代长期迁移方案。
6. **内容源**：同步文章在 Issues 修改，避免直接修改生成内容；每日分享独立手工维护，不纳入同步。
7. **凭据**：不把本地 `.env`、后台凭据或 Token 放入公开文档、提交或日志。同步脚本不会自动加载 `.env`。
8. **前端验证**：不编写 UI 单元测试或测试脚手架；前端改动保证构建通过，并向用户列出 UI 影响范围和人工验证 Todo。

布局和排版的具体约束以 [PROJECT_RULES.md](PROJECT_RULES.md) 为准。旧 Figma 分析、JSON 评论总结及 Giscus 配置已标为历史存档，不能反向覆盖当前实现。

## 维护与验证

```bash
pnpm dev
pnpm build
pnpm preview
pnpm indexnow --dry-run
```

- 页面 / 搜索：使用生产构建后的预览；详见 [PAGEFIND_FIX.md](PAGEFIND_FIX.md)。
- 同步失败：先看 GitHub Actions / GitHub API 返回及环境认证，不能因本地文件存在就认为远端同步成功。
- 新文章未上线：区分同步提交、Pages 构建和线上访问三个阶段。
- 评论异常：先检查稳定路径、`siteId`、组件版本与 API 请求，不能直接清空别名或迁移数据。
- 收录异常：区分 URL 提交成功、搜索引擎抓取和实际收录，三者不是同一状态。

文章数、索引页面数、构建耗时、GitHub / Cloudflare 配额等应按当次日志或账号状态验证。本文不宣称线上部署、浏览器交互或历史性能测试已重新通过。

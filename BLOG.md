# 博客内容与同步指南

博客使用 GitHub Issues 作为同步文章的内容源，经 GitHub Actions 生成 Markdown，再由 Astro 构建为静态页面。当前主站为 [raclen.top](https://raclen.top)，评论由独立 CWD 服务提供，**不再同步 Issue 评论 JSON**。

## 功能与目录

- Fuwari 风格文章卡片、侧栏、标签统计与年份归档
- Pagefind 中文全文搜索：顶部弹窗及独立搜索页
- 阅读目录、进度条、字数 / 阅读时长、代码复制、文章分享与 RSS
- 文章首次发表超过 100 个完整日后显示信息时效提醒
- CWD 评论、文章点赞与阅读量，读者无需 GitHub 账号

```text
src/
├── content.config.ts                       posts 与 daily 集合定义
├── content/
│   ├── blog/
│   │   ├── <issue-number>.md                自动同步的文章
│   │   └── .sync-meta.json                  更新记录与历史文件名别名
│   └── daily/<YYYY-MM>.md                   手工维护的每日分享
├── components/fuwari/
│   ├── FuwariBentoCard.astro                文章卡片
│   └── FuwariSearchModal.astro              顶部搜索弹窗
├── layouts/FuwariBlogLayout.astro           卡片与侧栏布局
└── pages/
    ├── blog/index.astro                    博客列表
    ├── blog/[slug].astro                   文章详情
    ├── blog/_components/CwdComments.astro  CWD 集成
    ├── archives/index.astro                年份归档
    ├── tags/                              标签与分页文章
    ├── search.astro                        独立搜索页
    └── rss.xml.ts                          RSS

scripts/sync-blog.js                        Issue 同步脚本
.github/workflows/sync-blog.yml             定时同步与 IndexNow 提交
public/_redirects                          自动生成的旧文章路径重定向
```

## 在 GitHub Issues 中写作

1. 在 [raclen/zone Issues](https://github.com/raclen/zone/issues) 创建或编辑文章。
2. **添加 `blog` 标签，并保持 Issue 为 open 状态**；缺少该标签或已关闭的 Issue 不进入同步列表。
3. 使用 Issue 标题作为文章标题，正文使用 Markdown；图片可通过 GitHub 的上传入口插入正文。
4. 其他 Issue 标签会转为文章标签，控制同步的 `blog` 标签不会显示为文章分类。

同步脚本过滤 Pull Requests，并将文章写为 `src/content/blog/<issue-number>.md`。例如 Issue `200` 对应 `/blog/200/`，修改标题不改变文章 URL。

同步生成的文章默认不是草稿。不要把 `blog` 标签用于尚不准备公开的文章，也不要依赖本地修改生成文件中的 `draft` 来长期控制发布。

## 自动与手动同步

### GitHub Actions

工作流为 [.github/workflows/sync-blog.yml](.github/workflows/sync-blog.yml)：

- 定时：UTC `0 0 * * *`，即北京时间每天 **08:00**；调度不保证精确到秒。
- 手动：进入 [同步博客文章工作流](https://github.com/raclen/zone/actions/workflows/sync-blog.yml)，选择 `Run workflow`。
- 推送：仅修改 `main` 分支上的该工作流文件时触发，不是每次普通提交都触发同步。
- 权限：使用内置 `GITHUB_TOKEN`，需要 `contents: write` 才能自动提交文件。
- 提交范围：`src/content/blog/*.md`、`src/content/blog/.sync-meta.json`、`public/_redirects`。
- 同步之后固定等待 180 秒，再调用 IndexNow。固定等待不等于确认 Pages 部署完成。

只有在 Cloudflare Pages 已连接此仓库并启用生产分支自动部署时，文章提交才会触发站点构建；部署结果应查看 Pages 日志和线上页面。

### 本地同步

```bash
pnpm sync-blog
```

**这是会修改内容的命令**：它会新增、覆盖或删除受管文章，并重写 `public/_redirects`。执行前先检查工作区，避免本地对生成文章的修改被覆盖。

脚本只读取进程环境中的 `GITHUB_TOKEN`，不会自行加载 `.env`。公开仓库可以不带 Token 读取，但会受未认证 API 限流影响；需要认证时，从安全的本地配置或会话环境注入，不能把 Token 写进文档或提交到 Git。

若已经自行准备了不入库的 `.env`，可显式让 Node.js 加载：

```bash
node --env-file=.env scripts/sync-blog.js
```

仓库没有提供 `.env.example`，不要照旧文档执行复制命令。GitHub Actions 使用其自身环境配置，不依赖本地 `.env`。

### 删除与增量更新

- `.sync-meta.json` 记录 Issue 的更新时间、当前文件名和历史 `aliases`，用于判断增量更新。
- 取消 `blog` 标签或关闭文章 Issue 后，下次有效同步会删除对应的受管文章及元数据。
- **若返回的符合条件的 Issue 列表完全为空，脚本会跳过本次同步，不执行全量删除。** 因此不能通过关闭全部 Issue 来假定本地内容已经清空。
- 迁移遗留的别名文件只有在 frontmatter 的 `issueNumber` 匹配时才被清理，避免误删手写文章。
- 手写的独立 MD/MDX 可以由 `posts` 集合加载，但不属于 Issue 发布流程；不要占用受管编号文件名或历史别名。

## 文章格式与内容集合

自动生成的 Markdown 结构示意：

```markdown
---
title: "文章标题"
description: "从正文自动提取的摘要"
pubDate: 2026-11-01T00:00:00Z
updatedDate: 2026-11-02T00:00:00Z
issueNumber: 200
issueUrl: https://github.com/raclen/zone/issues/200
tags: ["技术", "工具"]
author:
  name: "raclen"
draft: false
---

文章正文内容……
```

说明：

- 摘要由同步脚本清理部分 Markdown 标记后提取前 150 字符，超长时追加省略号。
- 作者和可选头像来自 Issue 作者信息。
- 普通 Issue 使用创建时间作为 `pubDate`、更新时间作为 `updatedDate`。
- 导入历史文章时，Issue 正文内的 `<!-- blog-meta ... -->` 可以保留原始 `pubDate` / `updatedDate`，该元数据注释不会进入最终正文。
- 同步脚本会移除旧版「在 GitHub Issue 讨论这篇文章」页尾，不再主动追加该段落。

集合定义在 [src/content.config.ts](src/content.config.ts)，博客集合名为 **`posts`**，通过 `glob` 加载 `src/content/blog/` 下的 MD/MDX。Schema 将日期转换为页面消费的 `pubDatetime` / `modDatetime`，缺少有效描述时使用标题，空标签列表回退为「随笔」。不要恢复旧版 `src/content/config.ts` 或重复的 `blog` 集合。

每日分享使用独立的 `daily` 集合，一个月份一个 `YYYY-MM.md` 文件，不走 Issue 同步；月份与日期解析见 [src/utils/parseDaily.ts](src/utils/parseDaily.ts)。

## 短链接与历史评论兼容

文章路径工具在 [src/utils/getPostPaths.ts](src/utils/getPostPaths.ts)。同步脚本将旧标题文件名保留到 `.sync-meta.json` 的 `aliases`，并在 `public/_redirects` 中生成旧路径到编号路径的 301 规则，兼容有无末尾斜杠的旧链接。

当前 CWD 组件使用自托管版本 **`0.2.0-raclen.3`**：

- 历史文章取 `aliases` 中第一个原路径作为 `postSlug`，继续关联评论与文章点赞。
- 无历史映射的新文章使用当前编号路径。
- PV 使用 `https://raclen.top` 与上述路径组成的固定 `postUrl`。
- 初始化与主题切换保留显式传入的 `postSlug`、`postUrl` 和 `postTitle`。

因此 **不能把 `.sync-meta.json` 当作可删除的缓存，也不能直接把历史文章的评论标识全部替换成编号**。后台和历史通知仍可能引用长链接，路径重定向也必须保留。

这套前端兼容不要求迁移 D1 数据，也不会自动合并已有重复记录。组件来源、哈希与回滚限制见 [CWD 组件说明](public/vendor/cwd-widget/0.2.0-raclen.3/README.md)。旧域名跳转与文章路径跳转是不同机制，域名到期规则见 [README.md](README.md#域名与重定向)。

## 本地开发与验证

要求 Node.js 22.12.0+，推荐 pnpm 9+：

```bash
pnpm install
pnpm dev
```

默认博客地址为 [localhost:4321/blog](http://localhost:4321/blog)；若端口被占用，以终端实际输出为准。验证生产构建和搜索时使用：

```bash
pnpm build
pnpm preview
```

搜索索引在构建时生成，新增文章后必须重新构建。具体排查见 [PAGEFIND_FIX.md](PAGEFIND_FIX.md)，URL 提交与收录验证见 [INDEXNOW.md](INDEXNOW.md)。

人工检查建议：文章列表与详情、标签和归档、编号与历史链接、搜索、代码复制、目录跳转、主题切换，以及历史评论 / 点赞 / 阅读量关联。前端改动不新增 UI 单元测试或测试脚手架，按 [PROJECT_RULES.md](PROJECT_RULES.md) 保持构建验证并列出人工验证范围。

## 相关入口

- [博客](https://raclen.top/blog/)
- [GitHub Issues](https://github.com/raclen/zone/issues)
- [当前实现说明](IMPLEMENTATION_SUMMARY.md)
- [友链信息](README.md#友链信息)
- [项目许可](LICENSE)：MIT

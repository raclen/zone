# PROJECT_RULES

长期有效的经验与约束。修改内容同步、评论、域名或排版 / 布局前先读这里。

---

## 1. 调整宽度前先区分 Fuwari 布局与基础布局

**触发信号**：想改文章正文宽度、页头页脚宽度，或发现页头和正文左右边界不对齐。

**约束**：当前有两类容器，不能沿用「所有页面只改两个 token」的旧假设。

- Fuwari 页面：`FuwariBlogLayout.astro`、文章详情页与 Header 使用 `max-w-[75rem]`，外层最大宽度为 1200px，左右留白为 `px-4 sm:px-6`。通用布局及文章详情的桌面网格为 `17.5rem` 侧栏加主内容列，间距 `gap-4`。
- 基础页面及 Footer：通过 `app-layout` / `chrome-layout` 等工具类消费 [src/styles/astropaper.css](src/styles/astropaper.css) 的共享 token。

基础布局 token 为：

- `--app-content-width` = 正文列宽（不含左右留白）：默认 `56rem`(896px)，`min-width:1280px` 时 `61rem`(976px)
- `--app-gutter` = 左右留白：默认 `1rem`，`min-width:640px` 时 `1.5rem`
- `max-w-app` = `--app-content-width`；`app-layout` / `chrome-layout` = `content + 2 * gutter`

**正确做法**：先检查目标页面实际使用的容器，再修改相应布局体系。基础容器仍只通过这两个变量调整，不在使用处写死宽度；Fuwari 体系改宽度时，要同步核对 [FuwariBlogLayout.astro](src/layouts/FuwariBlogLayout.astro)、[文章详情页](src/pages/blog/[slug].astro) 和 [Header.astro](src/components/Header.astro)，不能仅修改其中一处。Footer 当前仍走 `chrome-layout`，也要单独检查。

**验证方式**：比较同类外层容器的左右边界，并检查桌面侧栏、正文与窄屏溢出。文章 `#article` 是网格内正文，不等于含侧栏的 Header 容器宽度；不要再用二者必须等宽作为断言。首页和关于页已使用 Fuwari 布局，不再存在旧 `.works-main` / `.about-page` 宽度入口。

---

## 2. `@apply prose` 会丢掉 Typography 里写死 `.prose` 的选择器

**触发信号**：在 `.app-prose` 上明明有 Typography 规则却不生效，尤其是首个元素多出一段上边距。

**根因**：[src/styles/astropaper-typography.css](src/styles/astropaper-typography.css) 用 `.app-prose { @apply prose; }` 内联 Typography。
`@apply` 只会把规则搬进 `.app-prose`，**不会重写选择器里字面出现的 `.prose`**。
所以编译后是 `.app-prose :where(.prose > :first-child)` —— 永远不匹配。已知失效的有：

- `.prose > :first-child { margin-top: 0 }`
- `.prose > :last-child { margin-bottom: 0 }`
- `.prose > ul > li > p:first-child` 等

不含 `.prose` 字面量的（如 `:where(p)`、`:where(h3 + *)`）是正常的。

**正确做法**：这类重置要在 `.app-prose` 块里自己补一份（已补 `> :first-child` / `> :last-child`）。

---

## 3. 覆盖 Typography 的元素间距时，顺序决定结果

**触发信号**：给 `p` / `ul` 设了 `margin-block` 之后，标题下方突然多出一段空白。

**根因**：Typography 的 `:where(h2 + *) { margin-top: 0 }` 编译后特异性是 `(0,1,1)`，
自己写的 `.app-prose p` 也是 `(0,1,1)`。同分靠**源码顺序**决定。

**正确做法**：`:is(h1,h2,h3,h4,h5,h6,hr) + * { margin-top: 0 }` 必须写在所有元素间距规则**之后**
（见 `astropaper-typography.css` 末尾）。新增元素间距规则时，插在它前面。

---

## 4. 代码块排版与复制按钮以当前块内定位为准

**触发信号**：修改 `pre` 间距、内边距或滚动后，Copy 按钮遮挡代码或定位异常。

**当前实现**：[文章详情页](src/pages/blog/[slug].astro) 给 `pre` 套相对定位 wrapper，将 `.copy-code` 插入 `pre`，使用 `end-3 top-3` 定位。旧版 `-top-3` 悬在代码块上沿之外的实现已不适用。

**正确做法**：保持当前 `pre { margin-block: 1.125rem }`（18px）的正文节奏；如需调整，检查真实定位祖先、内边距、长行横向滚动与复制后的反馈，不再用旧版负偏移解释当前问题。复制目标保持为 `pre code` 的文字，避免把按钮文字复制进去。

---

## 5. Markdown 表格靠自身滚动，不要恢复 `display: table`

**触发信号**：手机端出现整页横向滚动，或表格被裁掉。

**根因**：markdown 生成的 `table` 没有外层滚动容器，Typography 的 `width: 100%` 挡不住
`min-content` 超宽——表格会撑破页面。

**正确做法**：`table { display: block; overflow-x: auto }`（表格自己当滚动容器）。
副作用是宽度按内容收缩、不再撑满正文列，与 GitHub 渲染一致。
若需要恢复满宽，必须同时加一层滚动容器（脚本或 rehype 插件），不能只删 `display: block`。

---

## 6. 中文正文不使用斜体

**触发信号**：想给 `h3`、`blockquote` 加 `italic` 强调。

**根因**：中文字体没有真斜体，浏览器合成伪斜体，笔画会变形、可读性下降。

**正确做法**：用字号 + 字重 + 颜色区分层级。`h3` 和 `blockquote` 已显式设为 `font-style: normal`。

---

## 7. 样式入口与已移除文件

当前全局样式入口为 [src/styles/astropaper.css](src/styles/astropaper.css)，由 `AstroPaperLayout.astro` 引入，并导入：

- `astropaper-theme.css`：颜色与字体 token
- `astropaper-typography.css`：`.app-prose` 正文排版及代码样式
- `fuwari.css`：卡片、标签等视觉样式

`minimalism.css`、`global.css`、旧 `blog/archive.astro` 及其专属布局已移除，不要在不存在的入口中修改或恢复旧主题。归档统一使用 `/archives`。AnhePlayer 宣传页在独立项目 `E:\code\cf-anheplayer`，本站仅保留作品链接。

---

## 8. 编号短链接不能改变历史评论的数据标识

**触发信号**：改文章 URL、文件名、同步元数据，或升级 / 回滚 CWD 组件。

**约束**：同步文章使用 `<issue-number>.md` 和编号路径；`src/content/blog/.sync-meta.json` 的 `aliases` 不是可删除的临时缓存。它既生成 `public/_redirects` 的旧路径 301，也为 CWD 提供历史 `postSlug`。历史文章使用首个别名路径，评论与文章点赞继续沿用原键；PV 使用固定主域名和该路径组成的 `postUrl`。

**正确做法**：保留已有 `siteId`、别名顺序、历史标识与永久路径重定向。CWD `.3` 组件在初始化和主题切换时保留显式 `postSlug` / `postUrl`；后续版本也必须维持该行为。升级使用新版本目录，不覆盖旧产物；回滚 `.2` 还需恢复其历史 URL 兼容代码，不能只改脚本地址。详见 [组件说明](public/vendor/cwd-widget/0.2.0-raclen.3/README.md)。

**验证方式**：分别检查历史与新文章，刷新、主题切换和文章间导航后确认评论、点赞和 PV 归属。不要用清空别名、改数据库或自动合并记录作为第一步排障。

---

## 9. 域名迁移需分开处理 canonical、路径跳转与动态数据

**约束**：站点 URL 在 `astro.config.mjs`、`astro-paper.config.ts` 及 IndexNow 脚本中保持一致；评论的 `siteId` 是数据归属标识，不应随主站域名自动修改。PV 按完整 URL 关联，改 `canonicalOrigin` 前应评估历史计数兼容，而不能假设所有互动都仅按路径统计。

`public/_redirects` 是同步脚本生成的文章路径跳转，不负责域名级跳转。`functions/_middleware.js` 是有到期时间的临时旧域名跳转，两者不可互相替代。清理中间件前先确认迁移和长期跳转安排，不因时间已到就自动删除兼容数据。

---

## 10. 现行指南与历史记录必须明确区分

文档中的当前结构、命令和行为以源码、配置与工作流为准。部署成功、浏览器交互、构建耗时、文章数和云服务配额必须有当次证据，不能把旧总结的验收或统计当成现状。

旧 Figma 设计分析、JSON 评论方案及 Giscus 配置保留为历史参考，并在入口显式标注失效范围；维护时优先更新 README、BLOG 和对应的现行专题指南。只记录可复用边界，不向规则文件写入一次性任务结果或任何敏感凭据。

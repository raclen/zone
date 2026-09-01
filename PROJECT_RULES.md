# PROJECT_RULES

长期有效的经验与约束。修改排版 / 布局前先读这里。

---

## 1. 阅读区宽度只能通过 `--app-content-width` / `--app-gutter` 调整

**触发信号**：想改文章正文宽度、页头页脚宽度，或发现页头和正文左右边界不对齐。

**约束**：宽度是一组共享 token，定义在 [src/styles/astropaper.css](src/styles/astropaper.css)：

- `--app-content-width` = 正文列宽（不含左右留白）：默认 `56rem`(896px)，`min-width:1280px` 时 `61rem`(976px)
- `--app-gutter` = 左右留白：默认 `1rem`，`min-width:640px` 时 `1.5rem`
- `max-w-app` = `--app-content-width`；`app-layout` / `chrome-layout` = `content + 2 * gutter`

**正确做法**：只改这两个变量的值。以下四处都消费同一组变量，任何一处写死像素值都会造成竖向不对齐：

- `app-layout`（文章、博客列表、归档、标签、404、面包屑）
- `chrome-layout`（Header / Footer）
- `.works-main`（[src/pages/index.astro](src/pages/index.astro)）
- `.about-page`（[src/pages/about.astro](src/pages/about.astro)，自带 padding，用 `content + 2*gutter`）

**验证方式**：任意页面执行
`header.firstElementChild.getBoundingClientRect().width` 应等于文章 `#article` 的宽度。

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

## 4. 代码块上边距不能小于 ~16px

**触发信号**：收紧 `pre` 的 `margin-block` 后，Copy 按钮压到上一段文字。

**根因**：[src/pages/blog/\[slug\].astro](src/pages/blog/[slug].astro) 的内联脚本给每个 `pre` 套一层
`div` 并塞入绝对定位按钮 `.copy-code`（`-top-3`），按钮有约 12px 悬在 `pre` 之外。

**正确做法**：`pre { margin-block }` 保持 ≥ `1.125rem`(18px)。想更紧就得先把按钮改成块内定位。

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

## 7. 死代码：`src/styles/minimalism.css`

没有任何文件引用它。改主题样式时不要在这里找，也不要往里加东西。
博客走 [src/styles/astropaper.css](src/styles/astropaper.css)，AnhePlayer 宣传页走
[src/styles/global.css](src/styles/global.css)。

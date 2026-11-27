# Pagefind 搜索维护与排查

保留此文件名便于已有链接引用；内容描述当前搜索实现，不再沿用旧版 `SearchBar.astro` 或“已全面改为 script 标签加载”的修复结论。

## 当前实现

搜索由 Pagefind 静态索引提供，不需要独立搜索后端。搜索运行在浏览器内，会按需请求本站索引文件，不向第三方搜索服务提交查询。

### 构建期

[astro.config.mjs](astro.config.mjs) 集成 `astro-pagefind`：

```javascript
pagefind({
  indexConfig: {
    forceLanguage: "zh",
    includeCharacters: "-_+#.?:",
  },
})
```

Astro 生成 HTML 后，Pagefind 生成 `dist/pagefind/` 索引与客户端模块。文章主区域使用 `data-pagefind-body`，标题使用 `data-pagefind-meta="title"` 和权重标记；并不是无差别索引页面全部导航文字。

站点搜索开关位于 [astro-paper.config.ts](astro-paper.config.ts) 的 `features.search`，当前为 `"pagefind"`。独立搜索页会检查该开关；全局弹窗在 Header 中直接接入，不能仅凭关闭配置就假定所有入口已隐藏。

### 两个客户端入口

| 入口 | 文件 | 加载方式 |
| --- | --- | --- |
| 顶部弹窗，`Ctrl+K` / `Cmd+K` | [FuwariSearchModal.astro](src/components/fuwari/FuwariSearchModal.astro) | 动态 `import()` `/pagefind/pagefind.js`，自定义结果列表 |
| 独立 `/search` 页面 | [search.astro](src/pages/search.astro) | 动态导入 `@pagefind/default-ui`，通过 `bundlePath` 加载生成的索引 |

顶部弹窗支持 Esc、遮罩及关闭按钮。独立搜索页支持 `q` 查询参数。两者的初始化与页面过渡处理分开维护，改动其中一个不能替代验证另一个。

## 本地验证

```bash
pnpm build
pnpm preview
```

默认预览地址为 [localhost:4321](http://localhost:4321)，若端口被占用，以终端实际输出为准。

`pnpm dev` 不会持续生成完整 Pagefind 索引。独立搜索页有开发模式提示，弹窗在索引无法加载时显示加载提示；**不是开发环境没有搜索框**。新增或修改文章后，需要重新构建才能验证最新搜索结果。

### 人工 Todo

- [ ] 在 `/blog/` 点击顶部搜索按钮，搜索中文正文和标题关键词。
- [ ] 使用 `Ctrl+K` / `Cmd+K` 打开，检查 Esc、关闭按钮与遮罩关闭。
- [ ] 检查搜索结果链接指向编号文章路径，点击后可以正常阅读。
- [ ] 打开 `/search/`，验证搜索及 `?q=` 参数。
- [ ] 在首页、博客、文章详情间导航后再次搜索，检查页面过渡后的初始化。
- [ ] 在明暗主题、手机与桌面宽度下检查结果排版和滚动。

前端改动只要求构建验证并列出人工验证范围，不新增 UI 单元测试或脚手架。

## 线上排查

主站配置为 [raclen.top](https://raclen.top)。构建通过只是本地证据，线上搜索还需要成功部署完整产物。

### 索引无法加载

1. 查看 Pages 构建日志，确认 Pagefind 索引生成步骤完成。
2. 确认发布目录为 `dist`，其中 `pagefind/` 未被排除。
3. 检查 `/pagefind/pagefind.js` 和其请求的索引 / WASM / 数据片段状态，不能仅查看旧版 `pagefind-ui.js` 路径。
4. 查看浏览器 Network 与 Console，区分 404、缓存版本不一致、模块加载及运行时错误。
5. 若调整了 `base` 或子路径部署，分别核对独立页的 `bundlePath` 和弹窗目前写死的根路径。

### 新文章搜不到

依次确认：Issue 符合同步条件 → 编号 Markdown 已提交 → Pages 构建已发布 → 新索引已部署 → 浏览器未混用旧缓存。不要只清缓存而忽略上游同步和部署阶段。

### 页面切换后异常

分别检查弹窗的 `astro:page-load` 与独立搜索页的 `astro:after-swap` 初始化，以及重复事件监听或实例复用。主题与评论系统问题应独立排查，不要通过修改文章历史标识来处理搜索问题。

## 相关文档

- [博客写作与同步](BLOG.md)
- [长期项目规则](PROJECT_RULES.md)
- [Pagefind 文档](https://pagefind.app/docs/)
- [Pagefind 源码](https://github.com/CloudCannon/pagefind)

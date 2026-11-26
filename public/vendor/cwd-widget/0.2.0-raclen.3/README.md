# 自托管 CWD 评论组件：0.2.0-raclen.3

本版本从 `E:/code/cwd/docs/widget` 构建，对应源码提交 [raclen/cwd@b5d5ea1](https://github.com/raclen/cwd/commit/b5d5ea102a6ed24a7659722e6988952cfdec9f7e)，包含 URL 迁移兼容补丁。未升级上游依赖版本，保留原来的邮箱选填、折叠表单和紧凑点赞条。

## 本次改动

- 初始化和 `updateConfig()` 保留显式传入的 `postSlug`、`postUrl`、`postTitle`，不再因主题切换覆盖历史文章标识。
- 文章点赞查询使用 `postSlug`，与原有点赞写入键一致；PV 继续使用固定主域名与历史路径组成的 `postUrl`。
- 未配置的字段自动推导；传入空字符串可以恢复自动推导。

博客在 `CwdComments.astro` 中读取 `.sync-meta.json` 的历史 `aliases`，直接把历史路径和完整 URL 传给构造函数，不再修改 `widget.config`。这些历史映射需要保留，不能把现有文章的标识直接替换成编号。

不需要部署评论 API 或迁移 D1 数据。本次没有修改点赞的站点归属规则，也不自动合并既有重复记录。后台和邮件仍可能引用原长链接，因此要保留旧链接到新短链接的永久重定向。

## 构建与校验

- 来源：`raclen/cwd` → `docs/widget` → `npm run build` → `dist/cwd.js`。
- 文件大小：407013 bytes。
- SHA-256：`a0973b7f65b449eca6d4d14c853b3a25fe7797456f9fb67bf635051ac597cbeb`。
- UMD 构建为独立脚本，本次只同步 `dist/cwd.js`，无需复制 ES Module 构建的额外 chunk。

```bash
npm --prefix E:/code/cwd/docs/widget run build
```

```bash
sha256sum public/vendor/cwd-widget/0.2.0-raclen.3/cwd.js
```

正式配置位于 `astro-paper.config.ts`，默认值位于 `src/config.ts`，组件的构建期和浏览器备用地址位于 `src/pages/blog/_components/CwdComments.astro`。以上引用均需指向同一个版本目录。

## 缓存与回滚

保留 `0.2.0-raclen.2`，新版使用独立目录，避免覆盖旧文件造成缓存混用。后续重建如内容发生变化，应创建新的版本目录。

回滚到 `.2` 时必须同时恢复旧版 `CwdComments.astro` 中挂载前和主题更新后覆写 `widget.config.postUrl` 的兼容代码；只切换脚本地址会让旧组件覆盖显式传入的历史 URL。

## 人工验证清单

- 打开 `/blog/200/`、`/blog/201/`，确认历史评论、点赞状态和阅读量。
- 刷新页面后检查点赞状态；切换明暗主题后检查文章关联保持不变。
- 通过文章间导航检查评论归属，桌面和手机确认折叠表单及紧凑点赞条仍正常。

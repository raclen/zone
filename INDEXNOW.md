# IndexNow URL 提交与验证

## 用途与证据边界

IndexNow 是内容变更通知协议：站点主动提交 URL，让支持该协议的搜索引擎更容易发现更新。本站向 `https://api.indexnow.org/indexnow` 提交。

**提交成功不等于抓取完成，也不等于已收录或被 AI 服务引用。** 不保证抓取时间，不把某个 AI 产品的检索来源当作固定前提。

## 当前实现

- 脚本：[scripts/indexnow.mjs](scripts/indexnow.mjs)。
- 主域名：`raclen.top`，与 Astro 的 `site` 及站点 `site.url` 保持一致。
- 验证文件：`public/<KEY>.txt`，内容为同一 KEY；构建后需能通过主站根路径访问。
- 提交字段：`host`、`key`、`keyLocation`、`urlList`。
- 批次上限：10000 条 URL。
- 自动化：[.github/workflows/sync-blog.yml](.github/workflows/sync-blog.yml) 在文章同步及固定等待 180 秒后调用脚本。

IndexNow 验证 KEY 按协议公开，不是账户密码或 API Bearer Token；这不代表可以公开 GitHub Token、通知凭据或 CWD 后台凭据。

## URL 从哪里来

脚本按以下顺序读取 URL：

1. **优先读取本地 `dist/sitemap-0.xml`**。
2. 文件不可读取或没有 URL 时，回退到 `src/content/blog/*.md` 的文件名，并补入脚本定义的固定页面。

注意：

- 脚本不会下载线上 sitemap，也不会判断本地 `dist` 是否过期。只要存在有效的旧 sitemap，就可能提交旧 URL。
- 回退模式只拼接 `.md` 文件，不读取 MDX、草稿状态或发布日期过滤；与实际公开页面清单可能不同。
- 回退模式的固定页面是脚本中的清单，不会自动发现所有新路由。
- 同步工作流不运行本站构建。干净的 Actions 检出通常没有 `dist`，会使用回退模式。

因此手动提交前应先构建并预览 URL 来源，不能将“读到 sitemap”直接视为与线上部署完全一致。

## 手动操作

### 只读预览

```bash
pnpm build
pnpm indexnow --dry-run
```

`--dry-run` 只显示 URL 来源、数量和前 10 条示例，**不会提交请求**。也可直接运行：

```bash
node scripts/indexnow.mjs --dry-run
```

### 正式提交

确认 Pages 已部署、目标 URL 可访问、验证文件可访问后，再执行：

```bash
pnpm indexnow
```

脚本会向外部服务提交 URL；不要把这条命令当作只读验证。批次日志中的 HTTP 状态及成功 / 失败数量仅表示接口接受情况。

## 更换域名或验证 KEY

### 域名

同步检查 `scripts/indexnow.mjs` 的 `SITE_HOST`、派生的 `SITE_URL` / `KEY_LOCATION`，以及 `astro.config.mjs`、`astro-paper.config.ts` 的站点 URL。重新构建，避免旧域名 sitemap 优先被提交；确认新域名能直接提供验证文件和文章页面。

旧域名跳转与新域名验证是不同机制。本站临时跳转的到期与迁移约束见 [README.md](README.md#域名与重定向)。

### 验证 KEY

只有需要轮换时才执行：

1. 生成新的随机 KEY，例如使用 `node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"`。
2. 创建 `public/<新KEY>.txt`，内容与 KEY 完全一致。
3. 更新脚本中的 `INDEXNOW_KEY`，检查派生的验证文件 URL。
4. 构建并部署，确认新验证文件可访问后，再按迁移安排清理旧文件。

不要先删除仍在使用的验证文件，也不要在轮换时顺带更改评论系统凭据或站点标识。

## 验证清单

- [ ] 预览日志的来源与目标 URL 属于当前主域名。
- [ ] Pages 已部署对应内容，抽查的新文章不是 404。
- [ ] `https://raclen.top/<KEY>.txt` 返回正确验证内容。
- [ ] 正式提交日志没有失败批次。
- [ ] 在搜索引擎站长工具中检查提交记录、抓取状态与实际收录。

工作流的 `sleep 180` 只是固定等待，不会保证上述条件成立。检查自动化时应同时看同步提交、Pages 部署和 IndexNow 日志，而不是仅看某一步显示成功。

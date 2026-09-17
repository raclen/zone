# 自托管 CWD 评论组件

> **已被 [`0.2.0-raclen.1/`](../0.2.0-raclen.1/README.md) 取代**（新增邮箱选填 + 表单默认收起）。
> 本目录保留仅用于回滚：把 `comments.widgetSrc` 改回 `/vendor/cwd-widget/0.2.0/cwd.js` 即可切回上游行为。

这里存放 **本地化（vendored）** 的 [`cwd-widget`](https://www.npmjs.com/package/cwd-widget) 构建产物，
由本站自己分发，不依赖 unpkg / jsDelivr 等第三方 CDN（可用性更好，也没有供应链被替换的风险）。

| 项目 | 值 |
| --- | --- |
| 版本 | `0.2.0` |
| 来源 | `https://unpkg.com/cwd-widget@0.2.0/dist/cwd.js`（等价于 npm 包内 `dist/cwd.umd.js`） |
| 体积 | 402,100 bytes（gzip 约 93 KiB） |
| 引入方式 | `src/pages/blog/_components/CwdComments.astro` 动态 `<script>` 注入 `/vendor/cwd-widget/0.2.0/cwd.js` |

## 校验

```bash
sha256sum public/vendor/cwd-widget/0.2.0/cwd.js
# cc765db396dbbf2bc67a44f8d91ea1cd46d02773aa52622c8931152154aa8dfe
```

## 升级步骤

1. 确认 CWD API 的版本：访问 `https://cwd-api.raclen.qzz.io/`（返回 `version` 字段）。
   **Widget 与 API 的大版本应保持一致**，避免接口不匹配。
2. 下载新版本到新目录（不要覆盖旧目录，便于回滚）：

   ```bash
   NEW=0.2.1
   mkdir -p "public/vendor/cwd-widget/$NEW"
   curl -L "https://unpkg.com/cwd-widget@$NEW/dist/cwd.js" \
     -o "public/vendor/cwd-widget/$NEW/cwd.js"
   sha256sum "public/vendor/cwd-widget/$NEW/cwd.js"   # 记录到本文件
   ```

3. 把 `astro-paper.config.ts` 里 `comments.widgetSrc` 指向新路径。
4. 更新本文件的版本 / 校验值表格。
5. `npm run build` 后提交推送，Cloudflare Pages 会自动部署。

> 旧版本目录建议在确认线上稳定后的一两个版本再删除，保留回滚能力。

## 上游源码中的两个已知行为（本站已适配）

CWD 组件用两个不同的键来区分内容，理解这点对多域名的本站很重要：

| 数据 | 使用的键 | 说明 |
| --- | --- | --- |
| 评论列表 / 发表评论 | `postSlug` = `window.location.pathname` | **与域名无关**，多域名天然共享同一份评论 |
| 文章点赞 / 页面浏览量 PV | `postUrl` = `window.location.origin + pathname` | **与域名相关**，本站访问量会按域名分裂 |

`CwdComments.astro` 在 `mount()` 之前把 `widget.config.postUrl` 覆写为
`canonicalOrigin + pathname`（canonicalOrigin 来自 `site.url`），从而让点赞与 PV 也归一到主域名。
覆写必须发生在 `mount()` 之前——组件内部的 API 客户端是在 `mount()` 里用 `this.config` 创建的。

> 注意：`widget.updateConfig({ theme })` 会把 `postUrl` 重置回 `window.location.origin + pathname`，
> 所以切换主题后需要重新覆写一次（组件里已处理）。

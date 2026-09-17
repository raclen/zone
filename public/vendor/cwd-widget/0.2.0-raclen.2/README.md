# 自托管 CWD 评论组件（本站自编译版 0.2.0-raclen.2）

上游 npm 上的 `cwd-widget@0.2.0` **不含**下面三项改动，因此本站把源码 fork 到
[`raclen/cwd`](https://github.com/raclen/cwd)，在 `docs/widget` 里改完再重新构建，
产物自托管（不依赖 unpkg / jsDelivr，可用性与供应链都更可控）。

| 项目 | 值 |
| --- | --- |
| 版本 | `0.2.0-raclen.2`（上游 0.2.0 + 3 处本地补丁） |
| 来源 | fork `raclen/cwd` → `docs/widget` → `pnpm build` → `dist/cwd.js` |
| 构建基线 | fork `raclen/cwd` 的 `main` @ `d06e3d4`（邮箱选填 `70b39aa` + 折叠表单 `8ebbafa` + 紧凑点赞条 `d06e3d4`） |
| 体积 | 406,999 bytes（gzip 约 97 KiB） |
| 引入方式 | `astro-paper.config.ts` 的 `comments.widgetSrc`（组件脚本由 `CwdComments.astro` 注入） |
| 取代 | 取代 `0.2.0-raclen.1`（多了第 3 项 `compactLikeBar`），`0.2.0-raclen.1/` 保留可回滚 |

## 校验

```bash
sha256sum public/vendor/cwd-widget/0.2.0-raclen.2/cwd.js
# b0df82159a31e5f38b00c604673731045e4ae94ac6eb87ba23ea9b7caa6c612f
```

## 与上游 0.2.0 的差异

1. **邮箱改为选填**
   - 组件：`src/utils/validator.js`（`validateCommentForm` / `validateReplyUserInfo`）、
     `src/components/CommentForm.js`（提交按钮可用性）、`src/components/ReplyEditor.js`
     （回复时不再因为没有邮箱就重新索要用户信息）、`src/locales/index.js`（标签去掉 `*`）。
   - 后端：`cwd-api/src/api/public/postComment.ts` 同步放宽——不填邮箱存空串，
     头像自动退化为按昵称生成（`getAvatar`），回复通知自然跳过空邮箱。
2. **新增 `collapseForm` 配置（默认收起评论表单）**
   - 开启后在点赞区与表单之间渲染一行「写评论」入口，表单初始隐藏；
     点击入口展开并自动聚焦输入框，表单左下角有「收起」，提交成功后自动收起，
     开始回复某条评论时也会自动收起主表单。
   - 关闭时行为与上游完全一致（入口不渲染）。
   - 相关代码：`src/core/CWDComments.js`（`collapseForm` / `_applyFormVisibility` / `_setFormExpanded`）、
     `src/components/CommentForm.js`（`onCollapse`）、`src/styles/main.css`、
     `src/locales/index.js`（`writeCommentBtn`、`collapse`）。
3. **新增 `compactLikeBar` 配置（点赞条紧凑单行）**
   - 上游的文章点赞条是「32px 大爱心竖排 + 上下各 30px 留白 + 外层 16px 内边距」≈ **154px** 高，
     实际内容只有 62px，评论区顶部因此空一大片（表单默认收起后尤其显眼）。
   - 开启后改为一行小胶囊（`♥ 0人喜欢`，爱心 20px、行高约 28px），顶部空白从 ~154px 降到 ~28px。
   - 实现：`_render()` 里按配置给容器加 `cwd-compact-like` 类，
     `src/styles/main.css` 末尾用 `.cwd-compact-like .cwd-like…` 覆盖（选择器权重高于原规则，不依赖顺序）；
     `updateConfig({ compactLikeBar })` 可在运行时切换。
   - 关闭时行为与上游完全一致。

## 重建步骤

```bash
cd E:/code/cwd/docs/widget
pnpm install --ignore-scripts     # 首次
pnpm build                        # 产物 dist/cwd.js（会自动复制 cwd.umd.js → cwd.js）
cp dist/cwd.js E:/code/zone/public/vendor/cwd-widget/<版本>/cwd.js
sha256sum E:/code/zone/public/vendor/cwd-widget/<版本>/cwd.js   # 更新本文件
```

改完记得同时更新 `astro-paper.config.ts` 的 `comments.widgetSrc`。

> ⚠️ **改内容一定要换版本目录**：同一路径的产物会被浏览器 / Cloudflare 边缘缓存，
> 覆盖同名文件会让「HTML 里引用的产物」和「缓存里的产物」不一致。`0.2.0/`、
> `0.2.0-raclen.1/`、`0.2.0-raclen.2/` 就是这个用途。

## 回滚

按需选择：

| 想回到 | 操作 |
| --- | --- |
| 保留折叠 + 邮箱选填，只恢复大点赞条 | 删掉 `comments.compactLikeBar`（或设 `false`） |
| 回到刚才那版 | `comments.widgetSrc` 改回 `/vendor/cwd-widget/0.2.0-raclen.1/cwd.js`，并删掉 `compactLikeBar` |
| 完全上游行为 | `comments.widgetSrc` 改回 `/vendor/cwd-widget/0.2.0/cwd.js`，删掉 `collapseForm` 与 `compactLikeBar` |

## 升级上游版本时

上游发布新版本时，这三处补丁需要在新版本上重做（源码在自有 fork 里，可持续维护）：

| 补丁 | 涉及文件 |
| --- | --- |
| 邮箱选填 | `cwd-api/src/api/public/postComment.ts`、widget 的 `validator.js` / `CommentForm.js` / `ReplyEditor.js` / `locales/index.js` |
| 折叠表单 | widget 的 `core/CWDComments.js` / `components/CommentForm.js` / `styles/main.css` / `locales/index.js` |
| 紧凑点赞条 | widget 的 `core/CWDComments.js` / `styles/main.css` / `index.d.ts` |

> Widget 与 API 的大版本应保持一致；API 版本可访问 `https://cwd-api.raclen.qzz.io/` 查看。

# 自托管 CWD 评论组件（本站自编译版 0.2.0-raclen.1）

上游 npm 上的 `cwd-widget@0.2.0` **不含**下面两项改动，因此本站把源码 fork 到
[`raclen/cwd`](https://github.com/raclen/cwd)，在 `docs/widget` 里改完再重新构建，
产物与 `0.2.0/` 一样自托管（不依赖 unpkg / jsDelivr，可用性与供应链都更可控）。

| 项目 | 值 |
| --- | --- |
| 版本 | `0.2.0-raclen.1`（上游 0.2.0 + 2 处本地补丁） |
| 来源 | fork `raclen/cwd` → `docs/widget` → `pnpm build` → `dist/cwd.js` |
| 构建基线 | fork `raclen/cwd` 的 `main` @ `8ebbafa`（含邮箱选填 + 折叠表单两处补丁；对应 API 提交 `70b39aa`） |
| 体积 | 406,558 bytes（gzip 约 97 KiB） |
| 引入方式 | `astro-paper.config.ts` 的 `comments.widgetSrc`（组件脚本由 `CwdComments.astro` 注入） |

## 校验

```bash
sha256sum public/vendor/cwd-widget/0.2.0-raclen.1/cwd.js
# 059a390f67cf47d989f80a0b9dc386147304dbdde9e91eee2eb53405722f73dd
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

## 重建步骤

```bash
cd E:/code/cwd/docs/widget
pnpm install --ignore-scripts     # 首次
pnpm build                        # 产物 dist/cwd.js（会自动复制 cwd.umd.js → cwd.js）
cp dist/cwd.js E:/code/zone/public/vendor/cwd-widget/<版本>/cwd.js
sha256sum E:/code/zone/public/vendor/cwd-widget/<版本>/cwd.js   # 更新本文件
```

改完记得同时更新 `astro-paper.config.ts` 的 `comments.widgetSrc`。

## 回滚

把 `astro-paper.config.ts` 的 `comments.widgetSrc` 改回 `/vendor/cwd-widget/0.2.0/cwd.js`，
并把 `comments.collapseForm` 设为 `false`（或删掉），即回到完全的上游行为。
`0.2.0/` 目录保留，随时可切。

## 升级上游版本时

上游发布新版本时，这两处补丁需要在新版本上重做（源码在自有 fork 里，可持续维护）：

| 补丁 | 涉及文件 |
| --- | --- |
| 邮箱选填 | `cwd-api/src/api/public/postComment.ts`、widget 的 `validator.js` / `CommentForm.js` / `ReplyEditor.js` / `locales/index.js` |
| 折叠表单 | widget 的 `core/CWDComments.js` / `components/CommentForm.js` / `styles/main.css` / `locales/index.js` |

> Widget 与 API 的大版本应保持一致；API 版本可访问 `https://cwd-api.raclen.qzz.io/` 查看。

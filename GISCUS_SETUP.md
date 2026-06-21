# Giscus 评论系统配置指南

Giscus 是基于 GitHub Discussions 的评论系统，简单、优雅、免费。

## 🚀 快速配置（4 步）

### 第 1 步：启用 GitHub Discussions

1. 访问你的仓库：`https://github.com/raclen/zone`
2. 点击 **Settings** 标签
3. 找到 **Features** 区域
4. 勾选 **Discussions**

### 第 2 步：安装 Giscus App

1. 访问 https://github.com/apps/giscus
2. 点击 **Install**
3. 选择你的仓库 `raclen/zone`
4. 点击 **Install & Authorize**

### 第 3 步：获取配置参数

1. 访问 https://giscus.app/zh-CN
2. 填写你的仓库信息：
   - 仓库：`raclen/zone`
   - 页面 ↔️ discussions 映射关系：选择 **URL**
   - Discussion 分类：选择 **General**（或创建新的）
   
3. 滚动到页面底部，复制生成的配置

4. 找到这两个关键参数：
   ```
   data-repo-id="xxxxx"
   data-category-id="xxxxx"
   ```

### 第 4 步：更新代码

编辑 `astro-paper.config.ts`，把 `comments.enabled` 改为 `true`，并填入 Giscus 生成的参数：

```ts
comments: {
  enabled: true,
  provider: "giscus",
  repo: "raclen/zone",
  repoId: "R_kgDOTAMRcg",
  category: "General",
  categoryId: "你的 category-id",
},
```

## ✅ 完成！

现在运行：
```bash
npm run dev
```

访问任意文章页面，你应该能看到 Giscus 评论框。使用 GitHub 账号登录即可评论。

## 🎨 自定义主题

如果你想支持暗色模式，可以动态切换主题：

```javascript
data-theme="light"  // 或 "dark"、"preferred_color_scheme"
```

## 📚 更多选项

编辑 `astro-paper.config.ts` 里的 `comments` 可以调整：
- `reactionsEnabled: true` - 是否启用表情反应
- `inputPosition: "top"` - 评论框位置（top/bottom）
- `lang: "zh-CN"` - 语言
- `theme: "light"` - 主题

## 🆚 对比旧系统

| 功能 | 旧系统（JSON） | Giscus |
|------|---------------|--------|
| 实时性 | ❌ 需要定时同步 | ✅ 实时显示 |
| 复杂度 | ❌ 复杂（脚本+Actions+JSON） | ✅ 简单（一个组件） |
| 维护成本 | ❌ 高 | ✅ 低 |
| 功能 | ❌ 基础 | ✅ 丰富（表情、回复、编辑） |
| 通知 | ❌ 无 | ✅ GitHub 通知 |

## 🎉 优势

- ✅ **零配置** - 一个 script 标签搞定
- ✅ **实时评论** - 无需同步，即时显示
- ✅ **功能丰富** - 支持表情、回复、编辑、Markdown
- ✅ **GitHub 原生** - 所有评论存在 Discussions
- ✅ **免费永久** - 基于 GitHub，完全免费
- ✅ **无需后端** - 纯前端方案
- ✅ **支持通知** - GitHub 邮件/网页通知

## 🔗 相关链接

- Giscus 官网：https://giscus.app/zh-CN
- GitHub Discussions：https://github.com/raclen/zone/discussions
- Giscus 文档：https://github.com/giscus/giscus/blob/main/ADVANCED-USAGE.md

<script src="https://giscus.app/client.js"
        data-repo="raclen/zone"
        data-repo-id="R_kgDOTAMRcg"
        data-category="General"
        data-category-id="DIC_kwDOTAMRcs4C_n62"
        data-mapping="url"
        data-strict="0"
        data-reactions-enabled="1"
        data-emit-metadata="0"
        data-input-position="bottom"
        data-theme="preferred_color_scheme"
        data-lang="zh-CN"
        crossorigin="anonymous"
        async>
</script>
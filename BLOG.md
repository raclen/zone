# GitHub Issues 自动博客系统

本项目实现了一个自动化的博客系统，使用 GitHub Issues 作为内容源，通过 GitHub Actions 定时同步到本仓库，并部署到 Cloudflare Pages。

## ✨ 功能特性

- 📝 **GitHub Issues 写作**：在 GitHub Issues 中写作，享受 Markdown、评论、标签等便利功能
- 🔄 **自动同步**：每天自动从 Issues 同步文章到仓库
- 🎨 **Figma 设计风格**：继承项目的 Figma 设计系统
- 🔍 **全文搜索**：集成 Pagefind，支持中文搜索
- 🏷️ **标签筛选**：按标签快速筛选文章
- 📱 **响应式设计**：完美支持移动端和桌面端
- ⚡ **静态站点**：纯静态生成，快速加载

## 📁 项目结构

```
.
├── src/
│   ├── content/
│   │   ├── config.ts          # Content Collections 配置
│   │   └── blog/              # 博客文章（自动同步）
│   ├── pages/
│   │   └── blog/
│   │       ├── index.astro    # 博客列表页
│   │       ├── [slug].astro   # 文章详情页
│   │       └── _components/   # 博客页面组件
│   │           ├── BlogCard.astro
│   │           └── SearchBar.astro
├── scripts/
│   └── sync-blog.js           # Issues 同步脚本
└── .github/workflows/
    └── sync-blog.yml          # 自动同步工作流
```

## 🚀 使用方法

### 1. 在 GitHub Issues 中写作

访问 [raclen/raclen.github.io Issues](https://github.com/raclen/raclen.github.io/issues) 创建新的 Issue 作为博客文章。

**建议**：
- 使用清晰的标题
- 添加标签分类（如 `技术`、`前端`、`生活` 等）
- 使用 Markdown 格式编写正文
- 图片直接上传到 Issue（自动托管）

### 2. 自动同步

**定时同步**：每天北京时间 08:00 自动运行

**手动同步**：
1. 进入 [GitHub Actions](https://github.com/raclen/zone/actions/workflows/sync-blog.yml)
2. 点击 "Run workflow" 按钮
3. 选择分支并运行

**本地同步**：
```bash
pnpm sync-blog
```

### 3. 查看博客

- **本地预览**：`pnpm dev` 然后访问 http://localhost:4323/blog
- **线上访问**：https://raclen.cyou/blog

## 🛠️ 本地开发

### 安装依赖

```bash
pnpm install
```

### 同步文章

```bash
pnpm sync-blog
```

### 启动开发服务器

```bash
pnpm dev
```

### 构建生产版本

```bash
pnpm build
```

### 预览生产构建

```bash
pnpm preview
```

## 📝 文章格式

同步脚本会自动将 Issues 转换为 Markdown 文件，格式如下：

```markdown
---
title: "文章标题"
description: "文章摘要（自动提取前 150 字）"
pubDate: 2024-06-21T00:00:00Z
updatedDate: 2024-06-21T00:00:00Z
issueNumber: 68
issueUrl: https://github.com/raclen/raclen.github.io/issues/68
tags: [技术, 前端]
author:
  name: "raclen"
  avatar: "https://avatars.githubusercontent.com/u/xxx"
draft: false
---

文章正文内容...

---

💬 **[在 GitHub Issue 讨论这篇文章](https://github.com/raclen/raclen.github.io/issues/68)**
```

## 🔧 配置说明

### GitHub Actions

工作流配置在 `.github/workflows/sync-blog.yml`：

- **触发时机**：
  - 每天 UTC 00:00（北京时间 08:00）
  - 手动触发（workflow_dispatch）
- **权限**：需要 `contents: write` 权限来提交代码

### Content Collections

配置在 `src/content/config.ts`，定义了博客文章的 schema：

```typescript
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    issueNumber: z.number(),
    issueUrl: z.string().url(),
    tags: z.array(z.string()).default([]),
    author: z.object({
      name: z.string(),
      avatar: z.string().url().optional(),
    }).default({ name: 'Anhe' }),
    draft: z.boolean().default(false),
  }),
});
```

### Pagefind 搜索

配置在 `astro.config.mjs`：

```javascript
integrations: [sitemap(), pagefind()]
```

- 自动索引所有页面
- 支持中文分词
- 构建时生成索引文件

## 📊 统计

当前同步了 **66 篇文章**，从 2019 年至今的技术笔记和学习记录。

## 🔗 相关链接

- **内容源**：[raclen/raclen.github.io Issues](https://github.com/raclen/raclen.github.io/issues)
- **博客地址**：https://raclen.cyou/blog
- **项目主页**：https://raclen.cyou

## 🤝 贡献

欢迎在 [GitHub Issues](https://github.com/raclen/raclen.github.io/issues) 中提出建议或报告问题！

## 📄 许可

MIT License

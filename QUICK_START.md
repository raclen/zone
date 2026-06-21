# 快速开始指南

## 🚀 部署博客评论系统

### 第一步：设置 GitHub Token（用于同步）

1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token" → "Generate new token (classic)"
3. 设置 Note: "Blog Sync"
4. 选择权限: `public_repo`
5. 点击 "Generate token" 并复制

### 第二步：推送到 GitHub

```bash
# 添加所有更改
git add .

# 提交
git commit -m "feat: 添加博客评论系统和自动同步"

# 推送到 GitHub
git push origin main
```

### 第三步：GitHub Actions 自动运行

推送后，GitHub Actions 会自动：
- 每小时同步一次博客和评论
- 可以在 `Actions` 页面手动触发

### 第四步：本地测试（可选）

如果想在本地测试同步：

```bash
# 1. 创建 .env 文件
cp .env.example .env

# 2. 编辑 .env，填入你的 GitHub Token
# GITHUB_TOKEN=ghp_xxxx...

# 3. 运行同步
npm run sync-blog

# 4. 查看结果
ls -la src/data/comments/
```

## 📝 如何发表评论

### 用户评论流程

1. 访问文章页面
2. 点击底部 "在 GitHub 上评论" 按钮
3. 在 GitHub Issue 中发表评论
4. 等待自动同步（最长 1 小时）
5. 评论会自动出现在文章页面

### 作为博主

你可以：
- 在 GitHub Issues 中回复评论
- 使用 GitHub 的所有功能（表情、@提及、标签等）
- 关闭或删除不当评论

## 🏗️ 项目结构

```
zone/
├── src/
│   ├── pages/blog/
│   │   ├── index.astro           # 博客首页
│   │   ├── [slug].astro          # 文章页面（包含评论）
│   │   ├── archive.astro         # 归档页面
│   │   ├── friends.astro         # 友链页面
│   │   └── _components/
│   │       ├── CommentsLocal.astro  # 评论组件
│   │       ├── SearchBar.astro      # 搜索组件
│   │       └── BlogCard.astro       # 文章卡片
│   ├── content/blog/             # Markdown 文章
│   └── data/comments/            # 评论数据（JSON）
├── scripts/
│   └── sync-blog.js              # 同步脚本
├── .github/workflows/
│   └── sync-blog.yml             # 自动同步工作流
├── .env.example                  # 环境变量示例
├── BLOG_IMPROVEMENTS.md          # 改进总结
├── COMMENTS_SYSTEM.md            # 评论系统说明
└── QUICK_START.md                # 本文件
```

## ✅ 功能检查清单

完成以下检查确保一切正常：

- [ ] 博客首页正常显示
- [ ] 文章页面正常显示
- [ ] 归档页面正常工作
- [ ] 友链页面正常工作
- [ ] 搜索功能（需要生产构建）
- [ ] 评论区域显示
- [ ] GitHub Actions 工作流运行
- [ ] 评论数据同步

## 🔧 常用命令

```bash
# 开发
npm run dev

# 构建
npm run build

# 预览构建结果
npm run preview

# 同步博客和评论
npm run sync-blog
```

## 📚 相关文档

- [BLOG_IMPROVEMENTS.md](./BLOG_IMPROVEMENTS.md) - 完整改进列表
- [COMMENTS_SYSTEM.md](./COMMENTS_SYSTEM.md) - 评论系统详细说明
- [src/data/comments/README.md](./src/data/comments/README.md) - 评论数据目录说明

## 🎯 下一步

### 必须做的

1. ✅ 推送代码到 GitHub
2. ✅ 验证 GitHub Actions 运行正常

### 可选优化

1. 编辑友情链接数据 (`src/pages/blog/friends.astro`)
2. 调整同步频率（编辑 `.github/workflows/sync-blog.yml`）
3. 添加更多 Issue 标签用于分类
4. 自定义评论样式

## ❓ 常见问题

**Q: 评论多久更新一次？**  
A: 每小时自动同步一次，也可以手动触发。

**Q: 可以修改同步频率吗？**  
A: 可以，编辑 `.github/workflows/sync-blog.yml` 中的 cron 表达式。

**Q: 评论需要审核吗？**  
A: 不需要，但你可以在 GitHub Issues 中管理评论（删除、关闭等）。

**Q: 支持多语言评论吗？**  
A: 支持，GitHub 支持任何语言。

**Q: 评论支持 Markdown 吗？**  
A: 完全支持，包括代码高亮、链接、图片等。

## 🎉 完成！

现在你的博客已经有了完整的评论系统！访问你的博客，查看效果吧。

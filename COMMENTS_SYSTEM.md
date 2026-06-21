# 评论系统实现说明

## 系统架构

本博客采用**本地评论系统**，通过定时同步 GitHub Issue 评论到本地 JSON 文件，实现高性能的评论展示。

## 工作流程

```
GitHub Issues (评论源) 
    ↓ 定时同步
本地 JSON 文件 (src/data/comments/)
    ↓ 构建时读取
静态页面 (评论已嵌入)
```

### 优势

✅ **性能优秀**: 评论数据在构建时就已嵌入页面，无需客户端请求  
✅ **不消耗 API**: 不会在用户访问时消耗 GitHub API 配额  
✅ **静态部署**: 完全支持静态托管，无需服务器  
✅ **离线可用**: 评论数据本地存储，离线也能查看

### 同步频率

- **GitHub Actions**: 每小时自动同步（推荐）
- **手动同步**: 运行 `npm run sync-blog`

## 文件结构

```
src/
├── pages/blog/_components/
│   ├── CommentsLocal.astro    # 本地评论组件（当前使用）
│   └── Comments.astro          # 实时 API 组件（备用）
├── data/comments/
│   ├── README.md              # 说明文档
│   ├── {issueNumber}.json    # 评论数据文件
│   └── .gitkeep
scripts/
└── sync-blog.js               # 同步脚本（同步文章+评论）
.github/workflows/
└── sync-blog.yml              # GitHub Actions 工作流
```

## 评论数据格式

每个 Issue 的评论保存为独立的 JSON 文件，格式如下：

```json
[
  {
    "id": 123456,
    "user": {
      "login": "username",
      "avatar_url": "https://avatars.githubusercontent.com/...",
      "html_url": "https://github.com/username"
    },
    "body": "Markdown 格式的评论内容",
    "body_html": "<p>HTML 格式的评论内容</p>",
    "created_at": "2024-06-01T10:00:00Z",
    "updated_at": "2024-06-01T10:00:00Z"
  }
]
```

## 使用方法

### 本地开发同步

1. **设置 GitHub Token**
   ```bash
   cp .env.example .env
   # 编辑 .env，填入 GITHUB_TOKEN
   ```

2. **运行同步**
   ```bash
   npm run sync-blog
   ```

3. **查看结果**
   - 文章: `src/content/blog/*.md`
   - 评论: `src/data/comments/*.json`

### GitHub Actions 自动同步（推荐）

1. **推送代码到 GitHub**
   ```bash
   git add .
   git commit -m "feat: 添加评论系统"
   git push
   ```

2. **GitHub Actions 会自动**:
   - 每小时同步一次
   - 自动提交新评论到仓库
   - 触发网站重新部署

3. **手动触发**:
   - 访问仓库的 Actions 页面
   - 选择 "同步博客和评论" 工作流
   - 点击 "Run workflow"

## 同步脚本功能

`scripts/sync-blog.js` 会执行以下操作：

1. ✅ 获取所有带 `blog` 标签的 GitHub Issues
2. ✅ 为每个 Issue 生成 Markdown 文件
3. ✅ 同步每个 Issue 的评论到 JSON 文件
4. ✅ 更新元数据（记录最后同步时间和评论数）
5. ✅ 删除已关闭 Issue 的文章和评论

## 组件使用

在文章页面中使用评论组件：

```astro
---
import CommentsLocal from './_components/CommentsLocal.astro';
---

<CommentsLocal 
  issueNumber={post.data.issueNumber} 
  issueUrl={post.data.issueUrl} 
/>
```

组件会自动：
- 尝试加载对应的评论 JSON 文件
- 渲染评论列表
- 显示"在 GitHub 上评论"按钮
- 处理无评论的情况

## 备用方案

如果需要实时评论（不推荐，会消耗 API 配额），可以使用 `Comments.astro` 组件：

```astro
import Comments from './_components/Comments.astro';
```

该组件会在每次构建时向 GitHub API 请求最新评论。

## 故障排查

### 问题：同步脚本报 403 错误

**原因**: GitHub API 速率限制（未认证每小时 60 次）

**解决**:
1. 设置 `GITHUB_TOKEN` 环境变量
2. 使用 GitHub Actions（自动使用内置 Token）

### 问题：评论不显示

**检查**:
1. 确认 `src/data/comments/{issueNumber}.json` 文件存在
2. 运行 `npm run sync-blog` 同步
3. 检查控制台是否有错误

### 问题：评论更新不及时

**说明**: 这是正常的，评论通过定时任务同步

**解决**:
- 等待下次自动同步（每小时）
- 或手动触发 GitHub Actions 工作流
- 或本地运行 `npm run sync-blog`

## 性能数据

- **页面加载**: 无额外请求，评论数据已嵌入
- **API 消耗**: 仅同步时消耗，用户访问不消耗
- **构建时间**: 每篇文章增加约 0.1 秒
- **文件大小**: 每条评论约 1-2 KB

## 未来优化

可选的进一步优化方向：

1. **增量同步**: 只同步有更新的评论
2. **评论缓存**: 添加 ETag 支持
3. **评论分页**: 超过 50 条评论时分页
4. **评论通知**: 新评论时发送邮件通知

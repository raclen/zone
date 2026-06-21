# 评论数据目录

此目录存储从 GitHub Issues 同步的评论数据。

## 文件格式

每个文件以 Issue 编号命名，例如 `123.json`，包含该 Issue 的所有评论。

### 评论数据结构

```json
[
  {
    "id": 评论ID,
    "user": {
      "login": "用户名",
      "avatar_url": "头像URL",
      "html_url": "用户主页"
    },
    "body": "Markdown 格式评论内容",
    "body_html": "HTML 格式评论内容",
    "created_at": "创建时间",
    "updated_at": "更新时间"
  }
]
```

## 如何同步评论

### 前置条件

需要设置 GitHub Token 以避免 API 速率限制：

1. 复制 `.env.example` 为 `.env`
2. 在 `.env` 中设置 `GITHUB_TOKEN`
3. 获取 Token: https://github.com/settings/tokens

### 运行同步

```bash
npm run sync-blog
```

该命令会：
1. 同步所有带有 `blog` 标签的 Issues
2. 为每个 Issue 生成 Markdown 文件
3. 同步每个 Issue 的评论到此目录

### 定时任务

建议使用 cron 或 GitHub Actions 定期运行同步：

```bash
# 每小时同步一次
0 * * * * cd /path/to/project && npm run sync-blog
```

或使用 GitHub Actions（推荐）:

```yaml
name: Sync Blog
on:
  schedule:
    - cron: '0 * * * *'  # 每小时
  workflow_dispatch:  # 手动触发

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run sync-blog
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      - uses: stefanzweifel/git-auto-commit-action@v4
        with:
          commit_message: "chore: sync blog and comments"
```

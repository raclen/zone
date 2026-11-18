# IndexNow 配置说明

## 这是什么

IndexNow 是一个开放协议：站点内容更新后，主动把 URL 推给 Bing、Yandex 等搜索引擎，
无需等爬虫自己发现。**ChatGPT 的联网检索基于 Bing 索引，所以这条通道对 AI 推荐很关键。**

## 当前的实现

- 密钥文件：`public/{KEY}.txt`（内容就是 KEY 本身，由 IndexNow 协议规定）
- 推送脚本：`scripts/indexnow.mjs`
- 自动化：`.github/workflows/sync-blog.yml` 在同步文章后调用脚本

## 换密钥时要做的事

1. 生成新的 32 位十六进制字符串，例如：
   `node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"`
2. 新建 `public/<新KEY>.txt`，内容写 `<新KEY>`（一行，不要多余字符）
3. 删除旧的 `public/<旧KEY>.txt`
4. 把新 KEY 填进 `scripts/indexnow.mjs` 的 `INDEXNOW_KEY` 常量

## 手动推送全部文章

```bash
node scripts/indexnow.mjs
```

脚本会读取 `src/content/blog/*.md`，拼出所有文章 URL 后批量提交。
Bing 对单次提交的 URL 数量有限制，脚本已按每批 10000 条分组（协议上限）。

## 验证

提交后可以在 Bing Webmaster Tools 的 IndexNow 页面看到提交记录，
通常几分钟内就会开始抓取。
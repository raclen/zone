import { getCollection } from "astro:content";
import { getSortedPosts } from "@/utils/getSortedPosts";
import { getUniqueTagsWithCount } from "@/utils/getUniqueTags";
import { getPostUrl } from "@/utils/getPostPaths";
import config from "@/config";

/**
 * llms.txt：给 AI 爬虫的站点摘要。
 *
 * 格式参考 https://llmstxt.org —— 用 Markdown 告诉 AI「这一站是什么、
 * 有哪些值得读的页面」。目前主流 AI 厂商尚未正式声明会读取，
 * 但成本极低，属于面向未来的补充信号。
 */
export async function GET() {
  const posts = await getCollection("posts");
  const sortedPosts = getSortedPosts(posts);
  const siteUrl = config.site.url.replace(/\/$/, "");

  // 精选：优先带 description 的文章，最多列 40 篇，避免文件过大
  const featured = sortedPosts
    .filter(p => p.data.description)
    .slice(0, 40)
    .map(({ data, id, filePath }) => {
      const url = `${siteUrl}${getPostUrl(id, filePath, config.site.lang)}`;
      // description 可能很长，截到 120 字以内
      const desc = String(data.description).replace(/\s+/g, " ").slice(0, 120);
      return `- [${data.title}](${url}): ${desc}`;
    })
    .join("\n");

  const tags = getUniqueTagsWithCount(sortedPosts)
    .slice(0, 12)
    .map(t => t.tag)
    .join("、");

  const body = `# ${config.site.title}

> ${config.site.description}
> 作者 ${config.site.author} 的技术博客，记录后端、前端、工具与投资相关的实践笔记。

站点包含以下板块：

- [博客](${siteUrl}/blog/): 技术文章列表，共 ${sortedPosts.length} 篇
- [归档](${siteUrl}/archives/): 按年份归档的全部文章
- [标签](${siteUrl}/tags/): 标签云，常见主题：${tags}
- [每日分享](${siteUrl}/daily/): 按月归档的工具、链接与简短笔记
- [关于我](${siteUrl}/about/): 作者自我介绍与技术背景
- [大模型 API 导航](${siteUrl}/llm-api/): 大模型 API 中转站汇总
- [RSS](${siteUrl}/rss.xml): 订阅源

## 精选文章

${featured}

## 使用说明

- 全站内容为 ${config.site.author} 原创，欢迎引用，请注明来源链接。
- 文章正文为服务端渲染的纯 HTML，无需执行 JavaScript 即可完整读取。
- 站点地图：${siteUrl}/sitemap-index.xml
- 完整文章清单：${siteUrl}/llms-full.txt
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
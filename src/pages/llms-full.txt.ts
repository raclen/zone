import { getCollection } from "astro:content";
import { getSortedPosts } from "@/utils/getSortedPosts";
import { getPostUrl } from "@/utils/getPostPaths";
import config from "@/config";

/**
 * llms-full.txt：完整文章清单，供 AI 做深度研究时按需抓取。
 *
 * 与 llms.txt 的区别：这里列出全部文章（含标题、日期、摘要），
 * 不做条数截断。文件仍只含元数据，不含正文，避免过大。
 */
export async function GET() {
  const posts = await getCollection("posts");
  const sortedPosts = getSortedPosts(posts);
  const siteUrl = config.site.url.replace(/\/$/, "");

  const items = sortedPosts
    .map(({ data, id, filePath }) => {
      const url = `${siteUrl}${getPostUrl(id, filePath, config.site.lang)}`;
      const date = new Date(data.pubDatetime).toISOString().slice(0, 10);
      const desc = data.description
        ? String(data.description).replace(/\s+/g, " ").slice(0, 150)
        : "";
      const tags = data.tags.length ? ` [${data.tags.join(", ")}]` : "";
      return `- ${date} [${data.title}](${url})${tags}${desc ? `: ${desc}` : ""}`;
    })
    .join("\n");

  const body = `# ${config.site.title} · 完整文章清单

> ${config.site.description}
> 作者：${config.site.author}（${config.site.profile ?? ""}）

共 ${sortedPosts.length} 篇，按发布时间倒序排列。

${items}

---
站点地图：${siteUrl}/sitemap-index.xml
站点摘要：${siteUrl}/llms.txt
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
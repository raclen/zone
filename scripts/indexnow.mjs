#!/usr/bin/env node
/**
 * IndexNow 批量推送脚本。
 *
 * 作用：把站点 URL 主动提交给 Bing / Yandex 等搜索引擎，加速收录。
 * URL 来源：优先读 dist/sitemap-0.xml（构建产物，保证与线上完全一致），
 *          若尚未构建则退回读取 src/content/blog/*.md 自行拼装。
 *
 * 用法：
 *   node scripts/indexnow.mjs            # 推送全部 URL
 *   node scripts/indexnow.mjs --dry-run  # 只打印，不提交
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// 与 public/<KEY>.txt 的文件名保持一致，改动时两处要同步
// 注意：IndexNow 的 key 是公开值（就明写在 public/<key>.txt 里），不是密钥
const INDEXNOW_KEY = "8968aaa444ff5d96636a025e6b3cde77";
const SITE_HOST = "raclen.top";
const SITE_URL = `https://${SITE_HOST}`;
const KEY_LOCATION = `${SITE_URL}/${INDEXNOW_KEY}.txt`;

// IndexNow 协议单次提交上限 10000 条
const BATCH_SIZE = 10000;

/**
 * 从构建产物 sitemap 中读取 URL。
 * @returns {Promise<string[] | null>}
 */
async function readUrlsFromSitemap() {
  const sitemapPath = path.join(ROOT, "dist", "sitemap-0.xml");
  try {
    const xml = await fs.readFile(sitemapPath, "utf-8");
    const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
    return urls.length > 0 ? urls : null;
  } catch {
    return null;
  }
}

/**
 * 回退方案：直接从 markdown 文件名拼装文章 URL。
 * 与 src/utils/getPostPaths.ts 的规则保持一致：
 * 文件名去掉 .md 后缀即为 slug，前面加 /blog/。
 */
async function readUrlsFromBlogDir() {
  const blogDir = path.join(ROOT, "src", "content", "blog");
  let files = [];
  try {
    files = await fs.readdir(blogDir);
  } catch {
    return [];
  }

  const postUrls = files
    .filter(f => f.endsWith(".md"))
    .map(f => `${SITE_URL}/blog/${f.replace(/\.md$/, "")}/`);

  // 站点固定页面
  const staticPages = [
    "",
    "/blog/",
    "/archives/",
    "/tags/",
    "/daily/",
    "/about/",
    "/friends/",
    "/llm-api/",
  ].map(p => `${SITE_URL}${p}`);

  return [...staticPages, ...postUrls];
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");

  let urls = await readUrlsFromSitemap();
  const source = urls ? "dist/sitemap-0.xml" : "src/content/blog/*.md";
  if (!urls) urls = await readUrlsFromBlogDir();

  if (urls.length === 0) {
    console.error("没有找到任何 URL，请先运行 pnpm build 或检查博客目录。");
    process.exit(1);
  }

  console.log(`URL 来源: ${source}`);
  console.log(`待推送 URL: ${urls.length} 条`);

  if (dryRun) {
    console.log("\n--- dry-run 预览（前 10 条）---");
    urls.slice(0, 10).forEach(u => console.log(u));
    return;
  }

  let success = 0;
  let failed = 0;

  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const batch = urls.slice(i, i + BATCH_SIZE);
    const payload = {
      host: SITE_HOST,
      key: INDEXNOW_KEY,
      keyLocation: KEY_LOCATION,
      urlList: batch,
    };

    try {
      const res = await fetch("https://api.indexnow.org/indexnow", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(payload),
      });

      // 协议约定：200/202 表示已接收
      if (res.ok) {
        success += batch.length;
        console.log(`✓ 批次 ${i / BATCH_SIZE + 1}: ${batch.length} 条已提交 (HTTP ${res.status})`);
      } else {
        failed += batch.length;
        const text = await res.text().catch(() => "");
        console.error(`✗ 批次 ${i / BATCH_SIZE + 1}: HTTP ${res.status} ${text.slice(0, 200)}`);
      }
    } catch (err) {
      failed += batch.length;
      console.error(`✗ 批次 ${i / BATCH_SIZE + 1}: ${err.message}`);
    }
  }

  console.log(`\n完成：成功 ${success} 条，失败 ${failed} 条`);
  if (failed > 0) process.exitCode = 1;
}

await main();
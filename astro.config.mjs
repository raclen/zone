// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// 部署到 Cloudflare Pages 的纯静态站点。
export default defineConfig({
  site: "https://raclen.cyou",
  output: "static",
  integrations: [sitemap()],
});

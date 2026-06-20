// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// 部署到 Cloudflare Pages 的纯静态站点。
// 绑定自定义域名后，请把 site 改成正式域名（用于 canonical / og / sitemap）。
export default defineConfig({
  site: "https://anheplayer.pages.dev",
  output: "static",
  integrations: [sitemap()],
});

// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import pagefind from "astro-pagefind";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 部署到 Cloudflare Pages 的纯静态站点。
export default defineConfig({
  site: "https://raclen.cyou",
  output: "static",
  integrations: [sitemap(), pagefind()],
  vite: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      rollupOptions: {
        external: [/^\/pagefind\//],
      },
    },
  },
});

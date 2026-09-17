import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://raclen.qzz.io",
    title: "当下的七炎",
    description: "记录技术、工具、投资与日常思考。",
    author: "raclen",
    profile: "https://github.com/raclen",
    ogImage: "og-image.png",
    lang: "zh-CN",
    timezone: "Asia/Shanghai",
    dir: "ltr",
  },
  posts: {
    perPage: 8,
    perIndex: 8,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: false,
    showArchives: true,
    showBackButton: true,
    editPost: {
      enabled: true,
      url: "https://github.com/raclen/zone/edit/main/",
    },
    search: "pagefind",
  },
  socials: [
    { name: "github", url: "https://github.com/raclen" },
  ],
  shareLinks: [
    { name: "x", url: "https://x.com/intent/post?url=" },
    { name: "telegram", url: "https://t.me/share/url?url=" },
    { name: "mail", url: "mailto:?subject=推荐一篇文章&body=" },
  ],
  // 评论区：自建 CWD（Cloudflare Workers + D1 + KV）
  // 后台：https://cwd-admin.raclen.qzz.io ／ API：https://cwd-api.raclen.qzz.io
  // 与 Giscus 的关键差异：CWD 以「路径」而非「完整 URL」聚合评论，
  // 因此 raclen.qzz.io 等所有自定义域名共享同一份评论，不会按域名分裂。
  comments: {
    enabled: true,
    provider: "cwd",
    apiBaseUrl: "https://cwd-api.raclen.qzz.io",
    siteId: "raclen.qzz.io",
    widgetSrc: "/vendor/cwd-widget/0.2.0/cwd.js",
    canonicalOrigin: "https://raclen.qzz.io",
    pageSize: 20,
    lang: "zh-CN",
  },

  // 如需回退到 Giscus：还原 src/pages/blog/_components/GiscusComments.astro
  // （git show <commit>:src/pages/blog/_components/GiscusComments.astro）
  // 并替换为下面这段配置。注意旧评论的讨论标题是按「完整 URL」建的，
  // 换回后只有 https://raclen.cyou/blog/xxx 这一份讨论能被匹配到。
  // comments: {
  //   enabled: true,
  //   provider: "giscus",
  //   repo: "raclen/zone",
  //   repoId: "R_kgDOTAMRcg",
  //   category: "General",
  //   categoryId: "DIC_kwDOTAMRcs4C_n62",
  //   mapping: "url",
  //   strict: "0",
  //   reactionsEnabled: true,
  //   emitMetadata: false,
  //   inputPosition: "bottom",
  //   theme: "preferred_color_scheme",
  //   lang: "zh-CN",
  // },
});

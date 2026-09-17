/**
 * Internal resolved configuration used throughout the codebase.
 *
 * Prefer editing `astro-paper.config.ts` instead of this file. This module exists to
 * apply defaults and expose a fully-resolved config shape (`ResolvedAstroPaperConfig`).
 */
import userConfig from "@/astro-paper.config";
import type { ResolvedAstroPaperConfig } from "./types/config";

const DEFAULT_OG_IMAGE = "default-og.jpg";

const commentsConfig = userConfig.comments?.enabled
  ? {
      provider: "cwd" as const,
      // 指向自建的 CWD Workers API（见 E:/code/cwd/temp/CWD-部署与维护笔记.md）
      apiBaseUrl: "https://cwd-api.raclen.qzz.io",
      // 多站点统计用的标识，换域名时无需改（仅作为逻辑标签）
      siteId: "raclen.qzz.io",
      // 组件产物已本地化，不依赖第三方 CDN
      widgetSrc: "/vendor/cwd-widget/0.2.0/cwd.js",
      // 让文章点赞 / PV 归一到主域名，避免多域名导致的数据分裂
      canonicalOrigin: userConfig.site.url,
      pageSize: 20,
      lang: "zh-CN",
      ...userConfig.comments,
    }
  : { enabled: false as const };

const config: ResolvedAstroPaperConfig = {
  site: {
    ...userConfig.site,
    ogImage: userConfig.site.ogImage ?? DEFAULT_OG_IMAGE,
    lang: userConfig.site.lang ?? "en",
    timezone: userConfig.site.timezone ?? "UTC",
    dir: userConfig.site.dir ?? "ltr",
    googleVerification: userConfig.site.googleVerification,
  },
  posts: {
    perPage: userConfig.posts?.perPage ?? 4,
    perIndex: userConfig.posts?.perIndex ?? 4,
    scheduledPostMargin:
      userConfig.posts?.scheduledPostMargin ?? 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: userConfig.features?.lightAndDarkMode ?? true,
    dynamicOgImage: userConfig.features?.dynamicOgImage ?? true,
    showArchives: userConfig.features?.showArchives ?? true,
    showBackButton: userConfig.features?.showBackButton ?? true,
    editPost: userConfig.features?.editPost ?? { enabled: false },
    search: userConfig.features?.search ?? "pagefind",
  },
  socials: userConfig.socials ?? [],
  shareLinks: userConfig.shareLinks ?? [],
  comments: commentsConfig,
};

export default config;

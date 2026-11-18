// Cloudflare Pages Functions 中间件（临时）
//
// 目的：把无法在 Cloudflare 控制台配置重定向的旧域名 301 到主站。
// 背景：raclen.ee.cd 只是 Pages 自定义域，主域 ee.cd 不在本账户内，
//      既没有 zone 可用「单一重定向」，也不适用账户级「批量重定向」，
//      Pages 的 _redirects 又不支持域名级匹配，只能靠中间件按 hostname 判断。
//
// ⚠️ 临时方案，2026-12-18 起自动失效（不再跳转），届时可直接删除本文件与 functions 目录。
const EXPIRES_AT = Date.parse("2026-12-18T00:00:00Z");
const PRIMARY_ORIGIN = "https://raclen.top";

// 需要被跳转的旧域名；主站 raclen.top 不在此列，保持正常访问
const LEGACY_HOSTS = new Set(["raclen.ee.cd"]);

export async function onRequest({ request, next }) {
  if (Date.now() < EXPIRES_AT) {
    const url = new URL(request.url);
    if (LEGACY_HOSTS.has(url.hostname)) {
      // 保留原路径与查询串，避免旧链接落到首页
      return Response.redirect(
        `${PRIMARY_ORIGIN}${url.pathname}${url.search}`,
        301
      );
    }
  }
  return next();
}
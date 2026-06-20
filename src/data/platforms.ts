// GitHub 仓库与 Release 相关常量 + 各平台安装包元数据。
// 下载逻辑（Hero / Download 组件的客户端脚本）会读取这些匹配规则，
// 从 GitHub Releases API 动态定位每个平台的最新安装包。
// 新增/调整平台时，只改这里，无需动模板。

export const GITHUB_OWNER = "raclen";
export const GITHUB_REPO = "AnhePlayer";
export const GITHUB_REPO_URL = `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}`;
export const RELEASES_URL = `${GITHUB_REPO_URL}/releases`;
export const RELEASES_LATEST_URL = `${RELEASES_URL}/latest`;
export const LATEST_API = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases/latest`;
export const UPSTREAM_URL = "https://github.com/maotoumao/MusicFreeDesktop";

/** API 不可用（限流/断网）时的兜底版本与直链所基于的版本号。 */
export const FALLBACK_VERSION = "1.0.10";

export type OsKey = "windows" | "macos" | "linux";
export type IconKey = "windows" | "apple" | "linux";

export interface PlatformAsset {
  /** 唯一 id，也用作 DOM data-key */
  id: string;
  os: OsKey;
  /** 展示名 */
  label: string;
  /** 类型/适用说明 */
  note: string;
  /** 是否为该系统的推荐首选 */
  recommended?: boolean;
  /** 在 Release assets 文件名中匹配的子串 */
  match: string;
}

export interface OsGroup {
  os: OsKey;
  label: string;
  icon: IconKey;
}

export const OS_GROUPS: OsGroup[] = [
  { os: "windows", label: "Windows", icon: "windows" },
  { os: "macos", label: "macOS", icon: "apple" },
  { os: "linux", label: "Linux", icon: "linux" },
];

export const PLATFORMS: PlatformAsset[] = [
  {
    id: "win-setup",
    os: "windows",
    label: "安装版",
    note: "推荐 · .exe 安装包",
    recommended: true,
    match: "win32-x64-setup.exe",
  },
  {
    id: "win-portable",
    os: "windows",
    label: "便携版",
    note: "免安装 · .zip 解压即用",
    match: "win32-x64-portable.zip",
  },
  {
    id: "mac-arm",
    os: "macos",
    label: "Apple 芯片",
    note: "M1/M2/M3/M4 · .dmg",
    recommended: true,
    match: "darwin-arm64.dmg",
  },
  {
    id: "mac-intel",
    os: "macos",
    label: "Intel 芯片",
    note: "Intel 处理器 · .dmg",
    match: "darwin-x64.dmg",
  },
  {
    id: "linux-deb",
    os: "linux",
    label: "DEB 包",
    note: "Debian / Ubuntu · .deb",
    recommended: true,
    match: "linux-amd64.deb",
  },
  {
    id: "linux-rpm",
    os: "linux",
    label: "RPM 包",
    note: "Fedora / RHEL · .rpm",
    match: "linux-amd64.rpm",
  },
];

/** 构造某平台在指定版本下的兜底直链（API 失败时使用）。 */
export function fallbackUrl(p: PlatformAsset, version = FALLBACK_VERSION): string {
  return `${GITHUB_REPO_URL}/releases/download/v${version}/AnhePlayer-${version}-${p.match}`;
}

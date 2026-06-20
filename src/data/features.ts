// 核心功能卡片数据（取自仓库 README 的功能模块，精选 8 项）。
// icon 为图标 key，对应 Features.astro 中的 SVG 映射。

export interface Feature {
  icon: string;
  title: string;
  desc: string;
}

export const FEATURES: Feature[] = [
  {
    icon: "desktop",
    title: "跨平台桌面端",
    desc: "Windows、macOS、Linux 全覆盖，安装版与便携版任你选择。",
  },
  {
    icon: "puzzle",
    title: "洛雪插件扩展",
    desc: "安装洛雪 .js 插件或订阅链接，自由扩展在线音源与解析能力。",
  },
  {
    icon: "lyrics",
    title: "智能歌词",
    desc: "自动联网匹配、内嵌同步歌词、翻译歌词与桌面歌词一应俱全。",
  },
  {
    icon: "folder",
    title: "本地曲库管理",
    desc: "扫描本地文件夹，按单曲、歌手、专辑、文件夹分类整理。",
  },
  {
    icon: "search",
    title: "在线浏览搜索",
    desc: "经插件浏览歌曲、歌手、专辑、歌单与各类热门排行榜。",
  },
  {
    icon: "palette",
    title: "主题随心换",
    desc: "内置浅色与纯黑主题，支持本地及远程主题包深度定制外观。",
  },
  {
    icon: "download",
    title: "下载管理",
    desc: "自定义下载目录、默认音质、并发数量与文件命名格式。",
  },
  {
    icon: "shield",
    title: "无广告 · 重隐私",
    desc: "没有广告打扰，应用数据默认留在本机，绝不上传个人信息。",
  },
];

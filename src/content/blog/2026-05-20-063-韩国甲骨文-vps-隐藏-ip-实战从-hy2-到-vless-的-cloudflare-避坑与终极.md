---
title: "韩国甲骨文 VPS 隐藏 IP 实战：从 Hy2 到 VLESS 的 Cloudflare 避坑与终极优化指南
前言"
description: "薅到韩国甲骨文（Oracle）VPS 的小伙伴，往往都在享受其地理位置带来的低延迟红利。但随之而来的也是安全问题：如何隐藏 VPS 的真实 IP 防止被攻击或封锁？ 很多人的第一反应是套上大名鼎鼎的 Cloudflare（无论是 DNS 代理还是 Cloudflare Tunnel 隧道）。然而，技..."
pubDate: 2026-05-20T21:56:35Z
updatedDate: 2026-05-20T21:56:35Z
issueNumber: 63
issueUrl: https://github.com/raclen/raclen.github.io/issues/63
tags: []
author:
  name: "raclen"
  avatar: "https://avatars.githubusercontent.com/u/7697758?v=4"
draft: false
---

薅到韩国甲骨文（Oracle）VPS 的小伙伴，往往都在享受其地理位置带来的低延迟红利。但随之而来的也是安全问题：如何隐藏 VPS 的真实 IP 防止被攻击或封锁？
很多人的第一反应是套上大名鼎鼎的 Cloudflare（无论是 DNS 代理还是 Cloudflare Tunnel 隧道）。然而，技术方案如果没有选对，往往会引来“断网”或“网速断崖式下跌”的惨剧。本文将复盘一次关于 Hy2/VLESS 协议结合 Cloudflare 穿透的实战调优，帮你彻底避开底层协议的致命大坑。
------------------------------
## 一、 核心概念厘清：单机需要配置多个 CF 隧道吗？
在开始配置前，很多人对 Cloudflare Tunnel（CF隧道）有一个误区：是不是我本地每运行一个端口的服务，就需要单独配置一个域名和一条隧道？
答案是：完全不需要！
你只需要遵循 “单机单隧道，多端口多域名（子域名）” 的架构即可。
一台 VPS 只需要安装和运行一个 cloudflared 客户端。这一个隧道内部可以添加无数条规则，通过不同的子域名同时转发几十个不同的本地端口。
配置示例（本地 config.yaml）：

ingress:
  - hostname: blog.raclen.xyz
    service: http://localhost:8080      # 个人博客
  - hostname: nas.raclen.xyz
    service: http://localhost:9000       # NAS面板
  - hostname: proxy.raclen.xyz
    service: http://localhost:12345     # 代理节点
  - service: http_status:404            # 兜底404

------------------------------
## 二、 Hysteria 2 (Hy2) 遇到 Cloudflare：为什么是“致命灾难”？
如果你的 VPS 上跑的是目前大火的 Hysteria 2 (Hy2) 协议，并且为了隐藏 IP 开启了 Cloudflare 代理，你会发现网络要么彻底瘫痪，要么慢如牛车。
## 1. 致命伤：UDP 被强行转为 TCP
Hy2 之所以能实现极致的抗丢包和高带宽，核心在于其底层的 UDP 协议（QUIC）。
然而，免费版的 Cloudflare 代理（常规 CDN 橙色云朵）以及 Cloudflare Tunnel 默认只支持标准的 TCP 流量。当你强行让 Hy2 走隧道时，CF 会把 UDP 数据包打包成 TCP 流量传输，导致 Hy2 的核心算法直接废掉，武功全失。
## 2. 物理绕路：延迟暴涨
韩国甲骨文直连国内时，延迟通常极低（30ms - 80ms）。但 Cloudflare 的免费套餐对中国大陆流量非常不友好，通常会把流量调度到美西（如洛杉矶）节点。
一旦开启代理，你的流量路径会变成：国内 -> 美西 CF 节点 -> 韩国甲骨文。延迟会从几十毫秒暴涨到 250ms - 400ms，直接绕地球大半圈。

❌ Hy2 的最终结论：绝对不要为了隐藏 IP 让 Hy2 走 Cloudflare 代理或隧道。如果追求极致速度，Hy2 必须直连！

------------------------------
## 三、 VLESS 遇到 Cloudflare：天生一对的戏剧性逆转！
如果你对速度有一定要求，同时把“安全、彻底隐藏 IP”放在第一位，那么最佳的组合拳是：VLESS (WebSocket 模式) + Cloudflare Tunnel + 优选 IP。
为什么说 VLESS 配合隧道非常完美？因为它可以完美避开 Hy2 的所有缺点，并实现三大核心优势：

   1. 协议 100% 契合：VLESS 配置为 WebSocket (WS) 传输模式后，底层天生就是标准的 HTTP/TCP 流量。隧道透传时不需要做任何协议转换，完美契合。
   2. VPS 绝对隐形（零入站端口暴露）：使用 CF Tunnel 后，你的甲骨文 VPS 不需要对外开放任何入站端口（甚至可以在甲骨文云后台关闭所有入站安全组）。VPS 主动向外与 CF 建立加密信道，外界根本无法探测到你的真实 IP。
   3. 完美兼容“优选 IP”技术：你可以通过客户端“偷天换日”，在挽回绕路延迟的同时，安全隐藏 IP。

------------------------------
## 四、 实战：VLESS + CF Tunnel + 优选 IP 终极配置流程## 步骤 1：VPS 端配置 VLESS
在甲骨文 VPS 上部署 VLESS 服务时，将传输协议（Network）设置为 ws（WebSocket），自定义一个路径（如 /vless-tunnel），并让其监听本地的某一个端口（例如 12345）。
## 步骤 2：配置 Cloudflare Tunnel 隧道
在 VPS 的隧道配置文件（或在 Cloudflare Zero Trust 网页后台的 Public Hostname 页面）中，将你的域名（如 raclen.xyz）指向本地的 VLESS 端口：

ingress:
  - hostname: raclen.xyz
    service: http://localhost:12345   # 指向 VLESS 本地端口
  - service: http_status:404

## 步骤 3：本地运行优选 IP 脚本
在你的本地电脑上下载开源的 CloudflareSpeedTest 脚本并运行。它会从成百上千个 CF 边缘节点中，测出当前对你本地网络延迟最低、速度最快的 近场优选 IP（通常是 104.x.x.x 或 172.x.x.x 开放了 80/443 的节点）。
## 步骤 4：代理客户端配置“偷天换日”
在手机或电脑的代理客户端（如 v2rayN、Nekobox 等）中添加该 VLESS 节点，核心参数修改如下：

* 地址 (Address)：不要填你的真实 IP 或域名，直接填写步骤 3 测出来的 Cloudflare 优选 IP。
* 端口 (Port)：填写 443（若开启 TLS，推荐）或 80。
* 传输协议 (Network)：选择 ws。
* 伪装域名 (Host / SNI)：必须填写你真实的隧道域名 raclen.xyz。
* 路径 (Path)：填写步骤 1 中定义的路径（如 /vless-tunnel）。

💡 数据流向原理：
客户端通过 优选 IP 接入离你最近、速度最快的 Cloudflare 节点 $\rightarrow$ 携带伪装域名 raclen.xyz 握手成功 $\rightarrow$ Cloudflare 内部通过 Tunnel 隧道 将流量秘密送回韩国甲骨文 VPS。
整个过程中，你全程在和 Cloudflare 通信，真实 IP 稳如泰山，同时靠优选 IP 成功挽回了免费 CF 绕路美西的速度损失！

------------------------------
## 五、 总结：如何选择适合你的方案？
对于韩国甲骨文 VPS 用户，最终的架构选择可以参考以下生死铁律：

* 【速度至上，无惧风险】 $\rightarrow$ 选择 Hy2 协议 + 纯直连。利用韩国 VPS 的天然地理优势，享受低延迟爆速体验，但需要承担 IP 暴露给公网的微小风险。
* 【安全第一，兼顾速度】 $\rightarrow$ 选择 VLESS (WS) + Cloudflare Tunnel + 优选 IP。VPS 彻底对外隐形，不暴露任何端口，依靠优选 IP 维持优良的日常刷视频体验。

------------------------------
如果文章对你有帮助，欢迎点赞、转发和收藏！如果你在配置 cloudflared 隧道或 VLESS 落地时遇到任何问题，欢迎在评论区留言讨论。
------------------------------



---

💬 **[在 GitHub Issue 讨论这篇文章](https://github.com/raclen/raclen.github.io/issues/63)**

---
title: "Claude Code 连接本机 Chrome（chrome-devtools MCP）"
description: "结论先行 本机 Chrome 是 **151**，远程调试通过  开启， 走的是 **M144+ 受控流程**，必须给 MCP 服务器配 ， 老式  **连不上**。 --- 两种连接模式（选错就是本次踩坑的根因） | 模式 | MCP 参数 | Chrome 侧要求 |  | |---|---|-..."
pubDate: 2026-08-19T09:20:05Z
updatedDate: 2026-08-31T01:30:10Z
issueNumber: 186
issueUrl: https://github.com/raclen/zone/issues/186
tags: ["AI"]
author:
  name: "raclen"
  avatar: "https://avatars.githubusercontent.com/u/7697758?v=4"
draft: false
---

## 结论先行

本机 Chrome 是 **151**，远程调试通过 `chrome://inspect/#remote-debugging` 开启，
走的是 **M144+ 受控流程**，必须给 MCP 服务器配 `--autoConnect`，
老式 `--browserUrl http://127.0.0.1:9222` **连不上**。

---

## 两种连接模式（选错就是本次踩坑的根因）

| 模式 | MCP 参数 | Chrome 侧要求 | `/json/version` |
|---|---|---|---|
| 老式直连 | `--browserUrl http://127.0.0.1:9222` | 启动时带 `--remote-debugging-port=9222` | 返回 JSON |
| 受控自动连接（M144+） | `--autoConnect` | `chrome://inspect/#remote-debugging` 开关 + 弹框授权 | **404** |

**关键区别**：受控模式下 9222 端口虽然 LISTENING，但 `/json/*` 全部返回 404，
必须由 MCP 侧发起握手、用户在 Chrome 弹框点「允许」后才放行。
用老式 `--browserUrl` 去打就是 404，且报错文案是
`Failed to fetch browser webSocket URL ... HTTP Not Found`，很容易误判成「Chrome 没开」。

---

## 错误信息对照表（一眼定位）

| 报错 | 含义 | 处理 |
|---|---|---|
| `fetch failed` | 9222 **压根没监听**，Chrome 未开远程调试 | 去 `chrome://inspect/#remote-debugging` 打开开关 |
| `HTTP Not Found`（404） | 端口开着，但**模式不匹配** | MCP 参数换成 `--autoConnect` |
| 正常返回页面列表 | 已连通 | — |

`fetch failed` → `HTTP Not Found` 的变化本身就是进度信号：说明端口起来了，只剩模式问题。

---

## 正确配置

配置文件：`C:\Users\Administrator\.claude.json` 的 `mcpServers.chrome-devtools`

```json
{
  "type": "stdio",
  "command": "npx",
  "args": ["-y", "chrome-devtools-mcp@latest", "--autoConnect"],
  "env": {}
}
```

**坑**：文档示例里带 `--channel=beta`，那是因为发文时 M144 还在 Beta。
本机是正式版 151，**加了反而会去找 Chrome Beta 安装**，必须去掉。

**坑**：改完必须**重启 Claude Code**。MCP 服务器只在启动时读配置，
当前会话里跑的仍是旧参数的进程。重启后首次调用工具时 Chrome 弹授权框，点「允许」。
连通后浏览器顶部挂「Chrome 正受到自动测试软件的控制」横幅。

修改前先备份：`cp .claude.json .claude.json.bak-<日期>`

---


## 排查命令

```bash
# ① 端口是否监听 + 归属进程
netstat -ano | grep ":9222"
powershell -NoProfile -Command "Get-Process -Id <PID> | Select Id,ProcessName,Path"

# ② 探测端点（404 = 受控模式，JSON = 老式模式）
curl -s -i http://127.0.0.1:9222/json/version

# ③ Chrome 版本（>=144 才支持 --autoConnect）
powershell -NoProfile -Command "(Get-Item 'C:\Program Files\Google\Chrome\Application\chrome.exe').VersionInfo.ProductVersion"

# ④ 确认启动参数里有没有 --remote-debugging-port
powershell -NoProfile -Command "Get-CimInstance Win32_Process -Filter \"Name='chrome.exe'\" | Where-Object { \$_.CommandLine -match 'remote-debugging' } | Select -Expand CommandLine"
```

第 ④ 步若查不到 `--remote-debugging-port` 但端口确实在监听 → 一定是受控模式。

---

## 关于 9222 端口常开的安全性

**当前配置下风险很低，可以一直开着。** 理由：

1. **只绑 `127.0.0.1`**，外网和局域网都够不到（`netstat` 已确认，不是 `0.0.0.0`）
2. **受控模式有二次授权**：`/json/*` 默认 404，任何客户端要拿调试会话都得弹框经你点「允许」，
   不像老式 `--remote-debugging-port` 那样端口一开就裸奔
3. 会话激活时有**顶部横幅提示**，被偷偷接管能看出来

**仍需注意的**：

- 本机上的**其他本地程序**（任意进程、恶意脚本）理论上可以发起连接请求 —— 挡它的只有那个授权弹框。
  所以**看到没主动触发的授权框，一律点拒绝**
- 一旦授权，对方能读取当前 profile 的**全部登录态、Cookie、页面内容**，等同完整账号权限
- **绝不要**给 Chrome 加 `--remote-debugging-address=0.0.0.0`，那才是真正的高危裸奔
- 长期不用时去 `chrome://inspect/#remote-debugging` 把开关关掉最干净

对比老式模式：`--remote-debugging-port=9222` 启动的 Chrome **没有授权环节**，
本机任何进程直接 `curl` 就能全量控制浏览器，那个才应该用完即关。

---

### 参考 
https://developer.chrome.com/blog/chrome-devtools-mcp-debug-your-browser-session?hl=zh-

---
title: "Playwright 接管本地 Edge，交给AI来做"
description: "上一篇文章我们写的如果操作浏览器，这些，我们不用写代码。 claude code + gpt 对话 我： AI： 我: AI: <img width=\"1897\" height=\"2735\" alt=\"Image\" src=\"https://github.com/user-attachments/a..."
pubDate: 2026-05-26T03:18:31Z
updatedDate: 2026-06-04T22:25:26Z
issueNumber: 67
issueUrl: https://github.com/raclen/raclen.github.io/issues/67
tags: []
author:
  name: "raclen"
  avatar: "https://avatars.githubusercontent.com/u/7697758?v=4"
draft: false
---

上一篇文章我们写的如果操作浏览器，这些，我们不用写代码。
claude code + gpt

### 对话
我：
```用playwright 看看能不能在我打开的浏览器，新开标签页（https://www.nodeloc.com/），来实现，这样就可以复用cookies```
AI：
```
好主意，但我无法直接连接到你的本地浏览器。不过可以换个方式——通过 Playwright 的 CDP 协议远程连接到你的浏览器实例。

你的浏览器需要先以远程调试模式启动，然后我就能通过 CDP 连接并进行操作了。请按以下步骤操作：

关闭所有 Chrome 浏览器窗口
打开 CMD 或 PowerShell，运行：

& "C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222
或者如果你用的是 Edge：


& "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --remote-debugging-port=9222
浏览器启动后，手动打开 nodeloc.com（确保已登录状态）
把命令行的输出结果发给我，特别是 DevTools listening on ws:// 那行地址
这样我就可以通过 Playwright 连接到你的本地浏览器，在新标签页中操作了。
```
我:
```
ws://127.0.0.1:9222/devtools/browser/292f8e3d-9232-40d5-89be-d974ec3cc708
```
AI:
```
我已经连上你的本地 Chrome 了；现在在同一个浏览器上下文里新开标签页，并尝试在本地会话里完成一次操作和截图。
```

<img width="1897" height="2735" alt="Image" src="https://github.com/user-attachments/assets/b725ced9-5e92-4d02-ab9a-519304e4917f" />
这时候，AI执行会失败，提示它用powershell，windows上bash有bug

```
可以，PowerShell 方式成功了：我已经连上你本地的 Edge，会话共享正常，并在你当前浏览器上下文里新开了标签页打开 NodeLoc，登录态也识别到了。

你可以看这张本地截图：
[nodeloc-edge-local-check.png](vscode-webview://1all4tffupkrm1qo08mthi4mr52koegn2lc1ljuj1v0v6eiovn4q/nodeloc-edge-local-check.png)

我还留了脚本，后面可以直接复用：
[local-edge-cdp-check.js](vscode-webview://1all4tffupkrm1qo08mthi4mr52koegn2lc1ljuj1v0v6eiovn4q/local-edge-cdp-check.js)
```
我:
```
打开【现在买车有什么推荐的吗？】 这个帖子，然后你评论一下，50字
```
AI:
```
已经用你本地的 Edge 打开帖子《现在买车有什么推荐的吗？》并发出了评论。

截图在这里：
[nodeloc-comment-posted.png](vscode-webview://1all4tffupkrm1qo08mthi4mr52koegn2lc1ljuj1v0v6eiovn4q/nodeloc-comment-posted.png)

如果你愿意，我下一步可以继续直接用这个本地 Edge 会话帮你做别的站内操作。
```

---

💬 **[在 GitHub Issue 讨论这篇文章](https://github.com/raclen/raclen.github.io/issues/67)**

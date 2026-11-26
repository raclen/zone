---
title: "让 Claude Code 和 Codex CLI 共享记忆：我的 AI 编程工作流实践"
description: "最近一段时间，我越来越依赖 AI 辅助开发。 从最开始用 ChatGPT 查询问题，到后来使用 Claude Code、Codex CLI 直接参与项目开发，AI 已经逐渐成为我的日常开发工具。 但是在使用过程中，我遇到了一个比较明显的问题： **不同 AI 工具之间，像是互不认识。** 比如： 我..."
pubDate: 2026-07-20T07:13:33Z
updatedDate: 2026-07-20T07:13:33Z
issueNumber: 183
issueUrl: https://github.com/raclen/zone/issues/183
tags: ["AI"]
author:
  name: "raclen"
  avatar: "https://avatars.githubusercontent.com/u/7697758?v=4"
draft: false
---

最近一段时间，我越来越依赖 AI 辅助开发。

从最开始用 ChatGPT 查询问题，到后来使用 Claude Code、Codex CLI 直接参与项目开发，AI 已经逐渐成为我的日常开发工具。

但是在使用过程中，我遇到了一个比较明显的问题：

**不同 AI 工具之间，像是互不认识。**

比如：

我在 ChatGPT 里聊过：

> 我的开发环境是 Windows 11，主要使用 PowerShell，不希望默认使用 WSL。

也聊过：

> 我的服务器是 Oracle Cloud VPS，资源有限，部署方案要优先考虑轻量。

但是打开 Claude Code：

它不知道。

切换到 Codex CLI：

它也不知道。

每次开始新的对话，都需要重新介绍：

* 我的电脑环境；
* 我的技术栈；
* 我的代码习惯；
* 我的项目背景。

这让我意识到：

现在 AI 的能力已经很强，但是缺少一个属于自己的长期上下文。

于是我开始尝试建立一个自己的 AI 知识库，让 Claude Code 和 Codex CLI 共享同一套信息。

---

# 一、为什么 AI 需要“记忆”？

很多人使用 AI 时，关注的是模型能力：

比如：

* GPT 更聪明还是 Claude 更强；
* 哪个模型写代码更好；
* 哪个工具速度更快。

但是实际使用下来，我发现：

影响体验的不只是模型能力，还有上下文。

同一个问题：

> “我的项目应该使用什么数据库？”

如果 AI 不知道你的情况，它只能给通用答案。

但是如果它知道：

* 你的服务器只有 1GB 内存；
* 你主要使用 Node.js；
* 你希望降低维护成本；
* 你倾向简单方案；

它给出的建议会完全不同。

所以：

**好的 AI 助手，不只是回答问题，而是理解你的工作环境。**

---

# 二、为什么不直接依赖 AI 自带记忆？

最开始我也考虑过：

能不能直接让 Claude Code 或 Codex CLI 自己记住？

但后来发现，这种方式有几个问题。

## 第一，不同 AI 之间无法共享

每个工具都有自己的上下文体系。

例如：

* ChatGPT 有 Memory；
* Claude Code 使用 CLAUDE.md；
* Codex CLI 使用 AGENTS.md。

它们之间并不会自动同步。

今天积累在 Claude 里的经验，换到 Codex 可能就消失了。

---

## 第二，重要信息应该属于自己

开发环境、项目经验、技术决策，这些其实都是自己的资产。

比如：

为什么选择某个框架？

为什么不用某个方案？

以前遇到过什么坑？

这些信息不应该绑定某一个 AI 平台。

所以我的思路变成：

> 不让 AI 保存我的记忆，而是我自己维护一份知识库，让 AI 去读取。

---

# 三、建立自己的 AI 知识库

我创建了一个独立目录：

```
AI-context

├── hardware.md
├── servers.md
├── coding.md
├── projects.md
└── decisions.md
```

它就是所有 AI 的共享上下文。

---

# 四、记录我的硬件环境

文件：

```
hardware.md
```

保存电脑配置。

例如：

```md
# Hardware

主力电脑：

CPU:
AMD Ryzen 5 5600GT

内存:
32GB

显卡:
GTX 1060 3GB


系统:

Windows 11
Ubuntu 24.04
```

为什么需要记录？

因为很多开发建议和硬件相关。

例如：

部署本地服务。

如果 AI 知道你的机器配置，就不会推荐完全不适合的方案。

---

# 五、记录服务器环境

文件：

```
servers.md
```

例如：

```md
# Servers

Oracle Cloud VPS

系统:

Ubuntu

用途:

- Docker
- Cloudflare Tunnel
- API 服务


限制:

- 内存较小
- 优先选择轻量方案
```

这个非常重要。

很多 AI 默认假设：

“服务器资源无限”。

但实际开发中：

可能只是一个 1GB 内存的小 VPS。

提前告诉 AI，它才能给出符合现实的方案。

---

# 六、记录自己的编码习惯

文件：

```
coding.md
```

例如：

```md
# Coding Style

常用技术：

- JavaScript
- TypeScript
- React
- Next.js
- Node.js


代码习惯：

- 优先最小修改
- 保留已有注释
- 不随意重构
- 不随意升级依赖
```

这个可以明显改善 AI 写代码的风格。

否则很多 AI 会倾向：

“发现问题 → 大规模重构”。

但实际项目里：

很多时候只需要改几行代码。

---

# 七、记录项目背景和技术决策

除了项目信息，我觉得最有价值的是：

技术决策记录。

文件：

```
decisions.md
```

例如：

```md
# Decisions

选择 Fastify 作为 API 框架。

原因：

- 性能较高
- 资源占用低
- 更适合小型服务器
```

代码只能告诉 AI：

“现在是什么样”。

但是无法告诉 AI：

“为什么这样设计”。

记录决策后，AI 后续修改项目时，会更加符合原来的方向。

---

# 八、让 Claude Code 和 Codex CLI 读取同一份知识库

有了知识库，还需要让 AI 使用它。

---

## Claude Code

创建：

```
~/.claude/CLAUDE.md
```

内容：

```md
请参考我的 AI 知识库：

@D:\AI-context\hardware.md

@D:\AI-context\servers.md

@D:\AI-context\coding.md

@D:\AI-context\projects.md

@D:\AI-context\decisions.md
```

---

## Codex CLI

创建：

```
~/.codex/AGENTS.md
```

内容：

```md
我的共享上下文：

D:\AI-context\hardware.md

D:\AI-context\servers.md

D:\AI-context\coding.md

D:\AI-context\projects.md

D:\AI-context\decisions.md
```

这样两个工具使用的是同一套信息。

---

# 九、这样做之后有什么变化？

以前：

打开 Claude Code：

> 请介绍一下你的项目环境。

打开 Codex：

> 你的技术栈是什么？

现在：

它们可以直接知道：

* 我的系统环境；
* 我的开发工具；
* 我的技术偏好；
* 我的服务器情况；
* 我的代码习惯。

最大的变化不是 AI 变聪明了。

而是：

它终于开始理解我的工作方式。

---

# 十、未来的 AI 编程助手应该是什么样？

我认为未来 AI 编程工具竞争的不只是模型能力。

模型能力会越来越接近。

真正拉开差距的是：

**谁更了解用户。**

一个优秀的 AI 助手应该知道：

* 你的环境；
* 你的习惯；
* 你的项目；
* 你的历史决策。

模型提供能力。

上下文提供经验。

---

# 总结

目前我比较推荐的 AI 编程工作流：

```
                 AI-context
                     |
        -----------------------------
        |                           |
    Claude Code                Codex CLI

    CLAUDE.md                  AGENTS.md
```

核心思想：

不要让每个 AI 工具分别建立记忆。

建立一个属于自己的知识库，让所有 AI 共享。

这样以后：

* 更换 AI 工具；
* 更换电脑；
* 更换模型；

都不需要重新培养一个助手。

真正属于自己的 AI 编程助手，不应该只是一个会写代码的工具。

它应该是一个越来越了解你的长期合作伙伴。


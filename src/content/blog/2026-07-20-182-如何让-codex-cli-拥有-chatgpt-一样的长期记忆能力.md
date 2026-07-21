---
title: "如何让 Codex CLI 拥有 ChatGPT 一样的长期记忆能力"
description: "背景 最近在使用 ChatGPT 网页版和 Codex CLI 的过程中，发现了一个明显区别： ChatGPT 网页版越来越像一个了解你的长期助手，它知道你的技术背景、使用习惯、项目方向，回答问题时会结合过去的信息。 而 Codex CLI 默认更像一个刚启动的新助手： * 不知道你的开发环境； *..."
pubDate: 2026-07-20T06:52:50Z
updatedDate: 2026-07-20T06:53:07Z
issueNumber: 182
issueUrl: https://github.com/raclen/zone/issues/182
tags: ["AI"]
author:
  name: "raclen"
  avatar: "https://avatars.githubusercontent.com/u/7697758?v=4"
draft: false
---

## 背景
最近在使用 ChatGPT 网页版和 Codex CLI 的过程中，发现了一个明显区别：

ChatGPT 网页版越来越像一个了解你的长期助手，它知道你的技术背景、使用习惯、项目方向，回答问题时会结合过去的信息。

而 Codex CLI 默认更像一个刚启动的新助手：

* 不知道你的开发环境；
* 不知道你的技术栈；
* 不知道你的编码习惯；
* 不知道之前做过哪些项目决策。

对于长期使用 AI 辅助开发的人来说，这种“失忆”会降低效率。

那么，能不能让 Codex CLI 也拥有类似 ChatGPT Memory 的能力？

答案是：可以。

通过 **Codex Memories + AGENTS.md + 项目上下文管理**，可以打造一个更加懂你的 AI 编程环境。

---

# 一、为什么网页版 ChatGPT 更智能？

网页版 ChatGPT 的优势主要来自三个方面：

## 1. 对话历史

同一个聊天窗口里，模型可以看到之前的上下文。

例如：

你之前告诉它：

* 使用 Windows 11；
* 喜欢 PowerShell；
* 不希望默认使用 WSL；
* 使用 Next.js 开发；
* 有 Oracle Cloud VPS。

后续提问时，它可以直接结合这些信息。

---

## 2. 用户记忆（Memory）

ChatGPT 可以保存长期有效的信息。

例如：

> 用户偏好中文回答。

> 用户经常使用 JavaScript 和 Next.js。

> 用户喜欢简单可靠的解决方案。

这些信息会影响未来回答。

---

## 3. 用户画像

长期使用后，AI 会逐渐形成对用户的理解。

它知道：

* 你的技术水平；
* 你的工具链；
* 你的决策偏好。

这也是为什么网页版体验会越来越顺手。

---

# 二、Codex CLI 默认为什么没有这种体验？

Codex CLI 更偏向工程工具。

它主要关注：

* 当前代码目录；
* 当前任务；
* 当前上下文。

默认情况下：

```text
启动 Codex
    ↓
读取当前项目
    ↓
执行任务
```

它不会自动知道：

```text
你是谁
你的机器环境
你的长期习惯
你的历史项目
```

因此需要主动建立上下文系统。

---

# 三、开启 Codex Memories

新版 Codex CLI 支持 Memories 功能。

在：

```text
~/.codex/config.toml
```

添加：

```toml
[features]
memories = true

[memories]
use_memories = true
generate_memories = true
```

三个配置分别表示：

## memories

开启记忆系统。

---

## use_memories

使用已有记忆。

例如：

以前记录：

> 用户喜欢 PowerShell，不喜欢 WSL。

以后 Codex 会参考这个习惯。

---

## generate_memories

允许 Codex 自动生成新的长期记忆。

例如：

你多次使用：

* Next.js
* PostgreSQL
* Cloudflare

它可能总结这些长期信息。

---

# 四、AGENTS.md：Codex 的“个人说明书”

除了 Memory，最重要的是：

```text
AGENTS.md
```

它是 Codex 的约定配置文件。

类似：

Claude Code 的：

```text
CLAUDE.md
```

---

## 全局 AGENTS.md

位置：

Windows：

```text
C:\Users\用户名\.codex\AGENTS.md
```

Linux：

```text
~/.codex/AGENTS.md
```

它用于保存：

* 个人开发环境；
* 编码习惯；
* 常用技术栈；
* 操作偏好。

例如：

```md
# Development Environment

## OS

- Windows 11
- PowerShell 7
- Ubuntu 24.04

## Rules

- Windows 命令优先 PowerShell
- 不默认使用 bash
- 不推荐 WSL

## Stack

- Node.js
- TypeScript
- React
- Next.js
- PostgreSQL

## Coding Style

- 最小修改原则
- 保留已有注释
- 不随意重构
```

以后每次启动 Codex，它都会知道你的开发环境。

---

# 五、项目级 AGENTS.md

全局配置解决：

> “我是谁”

项目配置解决：

> “这个项目是什么”

例如：

一个 Next.js 项目：

```text
blog/
│
├── AGENTS.md
├── package.json
└── src/
```

项目中的：

```md
# Project Rules

项目：

Next.js 博客系统

技术：

- App Router
- TypeScript
- Ant Design

规则：

- 优先 Server Component
- 不随意增加依赖
- 保持现有目录结构
```

这样 Codex 进入项目后，就知道：

* 项目架构；
* 技术选择；
* 开发限制。

---

# 六、不要把所有东西塞进一个文件

很多人会把所有信息写进：

```text
AGENTS.md
```

长期来看并不好。

推荐分层：

```text
~/.codex/

├── config.toml

├── AGENTS.md

├── context/

│   ├── hardware.md

│   ├── servers.md

│   ├── projects.md

│   └── preferences.md
```

职责：

## AGENTS.md

负责：

> 规则和入口。

---

## context 文件

负责：

> 详细资料。

例如：

servers.md：

```md
Oracle VPS:

- Ubuntu
- Docker
- Cloudflare Tunnel

注意：

- 资源有限
- 优先轻量方案
```

---

# 七、打造自己的 AI 工作台

更进一步，可以把：

* Codex CLI
* Claude Code
* Obsidian
* MCP

连接起来。

架构：

```text
个人知识库
      |
      |
   Markdown
      |
      |
     MCP
      |
      |
Codex / Claude Code
```

最终效果：

AI 不只是帮你写代码。

它还能理解：

* 为什么这么设计；
* 以前踩过什么坑；
* 哪些方案不要再尝试。

---

# 八、AI 编程助手未来的方向

未来优秀的 AI 助手，不只是模型能力强。

更重要的是：

## 1. 长期上下文

知道用户是谁。

---

## 2. 项目记忆

知道项目历史。

---

## 3. 决策记录

知道为什么这么设计。

---

## 4. 工具连接

知道如何操作真实环境。

---

单纯比较：

“哪个模型更聪明？”

可能越来越没有意义。

真正的差距会变成：

> 谁拥有更完整、更准确、更适合自己的上下文系统。

---

# 总结

如果希望 Codex CLI 接近 ChatGPT 网页版体验，推荐组合：

```text
Codex Memories
        +
~/.codex/AGENTS.md
        +
项目 AGENTS.md
        +
个人知识库
```

其中：

* Memory 负责自动学习；
* AGENTS.md 负责明确规则；
* 项目上下文负责工程知识；
* 知识库负责长期积累。

最终目标不是让 AI “记住更多”，而是让 AI 更懂你的工作方式。

一个真正高效的 AI 编程助手，不应该每次启动都是陌生人。


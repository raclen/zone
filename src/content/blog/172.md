---
title: "agent-browser-cli"
description: "https://github.com/sleepinginsummer/agent-browser-cli/blob/main/skills/agent-browser-cli/SKILL.md https://linux.do/t/topic/2167656?u=raclen 他能做的事情 自动化..."
pubDate: 2026-05-14T03:23:43Z
issueNumber: 172
issueUrl: https://github.com/raclen/zone/issues/172
tags: ["AI"]
author:
  name: "raclen"
  avatar: "https://avatars.githubusercontent.com/u/7697758?v=4"
draft: false
---


https://github.com/sleepinginsummer/agent-browser-cli/blob/main/skills/agent-browser-cli/SKILL.md

https://linux.do/t/topic/2167656?u=raclen

他能做的事情
自动化测试
可以复用真实浏览器环境做页面流程验证、表单提交、按钮点击、跳转检查、登录态页面测试。
前端页面 Debug
可以读取 DOM、执行 JS、查看页面状态、截图确认效果，辅助定位前端交互、渲染和数据问题，对接后端接口。
页面样式调试
可以在真实页面里执行 JS 修改 DOM / CSS，临时验证样式、布局和交互效果，但更偏辅助调试，不是完整设计工具。
网页数据采集
可以读取页面内容、表格、列表、Cookie 和接口相关状态，适合处理需要登录态的页面数据提取。
浏览器操作脚本化
可以把打开页面、切换标签页、执行 JS、截图、上传文件等操作串成脚本，做重复性网页任务。
Agent 辅助操作网页后台
适合让 AI Agent 操作管理后台、配置页面、低代码平台、表单系统等已有网页工具。
页面结构分析
可以简化 HTML、识别主要内容区和列表结构，帮助 Agent 更快理解复杂页面。
安全研究和逆向辅助
可以在真实浏览器会话里观察页面行为、执行调试脚本、读取前端状态，辅助分析前端逻辑和接口调用
他的能力
扫描当前 Chrome 标签页，获取页面标题、URL 和标签页 ID。
切换到指定标签页，复用已有页面和登录态。
打开新标签页，支持直接访问目标 URL。
在页面中执行 JavaScript，读取 DOM、表单、状态和页面数据。
读取当前页面 Cookie，方便处理登录态相关任务。
调用 Chrome CDP 能力，执行更底层的页面控制。
截取页面截图，用于视觉检查和页面确认。
上传本地文件到网页文件选择框。
操作下拉框、按钮、表单等常见页面元素。

### 用法 
安装后，在claude code中，使用agent-browser-cli do something

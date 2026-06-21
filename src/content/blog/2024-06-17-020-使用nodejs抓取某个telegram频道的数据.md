---
title: "使用nodejs抓取某个telegram频道的数据"
description: "在 Node.js 中抓取 Telegram 频道的数据可以通过使用  的 JavaScript 等效库  和  实现。这些库允许我们与 Telegram 的 API 交互，获取频道的消息。下面是使用  和  的详细步骤。  方法一：使用  库   库提供了对 Telegram API 的高..."
pubDate: 2024-06-17T12:08:11Z
updatedDate: 2024-06-22T15:54:43Z
issueNumber: 20
issueUrl: https://github.com/raclen/raclen.github.io/issues/20
tags: ["nodejs"]
author:
  name: "raclen"
  avatar: "https://avatars.githubusercontent.com/u/7697758?v=4"
draft: false
---

在 Node.js 中抓取 Telegram 频道的数据可以通过使用 `Telethon` 的 JavaScript 等效库 `telegram` 和 `grammy` 实现。这些库允许我们与 Telegram 的 API 交互，获取频道的消息。下面是使用 `telegram` 和 `grammy` 的详细步骤。

### 方法一：使用 `telegram` 库

`telegram` 库提供了对 Telegram API 的高级接口，适合用来进行各种交互操作。

1. **安装 `telegram` 库**：
   ```bash
   npm install telegram
   ```

2. **获取 API ID 和 API Hash**：
   - 访问 [my.telegram.org](https://my.telegram.org) 并登录你的 Telegram 账户。
   - 创建一个新的应用程序以获取 API ID 和 API Hash。

3. **使用 `telegram` 库登录并获取频道数据**：

   创建一个新的文件（例如 `fetchTelegramData.js`），并添加以下代码：

   ```javascript
   const { TelegramClient } = require('telegram');
   const { StringSession } = require('telegram/sessions');
   const input = require('input'); // 工具库，用于获取用户输入

   const apiId = 'YOUR_API_ID'; // 替换为你的 API ID
   const apiHash = 'YOUR_API_HASH'; // 替换为你的 API Hash
   const stringSession = new StringSession(''); // 可以为空

   (async () => {
     const client = new TelegramClient(stringSession, apiId, apiHash, {
       connectionRetries: 5,
     });

     await client.start({
       phoneNumber: async () => await input.text('请输入你的电话号码：'),
       password: async () => await input.text('请输入你的密码：'),
       phoneCode: async () => await input.text('请输入你收到的验证码：'),
       onError: (err) => console.log(err),
     });

     console.log('你已成功登录！');

     // 替换为你的频道用户名或 URL
     const channel = 'YOUR_CHANNEL_USERNAME';

     const result = await client.getMessages(channel, { limit: 10 });

     result.forEach((message) => {
       console.log(message.message);
     });

     await client.disconnect();
   })();
   ```

4. **运行脚本**：
   在命令行中运行以下命令：

   ```bash
   node fetchTelegramData.js
   ```

   按提示输入你的电话号码、密码和验证码。登录后，你将会看到从指定频道获取的最新消息。

### 方法二：使用 `grammy` 库

`grammy` 库是一个用于与 Telegram Bot API 交互的现代库。适用于通过 Bot 获取频道消息。

1. **安装 `grammy` 库**：
   ```bash
   npm install grammy
   ```

2. **创建一个 Telegram Bot**：
   - 使用 `@BotFather` 在 Telegram 中创建一个新 Bot，并获取 API Token。

3. **将 Bot 添加到频道**：
   - 确保你的 Bot 被添加到目标频道，并且具备读取消息的权限。

4. **使用 `grammy` 库获取频道数据**：

   创建一个新的文件（例如 `fetchChannelMessages.js`），并添加以下代码：

   ```javascript
   const { Bot } = require('grammy');

   const botToken = 'YOUR_BOT_API_TOKEN'; // 替换为你的 Bot API Token
   const bot = new Bot(botToken);

   // 替换为你的频道 ID（负数）或用户名
   const channelId = '@YOUR_CHANNEL_USERNAME';

   (async () => {
     // 获取最近的 10 条消息
     const messages = await bot.api.getUpdates({ limit: 10 });

     messages.forEach((update) => {
       if (update.message && update.message.chat && update.message.chat.username === channelId) {
         console.log(update.message.text);
       }
     });
   })();
   ```

5. **运行脚本**：
   在命令行中运行以下命令：

   ```bash
   node fetchChannelMessages.js
   ```

   脚本将会输出频道中的最新消息。

### 注意事项

- **权限管理**：确保你的 Bot 被添加到频道，并具有读取消息的权限。如果是私有频道，你需要是管理员。
- **API 速率限制**：避免频繁请求导致超出 Telegram 的速率限制。
- **安全性**：在处理 API Token 和用户信息时要格外小心，避免泄露敏感信息。

这两种方法都可以有效地帮助你抓取 Telegram 频道的数据，根据你的需求选择最适合的方案。

---

💬 **[在 GitHub Issue 讨论这篇文章](https://github.com/raclen/raclen.github.io/issues/20)**

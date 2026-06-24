---
title: "前端Server-Sent Events通信"
description: "先看效果图    后端需要两个接口，一个post协议，一个sse 下面是node代码，使用express data: Connection established\\n\\ndata: ${message}\\n\\nServer time: ${new Date().toLocaleTimeS..."
pubDate: 2024-09-27T02:16:47Z
issueNumber: 140
issueUrl: https://github.com/raclen/zone/issues/140
tags: ["网络", "idea"]
author:
  name: "raclen"
  avatar: "https://avatars.githubusercontent.com/u/7697758?v=4"
draft: false
---


先看效果图
![image](https://github.com/user-attachments/assets/703e6de0-75d3-4034-8b15-a7ac8aed9954)


后端需要两个接口，一个post协议，一个sse
下面是node代码，使用express
```javascript
  let clients = [];
// SSE 连接，向客户端推送数据
  app.get('/robot/streamData', (req, res) => {
    // 设置响应头，保持连接
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();  // 强制发送头部，保持连接

    console.log('Client connected');
    // 连接时发送一条初始消息
    res.write(`data: Connection established\n\n`);


    // 将客户端的响应对象保存到数组中，便于后续推送数据
    clients.push(res);

    // 当客户端断开连接时，清理数组
    req.on('close', () => {
      clients = clients.filter(client => client !== res);
      res.end();  // 关闭连接
      console.log('Client disconnected');
    });
  });

// 接收客户端通过POST请求发送的数据
  app.post('/robot/sendData', (req, res) => {
    const { message } = req.body;

    // // 向所有已连接的客户端广播消息
    // clients.forEach(client =>{
    //   client.write(`data: ${message}\n\n`)
    //   client.flush();  // 强制刷新数据
    // });
    // 使用定时器每隔 5 秒推送一次消息
    setInterval(() => {
      const message = `Server time: ${new Date().toLocaleTimeString()}`;
      console.log('Sending message:', message);
      sendToAllClients(message);  // 向所有连接的客户端推送数据
    }, 5000);  // 每 5 秒间隔发送消息

    res.status(200).send({ status: 'Message sent to clients' });
  });

// 模拟服务器定期发送数据给所有客户端
  function sendToAllClients(message) {
    // console.log('Sending to clients:', message);

    clients.forEach(client => {
      console.log('client:');
      client.write(`data: ${message}\n\n`);  // 按 SSE 格式发送消息
      client.flush();  // 强制刷新数据
    });
  }
```
前端
```javascript
  componentDidMount() {
    // 建立 SSE 长连接
    const eventSource = new EventSource('/robot/streamData');
    // console.log('xd-eventSource',eventSource)
    // console.log('xd-EventSource2',EventSource)

// 监听服务器推送的消息
    eventSource.onmessage = function(event) {
      console.log('打印服务器推送的数据 :', event.data);  // 打印服务器推送的数据
    };

// 处理连接打开事件
    eventSource.onopen = function() {
      console.log('Connection to server opened.');
    };

// 处理连接出错事件（例如连接断开或网络问题）
    eventSource.onerror = function(err) {
      console.error('EventSource failed:', err);
    };


  }

  // 发送数据给服务器的函数
  handleSendMessage=(message)=> {
    fetch('/robot/sendData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),  // 将消息通过 POST 请求发送给服务器
    })
        .then(response => response.json())
        .then(data => console.log('Message sent:', data))
        .catch(error => console.error('Error:', error));
  }

// View.js
    <botton onClick={() => {
          handleSendMessage('接收服务器推送的消息并发送数据')
        }
        }>发送SSE
        </botton>
```


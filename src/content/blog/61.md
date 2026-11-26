---
title: "express post请求res.body 取不到数据"
description: "使用post请求，json格式的时候，这里需要使用一个中间件 参考链接 https://cnodejs.org/topic/53c89067c9507b4044b1deaa https://github.com/expressjs/body-parser"
pubDate: 2015-10-19T02:42:49.000Z
issueNumber: 61
issueUrl: https://github.com/raclen/zone/issues/61
tags: ["legacy", "JavaScript", "网络", "Node.js", "nodejs"]
author:
  name: "raclen"
  avatar: "https://avatars.githubusercontent.com/u/7697758?v=4"
draft: false
---


使用post请求，json格式的时候，`req.body=undefind `这里需要使用一个中间件`body-parser`
```javascript
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// see https://github.com/expressjs/body-parser
// 添加 body-parser 中间件就可以了
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.post('/', function (req, res) {
    console.log('req.body', req.body);
    res.send({airead: 'fan'});
});

app.listen(8888);
```
参考链接
https://cnodejs.org/topic/53c89067c9507b4044b1deaa
https://github.com/expressjs/body-parser


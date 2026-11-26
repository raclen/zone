---
title: "node+Mongoose实现分页"
description: "如果说hibernate是让程序员用面向对象的思维操作数据库，Mongoose就是让程序员用函数的思想操作数据库。 这个人写的是对的，就是有个单词写错了exex应为 修改后如下 //CORS处理跨域"
pubDate: 2015-10-19T05:32:00.000Z
issueNumber: 62
issueUrl: https://github.com/raclen/zone/issues/62
tags: ["legacy", "JavaScript", "数据库", "Node.js", "nodejs", "MongoDB"]
author:
  name: "raclen"
  avatar: "https://avatars.githubusercontent.com/u/7697758?v=4"
draft: false
---


如果说hibernate是让程序员用面向对象的思维操作数据库，Mongoose就是让程序员用函数的思想操作数据库。
[node+Mongoose实现分页的原理](http://blog.csdn.net/save____/article/details/8890856)这个人写的是对的，就是有个单词写错了exex应为`exec`
修改后如下
```javascript
    var mongoose = require(“mongoose”);
    mongoose.connect(“mongodb://localhost/adb”); //连接mongodb
    var model = mongoose.model(‘myCollection’,{title:String});

    var start = 1;           //这边可以改为接收参数后的计算
    var pageSize = 10; //每一页显示的数据条数
    model.find().skip(start).limit(pageSize).exec(function(err,datas){
    //dosomething for your page
    //datas 是分页后的数据 这边写你的数据渲染或其他操作
    });
```
//CORS处理跨域
```javascript
var express = require('express');  
var app = express();  
//设置CORS
app.all('*', function(req, res, next) {  
    res.header("Access-Control-Allow-Origin", "*");  
    //第二个参数,是一个*号,表示任意域名下的页面都可以都可以请求请求这台服务器;
    //设置指定域名:
    //res.header("Access-Control-Allow-Origin", "http://baidu.com");
    //这样,baidu.com下面的网页,就可以ajax请求你的服务器了
    res.header("Access-Control-Allow-Headers", "X-Requested-With");  
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");  
    //第二个参数,为对方可以以哪种HTTP请求方式请求你的服务器,根据自己的情况酌情设置
    res.header("X-Powered-By",' 3.2.1')  
    res.header("Content-Type", "application/json;charset=utf-8");  
    next();  
});  
```


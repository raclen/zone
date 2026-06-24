---
title: "动态table不支持onclick"
description: "- 不要着急，其实你知道了问题所在，就成功了大半,解决办法，table外面套一个div，IE7、8、9table又不支持冒泡，你获取parent()就可以了 - 打开一个窗口"
pubDate: 2014-05-29T11:56:15.000Z
issueNumber: 14
issueUrl: https://github.com/raclen/zone/issues/14
tags: ["legacy", "JavaScript"]
author:
  name: "raclen"
  avatar: "https://avatars.githubusercontent.com/u/7697758?v=4"
draft: false
---


- 不要着急，其实你知道了问题所在，就成功了大半,解决办法，table外面套一个div，IE7、8、9table又不支持冒泡，你获取parent()就可以了
- 打开一个窗口`window.open("/b_eps_portal/"+racl,'newwindow')`


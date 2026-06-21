---
title: "script标签中defer和async"
description: "script    这段代码的含义是: 在文档资源执行完毕后, 然后 、 并发下载(浏览器机制), 顺序执行。  下面这种写法与上面这种写法效果相同:    注意到关键词 , 它的特点如下:  * 并发下载, ; * 渲染完再执行;  再来看如下写法:    此..."
pubDate: 2019-09-19T07:59:56Z
updatedDate: 2019-09-19T08:00:16Z
issueNumber: 8
issueUrl: https://github.com/raclen/raclen.github.io/issues/8
tags: []
author:
  name: "raclen"
  avatar: "https://avatars.githubusercontent.com/u/7697758?v=4"
draft: false
---

### script

```js
<html>
  <body>
    ...
    <script src='a.js'></script>
    <script src='b.js'></script>
  </body>
</html>
```

这段代码的含义是: 在文档资源执行完毕后, 然后 `a.js`、`b.js` 并发下载(浏览器机制), 顺序执行。

下面这种写法与上面这种写法效果相同:

```js
<html>
  <head>
    <script src='a.js' defer></script>
    <script src='b.js' defer></script>
  </head>
  <body>
    ...
  </body>
</html>
```

注意到关键词 `defer`, 它的特点如下:

* 并发下载, `顺序执行`;
* 渲染完再执行;

再来看如下写法:

```js
<html>
  <head>
    <script src='a.js' async></script>
    <script src='b.js' async></script>
  </head>
  <body>
    ...
  </body>
</html>
```

此时的关键词是 `async`, 它的特点如下:

* 并发下载, `异步执行`(谁先下载好先执行谁);
* 下载完就执行;

原文地址[script标签](https://github.com/MuYunyun/blog/blob/master/BasicSkill/%E5%9F%BA%E7%A1%80%E7%AF%87/script%E6%A0%87%E7%AD%BE.md)

### 扩展阅读
[浅谈script标签的defer和async](https://segmentfault.com/a/1190000006778717)

---

💬 **[在 GitHub Issue 讨论这篇文章](https://github.com/raclen/raclen.github.io/issues/8)**

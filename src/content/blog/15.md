---
title: "jQuery 获取 iframe 父页面与子页面的元素和方法"
description: ">  在页面中查找 iframe 页面元素： $(‘#iframe’).contents().find(‘#id’)  在 iframe 中查找父页面元素： $(‘#id’, parent.document)  在 iframe 中调用父页面中定义的方法和变量： parent.method pare..."
pubDate: 2014-06-06T08:57:07.000Z
issueNumber: 15
issueUrl: https://github.com/raclen/zone/issues/15
tags: ["legacy", "JavaScript", "CSS", "前端", "HTML"]
author:
  name: "raclen"
  avatar: "https://avatars.githubusercontent.com/u/7697758?v=4"
draft: false
---


>  在页面中查找 iframe 页面元素：
$(‘#iframe’).contents().find(‘#id’)
 在 iframe 中查找父页面元素：
$(‘#id’, parent.document)
 在 iframe 中调用父页面中定义的方法和变量：
parent.method
parent.value

父页面
```javascript
<div id="div">div element</div>
<iframe id="iframe" src="page.html" frameborder="0"></iframe>
<script src="http://code.jquery.com/jquery-latest.min.js"></script>
<script>
$(function ($) {
    //在页面中查找 iframe 页面元素
    var p = $('#iframe').contents().find('#p').text();
    alert(p);
});
//自定义变量
var hello = 'hello';
//自定义方法
function getHelloWorld() {
    alert('hello world');
}
</script>
```
子页面
```javascript
<p id="p">p element</p>
<script src="http://code.jquery.com/jquery-latest.min.js"></script>
<script>
$(function ($) {
    //在 iframe 中查找父页面元素
    alert($('#div', parent.document).text());
    //在 iframe 中调用父页面中定义的方法
    parent.getHelloWorld();
    //在 iframe 中调用父页面中定义的变量
    alert(parent.hello);
});
</script>
```
【iframe全局跳转】从iframe中跳转，覆盖整个页面
```javascript
<a href="logout.html" target="_parent">退出系统</a>  
```


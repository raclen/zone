---
title: "chrome插件double-search"
description: "double-search 让你一次回车多个结果，支持个性定制自己的搜索习惯，目前支持Google，百度，搜狗，知乎，必应，默认是Google和百度 使用方法，打开谷歌浏览器，地址栏chrome://extensions/回车，double-search.crx文件拖进去 最新插件下载地址  下面这..."
pubDate: 2016-04-29T10:11:00.000Z
issueNumber: 84
issueUrl: https://github.com/raclen/zone/issues/84
tags: ["legacy", "JavaScript"]
author:
  name: "raclen"
  avatar: "https://avatars.githubusercontent.com/u/7697758?v=4"
draft: false
---


![](https://raw.githubusercontent.com/raclen/raclen.github.io/master/blog-assets/google%E6%8F%92%E4%BB%B6double-search/search.gif)
double-search 让你一次回车多个结果，支持个性定制自己的搜索习惯，目前支持Google，百度，搜狗，知乎，必应，默认是Google和百度
![](https://raw.githubusercontent.com/raclen/raclen.github.io/master/blog-assets/google%E6%8F%92%E4%BB%B6double-search/18-14-16.jpg)
使用方法，打开谷歌浏览器，地址栏chrome://extensions/回车，double-search.crx文件拖进去
最新插件下载地址 [double-search.crx](http://raclen.win/down/double-search.crx)

下面这个例子用来发起一个xmlHttpRequest请求
```javaacript
var QbUrl = 'https://www.g-banker.com/price/query';
var QbXhr;
function requestData3() {
    console.log('QbXhr')
    QbXhr.open('POST', QbUrl, true);
    QbXhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    QbXhr.send('queryFlag=3');
}
function setupXHR() {
 
    //黄金钱包的实时价格
    QbXhr = new XMLHttpRequest();
    QbXhr.onreadystatechange = function() {
        if (QbXhr.readyState === 4) {
            //success
            if (QbXhr.status === 200) {
                handleQbResponse(QbXhr.response);
            } else {
                console.error(QbXhr.status);
            }
        }
    }
    ;
    QbXhr.onerror = function(e) {
        console.error(QbXhr.statusText);
    }
    ;
    requestData3();
}
window.onload = function(){
    setupXHR();
}

//获取黄金钱包的数据
function handleQbResponse(res){
    res = JSON.parse(res);
    var realtime_price ='';
    if(res.success==='true'){
        realtime_price= (res.data.realtime_price/100).toFixed(2)
    }
    console.log(realtime_price);


}
```
上述方式不太好 ，推荐使用fetch
```javascript
  fetch(QbUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: parm
    }).then(function (res) {
        if (res.ok) {
            res.json().then(function (data) {
                callback && callback(data);
            });
        }

    }, function (e) {
        alert("Error submitting form!");
    });
```

### 扩展阅读
[Chrome扩展及应用开发（首发版）](http://www.ituring.com.cn/book/1421)
[360浏览器插件开发文档](http://open.chrome.360.cn/extension_dev/overview.html)


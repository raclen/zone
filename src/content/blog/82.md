---
title: "IE上实现placeholder"
description: "从我开始写前端placeholder一直都没出过兼容性。 13年开始写微信内嵌页面，14年初也是微信内嵌页面，后来做一些APP内嵌页面和一些手机浏览器支持页面。在大家都做移动端的时候，我又开始了PC端 placeholder在IE7/8/9都不支持，找到这个，为了满足业务需求，我稍微修改了一下。"
pubDate: 2016-04-15T10:27:00.000Z
issueNumber: 82
issueUrl: https://github.com/raclen/zone/issues/82
tags: ["legacy", "JavaScript", "前端", "HTML"]
author:
  name: "raclen"
  avatar: "https://avatars.githubusercontent.com/u/7697758?v=4"
draft: false
---


从我开始写前端placeholder一直都没出过兼容性。
13年开始写微信内嵌页面，14年初也是微信内嵌页面，后来做一些APP内嵌页面和一些手机浏览器支持页面。在大家都做移动端的时候，我又开始了PC端
placeholder在IE7/8/9都不支持，找到这个[插件](http://riny.net/lab/jquery/myPlaceholder.html)，为了满足业务需求，我稍微修改了一下。
```javascript
//一点点样式
   .placeholder {
        display: inline-block;
        position: absolute;
        zoom: 1;
        color: #c0c0c0;
        height: 28px;
        line-height: 28px;
        padding: 0px 5px;
        _padding: 2px 5px;
    }

    .placeholder-hide {
        display: none;
    }

//js
$.fn.extend({
        myPlaceholder: function() {
            if (!('placeholder' in document.createElement('input'))) { //测试浏览器是否支持placeholder属性
                return this.each(function() {
                    var that = $(this);
                    if(that.attr('fixplaceholder')){
                        return;
                    }
                    var placeholderTxt = that.attr('placeholder');
                    that.attr('fixplaceholder',true);
                    /* 创建span */
                    var _span = $('<span>');
                    _span.attr('class', 'placeholder');
                    _span.text(placeholderTxt);
                    that.before(_span);
                    if (that.val()) {
                        _span.addClass('placeholder-hide');
                    }
                    /* 绑定事件 */
                    _span.bind('focus', function() {
                        _span.addClass('placeholder-hide');
                        that.focus();
                    });
                    that.on('focus', function() {
                        _span.addClass('placeholder-hide');
                    }).on('blur', function() {
                        if (!that.val().length) {
                            _span.removeClass('placeholder-hide');
                        }
                    }).on('change',function(){
                        if (!!that.val().length) {
                            _span.addClass('placeholder-hide');
                        }else{
                            _span.removeClass('placeholder-hide');
                        }
                    });
                });
            }
        }
    })
    //$('input').myPlaceholder();
```


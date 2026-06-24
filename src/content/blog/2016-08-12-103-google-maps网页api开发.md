---
title: "google-maps网页api开发"
description: "通过下面几个例子，一起走进google maps 网页api开发 PS：我查了下V3的api有的说需要key,有的说不需要key，根据文档貌似是需要key的，但是我们公司的的确没用key（然后访问量起来就挂了)。。，以下的预览地址（服务端环境）会提示需要key，拷贝下来本地运行都是可以的 测试数据坐..."
pubDate: 2016-08-12T12:13:00.000Z
issueNumber: 103
issueUrl: https://github.com/raclen/zone/issues/103
tags: ["legacy", "网络"]
author:
  name: "raclen"
  avatar: "https://avatars.githubusercontent.com/u/7697758?v=4"
draft: false
---


通过下面几个例子，一起走进google maps 网页api开发
PS：我查了下V3的api有的说需要key,有的说不需要key，根据文档貌似是需要key的，但是我们公司的的确没用key（然后访问量起来就挂了)。。，以下的预览地址（服务端环境）会提示需要key，拷贝下来本地运行都是可以的

![](https://raw.githubusercontent.com/raclen/raclen.github.io/master/blog-assets/google-maps%E7%BD%91%E9%A1%B5api%E5%BC%80%E5%8F%91/cute.gif)
测试数据坐标是我随便写的，不必纠结北京香山公园怎么定位到上海了
### 0-初始化一个地图
```javascript
// initMap就是加载后的回调函数
    // 注意和echart一样mainMapLayer需要给宽度和高度地图才能显示出来
        function initMap() {
            console.log('common in initMap');
            var myOptions = {
                zoom: 11,
                center: new google.maps.LatLng(31.22171, 121.352856),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(document.getElementById("mainMapLayer"), myOptions);
        }
    //PS:谷歌地图这个地址在北京，国内可以正常使用http://ditu.google.cn/maps/api/js
```
预览地址 ：[点击访问](http://raclen.github.io/demo/maps-%E5%9C%B0%E5%9B%BE/google-maps/0-%E5%88%9D%E5%A7%8B%E5%8C%96%E4%B8%80%E4%B8%AA%E5%9C%B0%E5%9B%BE.html)
### 1-添加标记
```javascript
    var myCenter=new google.maps.LatLng(31.22171, 121.352856);

            var myOptions = {
                zoom: 11,
                center: myCenter,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(document.getElementById("mainMapLayer"), myOptions);

            var marker=new google.maps.Marker({
                position: new google.maps.LatLng(31.22171, 121.30),
                map: map,
                title:"Hello google Map!"
              });
```
预览地址：[点击访问](http://raclen.github.io/demo/maps-%E5%9C%B0%E5%9B%BE/google-maps/1-%E6%B7%BB%E5%8A%A0%E6%A0%87%E8%AE%B0.html)
### 1.1-添加多个标记
```javascript
var myCenter = new google.maps.LatLng(31.22171, 121.352856);

            var myOptions = {
                zoom: 11,
                center: myCenter,
                // mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(document.getElementById("mainMapLayer"), myOptions);
            //地图的标记和地图中心不能太远，否则会看不到
            // var marker = new google.maps.Marker({
            //     position: new google.maps.LatLng(31.22171, 121.30),
            //     map: map,
            //     title: "Hello google Map!"
            // });
            var markers=[];
            var neighborhoods = [{
                lat: 31.22071,
                lng: 121.302800
            }, {
                lat: 31.22111,
                lng: 121.352001
            }, {
                lat: 31.22371,
                lng: 121.392100
            }, {
                lat: 31.22571,
                lng: 121.372856
            }, ];

            for (var i = 0; i < neighborhoods.length; i++) {
                addMarkerWithTimeout(neighborhoods[i], i * 500);
            }

            function addMarkerWithTimeout(position, timeout) {
                window.setTimeout(function() {
                    markers.push(new google.maps.Marker({
                        position: position,
                        map: map,
                        animation: google.maps.Animation.DROP
                    }));
                }, timeout);
            }
```
预览地址：[点击访问](http://raclen.github.io/demo/maps-%E5%9C%B0%E5%9B%BE/google-maps/1.1-%E6%B7%BB%E5%8A%A0%E5%A4%9A%E4%B8%AA%E6%A0%87%E8%AE%B0.html)
### 2-添加信息框
```javascript
var myCenter = new google.maps.LatLng(31.22171, 121.352856);

            var myOptions = {
                zoom: 11,
                center: myCenter,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(document.getElementById("mainMapLayer"), myOptions);

            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(31.22171, 121.30),
                map: map,
                title: "Hello google Map!"
            });
            var contentString = '<div id="content">' +
                '<div id="siteNotice">' +
                '</div>' +
                '<div id="bodyContent">' +
                '<p>我是支持HTML的提示框 </p>' +
                '<input type="button" value="查看路线">' +
                '</div>' +
                '</div>';
            var infowindow = new google.maps.InfoWindow({
                content: contentString
            });
            marker.addListener('click', function() {
                infowindow.open(map, marker);
              });
```
预览地址：[点击访问](http://raclen.github.io/demo/maps-%E5%9C%B0%E5%9B%BE/google-maps/2-%E6%B7%BB%E5%8A%A0%E4%BF%A1%E6%81%AF%E6%A1%86.html)
### 2.1-添加多个信息框
```javascript
var myCenter = new google.maps.LatLng(31.22171, 121.352856);

            var myOptions = {
                zoom: 11,
                center: myCenter,
                // mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(document.getElementById("mainMapLayer"), myOptions);

            var neighborhoods = [{
                lat: 31.22071,
                lng: 121.302800,
                title:"上海迪士尼",
                content :"中国上海市黄浦区方浜中路280号。"
            }, {
                lat: 31.22111,
                lng: 121.352001,
                title:"东京迪士尼乐园",
                content :"日本千叶县浦安市舞浜1-1号。"
            }, {
                lat: 31.22371,
                lng: 121.392100,
                title:"北京香山公园",
                content :"北京市海淀区买卖街40号。"
            }, {
                lat: 31.22571,
                lng: 121.372856,
                title:"襄阳古隆中",
                content :"湖北省襄阳市襄城区001县道隆中路6号。"
            } ];

            for (var i = 0; i < neighborhoods.length; i++) {
                addMarkerWithTimeout(neighborhoods[i]);
            }

            function addMarkerWithTimeout(position) {
                markers.push(new google.maps.Marker({
                    position: position,
                    map: map,
                    title:"hello google map"
                }));

            }
            var contentString = '<div id="content">' +
                '<div id="siteNotice">{{title}}</div>' +
                '<div id="bodyContent">' +
                '<p>{{content}} </p>' +
                '<input type="button" value="查看路线">' +
                '</div>' +
                '</div>';
            var infowindow = new google.maps.InfoWindow({
                content: contentString
            });
            var j = 0;
            for (j = 0; j < markers.length; j++) {
                markers[j].index = j;
                google.maps.event.addListener(markers[j], 'click', function() {
                    var that = this;
                    infowindow.setContent(htmlTpl(contentString,neighborhoods[that.index]));
                    infowindow.open(map, that);
                });
            }


        }
        function htmlTpl(tpl, data) {
            return tpl.replace(/{{(\w+)}}/g, function() {
                return data[arguments[1]];
            });

```
预览地址：[点击访问](http://raclen.github.io/demo/maps-%E5%9C%B0%E5%9B%BE/google-maps/2.1-%E6%B7%BB%E5%8A%A0%E5%A4%9A%E4%B8%AA%E4%BF%A1%E6%81%AF%E6%A1%86.html)
### 3-路线导航
```javascript
var directionsService = new google.maps.DirectionsService();//service用来请求导航数据

            var directionsDisplay;
            directionsDisplay = new google.maps.DirectionsRenderer();//渲染导航数据
            directionsDisplay.setMap(map);
            directionsDisplay.setPanel(document.getElementById("direction-panel"));

            //出行方式选择
            var aRouteWay = document.querySelectorAll('.route_way')[0];
            var aAWay = aRouteWay.querySelectorAll('a');
            aAWay.forEach(function(item){
                item.addEventListener('click',function(){
                    aAWay.forEach(function(item2){
                        item2.className="";
                    })
                    this.className="current";
                    var way = this.dataset.way.toUpperCase();
                    calcRoute(way);
                })
            })
            function calcRoute(way) {
              var start = document.getElementById('start_point').value;
              var end = document.getElementById('end_point').value;
              var request = {
                origin: start,
                destination: end,
                travelMode: google.maps.DirectionsTravelMode[way]
              };
              directionsService.route(request, function(response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                  directionsDisplay.setDirections(response);
                }
              });
            }
```
预览地址 ：[点击访问](http://raclen.github.io/demo/maps-%E5%9C%B0%E5%9B%BE/google-maps/3-%E8%B7%AF%E7%BA%BF%E5%AF%BC%E8%88%AA.html)
### 3.1-多标记路线导航
代码太长，我就直接放地址吧
预览地址：[点击访问](http://raclen.github.io/demo/maps-%E5%9C%B0%E5%9B%BE/google-maps/3.1-%E5%A4%9A%E6%A0%87%E8%AE%B0%E8%B7%AF%E7%BA%BF%E5%AF%BC%E8%88%AA.html)
### 3.2-多标记和路线导航分离
预览地址：[点击访问](http://raclen.github.io/demo/maps-%E5%9C%B0%E5%9B%BE/google-maps/3.2-%E5%A4%9A%E6%A0%87%E8%AE%B0%E5%92%8C%E8%B7%AF%E7%BA%BF%E5%AF%BC%E8%88%AA%E5%88%86%E7%A6%BB.html)
### 相关链接
[google maps 文档地址](https://developers.google.com/maps/documentation/javascript/tutorial?hl=zh-cn)


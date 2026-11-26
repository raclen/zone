---
title: "antd 实现keep alive"
description: "背景：后台项目需要切换路由的时候保存用户数据 给它们提了issues，官方不考虑加上 就琢磨着怎么实现 antd pro项目 gitbub找了个钩子 找到这个文件 BasicLayout.js 修改为 ScrollToTop.js 切换的时候定位到顶部"
pubDate: 2018-12-06T08:12:00.000Z
issueNumber: 111
issueUrl: https://github.com/raclen/zone/issues/111
tags: ["legacy", "JavaScript", "前端", "React"]
author:
  name: "raclen"
  avatar: "https://avatars.githubusercontent.com/u/7697758?v=4"
draft: false
---


背景：后台项目需要切换路由的时候保存用户数据
给它们提了issues，官方不考虑加上
[ant-design-pro 会考虑支持keep alive吗](https://github.com/ant-design/ant-design-pro/issues/2339)
就琢磨着怎么实现

antd pro项目
gitbub找了个钩子
```
npm install react-live-route --save-dev
```
找到这个文件
BasicLayout.js
```javascript
   {getRoutes(match.path, routerData).map(item => (
                    <AuthorizedRoute
                        key={item.key}
                        path={item.path}
                        component={item.component}
                        exact={item.exact}
                        authority={item.authority}
                        redirectPath="/exception/403"
                    />
                ))}
```
修改为
```javascript
<ScrollToTop>
                {getRoutes(match.path, routerData).map((item, index) => {
                  return (<LiveRoute path={item.path} key={index} alwaysLive={needAlwaysLive} component={item.component} />)
                })}
</ScrollToTop>
```
ScrollToTop.js
切换的时候定位到顶部
```javascript
import { withRouter} from 'dva/router';
import React, { Component } from 'react';
class ScrollToTop extends Component {
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0)
    }
  }

  render() {
    return this.props.children
  }
}

export default withRouter(ScrollToTop)
```


---
title: "Reqable将https请求转发到本地"
description: "工具 - 重写 - 重定向    参考 https://reqable.com/zh-CN/docs/capture/rewrite#redirect 微信小程序抓包   登录的时候选择127.0.0.1:9000  打开Reqable ，比如韭圈儿小程序的数据 通过脚本修改返回值  onReque..."
pubDate: 2025-02-18T08:51:35Z
issueNumber: 163
issueUrl: https://github.com/raclen/zone/issues/163
tags: ["网络", "工具"]
author:
  name: "raclen"
  avatar: "https://avatars.githubusercontent.com/u/7697758?v=4"
draft: false
---


工具 - 重写 - 重定向

![Image](https://github.com/user-attachments/assets/1ef7ed00-1445-44b4-9820-eb352c7f1a48)  

参考
https://reqable.com/zh-CN/docs/capture/rewrite#redirect

### 微信小程序抓包  
登录的时候选择127.0.0.1:9000 
打开Reqable ，比如韭圈儿小程序的数据

![Image](https://github.com/user-attachments/assets/290e0468-c831-4f9f-ae9a-9c68345deb08)


### 通过脚本修改返回值 
```python
# API Docs: https://reqable.com/docs/capture/addons

from reqable import *

def onRequest(context, request):
  # Print url to console
  # print('request url ' + context.url)

  # Update or add a query parameter
  # request.queries['foo'] = 'bar'

  # Update or add a http header
  # request.headers['foo'] = 'bar'

  # Replace http body with a text
  # request.body = 'Hello World'

  # Map with a local file
  # request.body.file('~/Desktop/body.json')

  # Convert to dict if the body is a JSON
  # request.body.jsonify()
  # Update the JSON content
  # request.body['foo'] = 'bar'

  # Done
  return request

def onResponse(context, response):
  # 将响应体字典化
  response.body.jsonify()
  # 修改字典中的version值
  response.body['listProviders'][0]['disabled'] = False
  # Update status code
  # response.code = 404

  # APIs are same as `onRequest`
  print(response.body)
  # Done
  return response


```
修改header
https://github.com/didierfred/SimpleModifyHeaders

![Image](https://github.com/user-attachments/assets/635c643f-8eb8-4315-aad5-3d2cb76978b0)

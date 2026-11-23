---
title: "没接码的 GPTFree 账号还能做什么？用 Magpie 插件实现 AI 生图"
description: "之前提到过 GPTFree 账号，这类账号通常没有完成手机号验证，也就是大家常说的「没接码账号」。 虽然功能可能受到一定限制，但并不代表完全没有使用价值。除了简单体验 ChatGPT 之外，还可以利用它来实现 AI 生图。 今天分享一个比较简单的玩法：通过 Magpie 安装 GPTFree 插件，..."
pubDate: 2026-11-22T13:43:56Z
updatedDate: 2026-11-22T13:43:56Z
issueNumber: 200
issueUrl: https://github.com/raclen/zone/issues/200
tags: []
author:
  name: "raclen"
  avatar: "https://avatars.githubusercontent.com/u/7697758?v=4"
draft: false
---

之前提到过 GPTFree 账号，这类账号通常没有完成手机号验证，也就是大家常说的「没接码账号」。

虽然功能可能受到一定限制，但并不代表完全没有使用价值。除了简单体验 ChatGPT 之外，还可以利用它来实现 AI 生图。

今天分享一个比较简单的玩法：通过 Magpie 安装 GPTFree 插件，将购买的账号导入号池，然后利用这些账号进行 AI 图片生成。

## 一、准备工作

首先需要准备两个东西：

**1. GPTFree 账号**

账号可以从卡网购买：

- 购买地址：https://priceai.cc/
- 参考价格：3 毛钱可以买 10 个，也可以尝试 0 元购买 1 个。

价格以网站实际显示为准。

**2. Magpie 客户端**

提前安装好 Magpie，并确保客户端能够正常运行。

## 二、安装 GPTFree 插件

打开 Magpie 客户端，按照下面的步骤操作：

1. 打开 Magpie。
2. 点击顶部的「插件」。
3. 切换到「发现」页面。
4. 在页面最底部找到仓库地址输入框。
5. 粘贴下面的 GitHub 仓库地址：

```text
https://github.com/yang0/magpie-gptfree
```

6. 点击导入，等待插件安装完成。

插件安装完成后，就可以在 Magpie 中使用 GPTFree 号池功能了。

## 三、导入 GPTFree 账号

安装插件后，点击左侧的「GPT号池」，进入自己的账号池管理页面。

在账号列表文本框中，填入之前购买的卡密。

<img width="1157" height="783" alt="image" src="https://github.com/user-attachments/assets/8a67b86c-b315-45ef-b833-1a53fd26d8ed" />

填写完成后，根据插件页面提示完成导入即可。

<img width="865" height="652" alt="image" src="https://github.com/user-attachments/assets/fba945cf-c681-43e1-b619-4d82585f01f2" />

导入成功后，在magpie中把生图模型设置为GPT Image 2.6，我用的claude，随便选模型，对话框让画图的时候他就会自动调用这个模型

<img width="906" height="87" alt="image" src="https://github.com/user-attachments/assets/2ad96694-b35d-4ac9-827e-a14b0d4305f8" />

## 四、可以用来做什么？

对于没有完成手机号验证的 GPTFree 账号，具体可用功能可能受到账号状态、平台策略以及插件版本影响。

这里主要介绍 AI 生图这个用途。

相比单独购买 AI 生图服务，利用现有账号资源，可以低成本体验图片生成能力。不过，实际能否使用以及图片生成的额度，需要以当前账号和插件的实际情况为准。

## 五、注意事项

1. **账号稳定性：** GPTFree 账号可能存在失效、登录异常等情况，不建议将其作为长期稳定的生产力工具。
2. **账号安全：** 不要在账号中存放个人隐私、重要文件或敏感信息。
3. **插件来源：** 建议从 GitHub 原仓库获取插件，安装前检查代码和更新记录。
4. **平台规则：** 使用过程中注意遵守相关服务条款，不要利用账号池进行违规操作。

## 最后

没接码的 GPTFree 账号并不是完全没有价值。

通过 Magpie 的 GPTFree 插件，可以把多个账号集中管理，进一步探索 AI 生图等功能。

如果手头有闲置账号，不妨尝试一下这个玩法。成本不高，也算是给这些账号找到了一个新的用途。

---
title: "oracle vps安装1panal"
description: "安装的时候可能遇到安装完了，但是没办法访问的问题 第一次申请，先去换个IP Oracle Cloud 控制台 → Compute → Instances（实例） → 你的机器 → Networking（网络） 然后： 找到 Attached VNICs（附加的 VNIC） 点击主 VNIC 进入 I..."
pubDate: 2026-06-27T01:40:03Z
updatedDate: 2026-09-05T12:25:04Z
issueNumber: 180
issueUrl: https://github.com/raclen/zone/issues/180
tags: ["服务器"]
author:
  name: "raclen"
  avatar: "https://avatars.githubusercontent.com/u/7697758?v=4"
draft: false
---

安装的时候可能遇到安装完了，但是没办法访问的问题

### 第一次申请，先去换个IP
Oracle Cloud 控制台 → Compute → Instances（实例） → 你的机器 → Networking（网络）

然后：

找到 Attached VNICs（附加的 VNIC）
点击主 VNIC
进入 IP administration / IP Addresses
找到主 Private IP
点击右边 ⋮ → Edit
将 Public IP 改成：

No public IP

点击 Update
等旧公网 IP 删除后，再次点击 Edit
选择：

Ephemeral public IP

点击 Update
### 防火墙按安全管理配置

### 开放端口 
```
sudo iptables -P INPUT ACCEPT
sudo iptables -P FORWARD ACCEPT
sudo iptables -P OUTPUT ACCEPT
sudo iptables -F
```
### 一键安装
```
curl -sSL https://resource.1panel.pro/quick_start.sh -o quick_start.sh && bash quick_start.sh
```


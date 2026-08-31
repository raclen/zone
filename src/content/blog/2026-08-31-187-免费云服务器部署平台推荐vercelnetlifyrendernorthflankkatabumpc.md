---
title: "免费云服务器/部署平台推荐：Vercel、Netlify、Render、Northflank、KataBump、Cloudflare 全面对比"
description: "<html> <body> <!--StartFragment--><html><head></head><body><p>现在部署一个个人网站、博客、API、Docker 项目、定时任务，已经不一定需要购买一台 VPS。</p><p>以前的思路通常是：</p><blockquote><p>买一台云..."
pubDate: 2026-08-31T01:34:43Z
updatedDate: 2026-08-31T01:35:56Z
issueNumber: 187
issueUrl: https://github.com/raclen/zone/issues/187
tags: ["服务器"]
author:
  name: "raclen"
  avatar: "https://avatars.githubusercontent.com/u/7697758?v=4"
draft: false
---

<html>
<body>
<!--StartFragment--><html><head></head><body><p>现在部署一个个人网站、博客、API、Docker 项目、定时任务，已经不一定需要购买一台 VPS。</p><p>以前的思路通常是：</p><blockquote><p>买一台云服务器 → 安装 Ubuntu → 配置 Docker/Nginx → 配置 SSL → 部署程序 → 配置监控。</p></blockquote><p>现在则可以直接使用各种免费的云平台：</p><ul><li><p>Vercel</p></li><li><p>Netlify</p></li><li><p>Cloudflare</p></li><li><p>Render</p></li><li><p>Northflank</p></li><li><p>KataBump</p></li></ul><p>这些平台的共同特点都是：<strong>可以低成本甚至免费部署项目，而且不需要自己维护服务器。</strong></p><p>但它们其实并不是一类产品。</p><p>有的平台非常适合 Next.js，有的平台适合 Docker，有的平台适合长期运行 Node.js/Python 程序，还有的平台更适合 Serverless。</p><p>因此，本文不单纯比较“谁的免费额度最大”，而是从实际部署需求出发，看看这些平台分别适合什么。</p><hr><h1>一、先说结论</h1><p>如果不想看完整文章，可以直接看下面这个结论。</p>

平台 | 更适合什么 | 免费体验 | 长期运行 | Docker | Next.js | Go | 定时任务
-- | -- | -- | -- | -- | -- | -- | --
Vercel | Next.js/前端网站 | ★★★★★ | ★★★ | ★ | ★★★★★ | ★★ | ★★★
Netlify | 静态站/前端/函数 | ★★★★★ | ★★★ | ★ | ★★★★ | ★★ | ★★★
Cloudflare | CDN/Serverless/边缘计算 | ★★★★★ | ★★★★★ | ★★ | ★★★★ | ★★★ | ★★★★★
Render | API/后端/Docker | ★★★★ | ★★★ | ★★★★ | ★★★ | ★★★★★ | ★★★★
Northflank | Docker/后端/容器 | ★★★★ | ★★★★ | ★★★★★ | ★★★ | ★★★★★ | ★★★★★
KataBump | Node.js/Python Bot/常驻程序 | ★★★★★ | ★★★★ | ★★★ | ★★ | ★ | ★★★★

<p>如果按照实际用途选择：</p><h3>Next.js 网站</h3><p><strong>首选 Vercel</strong></p><p>尤其是 Next.js 项目，Vercel 仍然是最省心的选择。</p><hr><h3>静态网站</h3><p><strong>Vercel / Netlify / Cloudflare Pages</strong></p><p>如果只是博客、文档、静态页面，三者都很好。</p><hr><h3>Go / Node.js / Python API</h3><p><strong>Render / Northflank</strong></p><p>这类项目需要真正运行后端进程，Render 和 Northflank 更合适。</p><hr><h3>Docker 项目</h3><p><strong>Northflank / Render</strong></p><p>如果项目本身就是 Docker 镜像，Northflank 会非常舒服。</p><hr><h3>需要长期运行的 Node.js / Python 程序</h3><p><strong>KataBump / Northflank</strong></p><p>尤其是 Discord Bot、WhatsApp Bot、Node.js/Python 常驻程序，KataBump 是一个比较特殊的选择。</p><hr><h3>定时任务</h3><p><strong>Cloudflare Workers Cron / Northflank Jobs / Render Cron</strong></p><p>如果只是简单的定时 HTTP 请求，Cloudflare 就很好用。</p><p>如果需要真正运行脚本或者 Docker，Northflank、Render 更合适。</p><hr><h1>二、首先要搞清楚：什么叫“免费云服务器”？</h1><p>很多人搜索“免费云服务器”时，会把这些平台全部放在一起比较。</p><p>实际上，它们至少可以分成三类。</p><h2>1. VPS / 虚拟机</h2><p>例如：</p><ul><li><p>Oracle Cloud</p></li><li><p>AWS EC2</p></li><li><p>Google Cloud Compute Engine</p></li><li><p>Azure VM</p></li></ul><p>这种才是真正意义上的“服务器”。</p><p>可以 SSH 登录：</p><pre><code class="language-text">Ubuntu
Docker
Nginx
MySQL
Redis
Go
Node.js
Python
Java
</code></pre><p>基本上想装什么就装什么。</p><p>缺点就是需要自己维护。</p><hr><h1>三、PaaS：Render、Northflank、KataBump</h1><p>PaaS 可以理解成：</p><blockquote><p>“服务器已经有人帮你管理好了，你只需要把程序交给它。”</p></blockquote><p>例如：</p><pre><code class="language-text">GitHub
   ↓
Render / Northflank
   ↓
自动构建
   ↓
自动部署
   ↓
程序运行
</code></pre><p>不需要自己配置 Ubuntu、Nginx、Docker 环境。</p><p>Render 和 Northflank 就属于这一类。</p><p>KataBump 则更加特殊，重点针对 Node.js/Python 应用以及 Bot 等长期运行程序。</p><hr><h1>四、Serverless：Vercel、Netlify、Cloudflare</h1><p>Serverless 的思路又不一样。</p><p>不是：</p><pre><code class="language-text">一台服务器
    ↓
一直运行你的程序
</code></pre><p>而是：</p><pre><code class="language-text">用户请求
    ↓
触发函数
    ↓
执行代码
    ↓
返回结果
</code></pre><p>因此 Serverless 非常适合：</p><ul><li><p>API</p></li><li><p>网站</p></li><li><p>Webhook</p></li><li><p>图片处理</p></li><li><p>简单后台</p></li><li><p>定时任务</p></li><li><p>边缘计算</p></li></ul><p>但不适合所有类型的程序。</p><p>例如一个需要：</p><pre><code class="language-text">while(true) {
    ...
}
</code></pre><p>长期运行的 Node.js 程序，就不适合放在典型 Serverless 平台上。</p><hr><h1>五、Vercel：Next.js 网站的首选</h1><p>Vercel 是很多前端开发者最熟悉的平台。</p><p>它最大的优势不是“免费服务器”，而是：</p><blockquote><p><strong>Next.js + GitHub + Vercel 的部署体验非常好。</strong></p></blockquote><p>一个 Next.js 项目连接 GitHub 后，基本可以做到：</p><pre><code class="language-text">git push
    ↓
Vercel 自动构建
    ↓
自动部署
    ↓
自动生成 HTTPS
</code></pre><p>而且每次 Pull Request 都可以生成 Preview Deployment。</p><p>这对开发网站非常方便。</p><hr><h2>Vercel 最适合什么？</h2><p>最适合：</p><ul><li><p>Next.js</p></li><li><p>React</p></li><li><p>前端网站</p></li><li><p>博客</p></li><li><p>SaaS 前端</p></li><li><p>Serverless API</p></li><li><p>AI Web 应用</p></li></ul><p>例如：</p><pre><code class="language-text">Next.js
+
Vercel
+
Supabase
</code></pre><p>就是非常常见的一套组合。</p><p>Vercel 的 Hobby 免费计划可以用于个人项目和实验项目。公开资料也显示 Hobby 计划本身没有订阅费用；不过具体函数、计算资源和其他使用限制会随平台规则变化。</p><hr><h2>Vercel 的缺点</h2><p>Vercel 最大的问题是：</p><blockquote><p><strong>它不是传统 VPS。</strong></p></blockquote><p>不能把它理解成：</p><pre><code class="language-text">1 核 CPU
2 GB RAM
40 GB SSD
</code></pre><p>然后随便 SSH 进去运行 Docker。</p><p>如果项目需要：</p><ul><li><p>长时间运行进程</p></li><li><p>Docker Compose</p></li><li><p>Redis</p></li><li><p>MySQL</p></li><li><p>自定义后台服务</p></li><li><p>大量后台任务</p></li></ul><p>Vercel 就不是最合适的选择。</p><hr><h1>六、Netlify：Vercel 的另一种选择</h1><p>Netlify 和 Vercel 非常相似。</p><p>主要面向：</p><ul><li><p>静态网站</p></li><li><p>JAMstack</p></li><li><p>React</p></li><li><p>Vue</p></li><li><p>Next.js</p></li><li><p>Serverless Functions</p></li></ul><p>Netlify 的优势也是：</p><pre><code class="language-text">GitHub
 ↓
自动构建
 ↓
CDN
 ↓
HTTPS
</code></pre><p>目前 Netlify 的 Free 计划是 <strong>$0/月</strong>，采用 credit-based 计费方式，每月包含 <strong>300 credits</strong>。达到额度后，Free 项目会暂停到下一个计费周期。</p><hr><h2>Netlify 适合什么？</h2><p>例如：</p><pre><code class="language-text">Astro
Hugo
Vite
React
Vue
静态博客
文档网站
</code></pre><p>非常合适。</p><p>如果网站主要是静态内容，Netlify 和 Vercel 都非常舒服。</p><hr><h2>Netlify vs Vercel</h2><p>简单理解：</p><blockquote><p><strong>Next.js → 更偏向 Vercel</strong></p></blockquote><blockquote><p><strong>静态站/JAMstack → Vercel、Netlify 都可以</strong></p></blockquote><p>如果项目已经在 Vercel 上运行得很好，没有必要为了“免费”专门迁移到 Netlify。</p><hr><h1>七、Render：真正比较像“后端服务器”的免费平台</h1><p>Render 是我认为比较值得关注的一个平台。</p><p>它和 Vercel 最大的区别是：</p><blockquote><p>Render 对传统后端程序更加友好。</p></blockquote><p>Render 可以运行：</p><ul><li><p>Node.js</p></li><li><p>Python</p></li><li><p>Go</p></li><li><p>Ruby</p></li><li><p>Rust</p></li><li><p>Elixir</p></li><li><p>Docker</p></li></ul><p>官方文档也明确支持这些语言，并且可以通过 Docker 运行其他语言的应用。</p><hr><h2>Render 可以部署什么？</h2><p>例如一个 Go API：</p><pre><code class="language-text">main.go
    ↓
Render
    ↓
Go Server
    ↓
https://example.onrender.com
</code></pre><p>也可以：</p><pre><code class="language-text">Dockerfile
    ↓
Render
    ↓
Docker Container
</code></pre><p>这就比 Vercel 更接近传统服务器。</p><hr><h1>八、Render 免费版有什么限制？</h1><p>Render 目前仍然提供 Free 实例。</p><p>免费 Web Service 的资源规格是：</p><pre><code class="language-text">0.1 CPU
512 MB RAM
</code></pre><p>每个 Workspace 每月提供 <strong>750 小时 Free instance hours</strong>。免费 Web Service 在闲置后会进入休眠，收到请求后再启动。免费 PostgreSQL 数据库还有 30 天生命周期限制，因此官方明确不建议把 Free 实例用于生产环境。</p><p>所以 Render 免费版更适合：</p><ul><li><p>学习</p></li><li><p>Demo</p></li><li><p>API</p></li><li><p>小型项目</p></li><li><p>测试 Docker</p></li><li><p>个人项目</p></li></ul><p>而不是：</p><blockquote><p>一个必须全年 24×7 稳定运行的核心生产服务。</p></blockquote><hr><h1>九、Northflank：被低估的 Docker/PaaS 平台</h1><p>如果说：</p><blockquote><p>Vercel 是前端开发者喜欢的平台</p></blockquote><p>那么：</p><blockquote><p><strong>Northflank 更像是后端、Docker、DevOps 开发者喜欢的平台。</strong></p></blockquote><p>Northflank 的核心特点就是：</p><pre><code class="language-text">GitHub
Docker
Container
Database
Cron Job
Pipeline
Logs
Secrets
</code></pre><p>全部放到一个平台里。</p><p>官方目前提供 Developer Sandbox 免费层，包括 <strong>2 个免费 services、2 个免费 jobs、1 个免费 addon</strong>，同时支持免费体验数据库等能力；不过创建资源需要绑定支付方式进行身份验证。</p><hr><h1>十、Northflank 最大的优势：Docker</h1><p>例如项目有：</p><pre><code class="language-dockerfile">FROM golang:1.24

WORKDIR /app

COPY . .

RUN go build -o server

CMD ["./server"]
</code></pre><p>直接交给 Northflank。</p><p>或者：</p><pre><code class="language-text">GitHub
 ↓
Docker Build
 ↓
Container
 ↓
Northflank
</code></pre><p>这种体验非常适合后端项目。</p><hr><h2>Northflank 还能干什么？</h2><p>它不只是 Web Service。</p><p>还可以做：</p><h3>Web Service</h3><p>运行网站/API。</p><h3>Worker</h3><p>后台长期运行任务。</p><h3>Job</h3><p>执行一次性任务。</p><h3>Cron Job</h3><p>定时运行任务。</p><h3>Database</h3><p>运行数据库相关服务。</p><p>因此，如果一个项目架构是：</p><pre><code class="language-text">Next.js
   ↓
API
   ↓
Worker
   ↓
Database
   ↓
Cron
</code></pre><p>Northflank 可以把这些东西集中管理。</p><hr><h1>十一、KataBump：一个非常特殊的免费平台</h1><p>KataBump 和 Vercel、Render 最大的区别是：</p><blockquote><p><strong>它最初就是围绕 Discord Bot 等长期运行程序发展起来的。</strong></p></blockquote><p>目前官方主要支持：</p><ul><li><p>Node.js</p></li><li><p>Python</p></li></ul><p>并且提供：</p><ul><li><p>24/7 运行</p></li><li><p>SFTP</p></li><li><p>环境变量</p></li><li><p>日志</p></li><li><p>GitHub 部署</p></li><li><p>Bot Hosting</p></li><li><p>DDoS 防护</p></li></ul><p>官方目前的 Free 计划是：</p><pre><code class="language-text">RAM：308 MB
磁盘：716 MB
CPU：25%
价格：0€
续期：每 4 天
</code></pre><p>而且免费计划不需要信用卡。</p><hr><h1>十二、KataBump 最大的问题：资源非常小</h1><p>308 MB RAM 其实非常小。</p><p>因此不要把它想象成：</p><pre><code class="language-text">免费 VPS
</code></pre><p>更准确的理解是：</p><pre><code class="language-text">免费 Node.js / Python 常驻程序托管
</code></pre><p>例如：</p><pre><code class="language-text">Discord Bot
Telegram Bot
WhatsApp Bot
小型 Node.js 程序
小型 Python 程序
</code></pre><p>这类程序非常适合。</p><p>KataBump 官方目前也明确将 Discord Bot、WhatsApp Bot、Node.js/Python 应用作为主要使用场景。</p><hr><h1>十三、KataBump 最大的特色：免费服务器需要定期续期</h1><p>这是很多人第一次使用时最容易忽略的地方。</p><p>Free：</p><pre><code class="language-text">每 4 天续期
</code></pre><p>如果忘记续期，服务器可能会停止运行。</p><p>这意味着它虽然“永久免费”，但并不是：</p><blockquote><p>创建一次，然后永远不用管。</p></blockquote><p>所以它非常适合：</p><pre><code class="language-text">低成本 Bot
实验项目
个人脚本
长期运行的小程序
</code></pre><p>但不适合作为特别重要的生产服务。</p><hr><h1>十四、Cloudflare：其实和前面几个不是一个东西</h1><p>Cloudflare 经常被拿来和 Vercel 比较。</p><p>但严格来说，两者的定位不同。</p><p>Cloudflare 的核心能力包括：</p><pre><code class="language-text">DNS
CDN
DDoS 防护
WAF
Workers
Pages
KV
R2
Durable Objects
Cron
</code></pre><p>其中最值得关注的是：</p><blockquote><p><strong>Cloudflare Workers</strong></p></blockquote><p>它是一种边缘 Serverless 运行环境。</p><p>目前 Workers Free 计划包含：</p><pre><code class="language-text">100,000 requests / day
</code></pre><p>每次请求有 CPU 时间限制。Cloudflare 官方当前文档列出的 Free 计划为每天 10 万请求、每次调用 10ms CPU 时间。</p><hr><h1>十五、Cloudflare 为什么特别适合小型 API？</h1><p>例如：</p><pre><code class="language-text">GET /api/price
</code></pre><p>可以直接：</p><pre><code class="language-text">浏览器
   ↓
Cloudflare Worker
   ↓
第三方 API
   ↓
返回 JSON
</code></pre><p>甚至不需要购买 VPS。</p><p>再配合：</p><pre><code class="language-text">Cloudflare KV
R2
D1
Cron
</code></pre><p>就可以构建一个相当完整的小型后端。</p><hr><h1>十六、Cloudflare Cron 也非常有用</h1><p>比如每天：</p><pre><code class="language-text">09:00
 ↓
Worker
 ↓
获取 ETF 数据
 ↓
计算
 ↓
保存数据库
</code></pre><p>或者：</p><pre><code class="language-text">每小时
 ↓
请求某个 API
 ↓
检查数据
 ↓
发送通知
</code></pre><p>这类任务非常适合 Cloudflare Workers + Cron。</p><p>因此：</p><blockquote><p><strong>如果只是“定时执行一段代码”，没必要为了这个专门买 VPS。</strong></p></blockquote><hr><h1>十七、六个平台应该怎么选？</h1><p>可以用下面这个思路。</p><h2>需求一：Next.js 网站</h2><p>选择：</p><blockquote><p><strong>Vercel</strong></p></blockquote><p>例如：</p><pre><code class="language-text">Next.js
React
Tailwind
Ant Design
</code></pre><p>直接 Vercel。</p><hr><h2>需求二：静态博客</h2><p>选择：</p><blockquote><p><strong>Cloudflare Pages / Netlify / Vercel</strong></p></blockquote><p>如果是：</p><pre><code class="language-text">Astro
Hugo
Hexo
纯 HTML
</code></pre><p>基本都可以。</p><hr><h2>需求三：Go API</h2><p>选择：</p><blockquote><p><strong>Render / Northflank</strong></p></blockquote><p>例如：</p><pre><code class="language-text">Go
Gin
Echo
Fiber
</code></pre><p>需要长期运行后端服务，就不要优先考虑 Vercel。</p><hr><h2>需求四：Docker</h2><p>选择：</p><blockquote><p><strong>Northflank / Render</strong></p></blockquote><p>尤其是：</p><pre><code class="language-text">Dockerfile
docker-compose
后台 Worker
Cron Job
</code></pre><p>Northflank 的优势会比较明显。</p><hr><h2>需求五：Discord Bot</h2><p>选择：</p><blockquote><p><strong>KataBump</strong></p></blockquote><p>特别是：</p><pre><code class="language-text">Node.js
Python
Discord.js
discord.py
</code></pre><p>KataBump 的定位非常匹配。</p><hr><h2>需求六：定时脚本</h2><p>如果只是：</p><pre><code class="language-text">每天执行一次
每小时执行一次
</code></pre><p>优先考虑：</p><blockquote><p><strong>Cloudflare Workers Cron</strong></p></blockquote><p>如果需要：</p><pre><code class="language-text">Docker
Go
Python
Node.js
复杂运行环境
</code></pre><p>考虑：</p><blockquote><p><strong>Northflank / Render</strong></p></blockquote><hr><h1>十八、免费平台并不是越多越好</h1><p>很多人会陷入一个误区：</p><blockquote><p>“这个平台免费，我就注册一个。”</p></blockquote><p>最后可能变成：</p><pre><code class="language-text">Vercel
Netlify
Render
Northflank
Cloudflare
KataBump
Oracle
GitHub Actions
</code></pre><p>每个平台放一个东西。</p><p>这样虽然不用花钱，但是维护成本反而增加了。</p><p>更合理的方式是：</p><pre><code class="language-text">网站
 ↓
Vercel

API
 ↓
Northflank / Render

定时任务
 ↓
Cloudflare

Bot
 ↓
KataBump
</code></pre><p>根据项目类型选择平台。</p><hr><h1>十九、一个非常实用的免费架构</h1><p>如果做一个个人网站，例如：</p><pre><code class="language-text">Next.js
+
Go API
+
数据库
+
定时任务
</code></pre><p>完全可以考虑：</p><pre><code class="language-text">                 ┌── Vercel
                 │
用户 ────────────┤
                 │
                 └── Cloudflare
                       │
                       ├── DNS
                       ├── CDN
                       └── Cron
                       
Go API
  │
  └── Northflank / Render

Database
  │
  └── 独立数据库服务

Bot
  │
  └── KataBump
</code></pre><p>这样甚至不需要自己购买 VPS。</p><hr><h1>二十、如果已经有 VPS，还需要这些平台吗？</h1><p>需要。</p><p>因为 VPS 和 PaaS 的优势完全不同。</p><p>VPS：</p><blockquote><p>自由度最高。</p></blockquote><p>PaaS：</p><blockquote><p>维护成本最低。</p></blockquote><p>例如：</p><h3>VPS</h3><pre><code class="language-text">自己安装 Docker
自己配置 Nginx
自己申请 SSL
自己监控
自己更新系统
自己处理安全问题
</code></pre><h3>Vercel</h3><pre><code class="language-text">Git Push
 ↓
自动部署
</code></pre><p>所以：</p><blockquote><p><strong>不是 PaaS 能不能替代 VPS，而是不同项目应该选择不同的工具。</strong></p></blockquote><hr><h1>二十一、最终排名</h1><p>如果按照实际开发体验来排，而不是单纯比较免费额度，我会这样看。</p><h3>第一梯队：Vercel</h3><p><strong>最适合 Next.js。</strong></p><p>如果项目是 Next.js，通常没有太多理由折腾。</p><hr><h3>第一梯队：Cloudflare</h3><p><strong>免费基础设施非常强。</strong></p><p>尤其适合：</p><pre><code class="language-text">DNS
CDN
域名
反向代理
Workers
Cron
R2
</code></pre><p>它更像一个完整的互联网基础设施平台。</p><hr><h3>第一梯队：Northflank</h3><p><strong>Docker / 后端 / Jobs / Cron 非常强。</strong></p><p>如果喜欢 Docker，又不想自己维护 VPS，非常值得尝试。</p><hr><h3>第二梯队：Render</h3><p><strong>最容易理解的后端 PaaS 之一。</strong></p><p>对于：</p><pre><code class="language-text">Go
Node.js
Python
Docker
API
</code></pre><p>非常友好。</p><hr><h3>第二梯队：Netlify</h3><p><strong>静态网站和前端部署很好用。</strong></p><p>如果是纯前端或者静态博客，它完全够用。</p><hr><h3>特殊推荐：KataBump</h3><p>它不是 Vercel、Render 的直接竞争者。</p><p>但如果需求是：</p><pre><code class="language-text">Node.js
Python
Discord Bot
WhatsApp Bot
常驻进程
</code></pre><p>那么 KataBump 反而可能是这几个平台里最合适的。</p><p>不过一定要注意：</p><blockquote><p><strong>免费服务器只有 308 MB RAM、716 MB 磁盘，并且需要每 4 天续期。</strong></p></blockquote><hr><h1>二十二、最后的选择建议</h1><p>可以简单记成一句话：</p><pre><code class="language-text">Next.js
   → Vercel

静态网站
   → Cloudflare / Netlify / Vercel

Go / Node / Python API
   → Render / Northflank

Docker
   → Northflank / Render

定时任务
   → Cloudflare / Northflank / Render

Discord Bot
   → KataBump

真正需要完整 Linux 环境
   → VPS
</code></pre><p>所以所谓“免费云服务器”，其实已经不是以前那种：</p><blockquote><p>“找一台免费的 1 核 1G VPS。”</p></blockquote><p>现在更重要的是：</p><blockquote><p><strong>根据程序类型选择合适的免费云平台。</strong></p></blockquote><p>对于个人开发者来说，最实用的组合往往不是只选一个平台，而是：</p><p><strong>Vercel + Cloudflare + Northflank/Render + KataBump</strong></p><p>把不同类型的工作负载分别放到最适合的平台上。</p><p>这样既可以降低服务器成本，又可以减少自己维护 Linux、Docker、Nginx 等基础设施的时间。</p><hr><h2>附：本文涉及平台</h2><ul><li><p>Vercel：Next.js / 前端 / Serverless</p></li><li><p>Netlify：静态网站 / 前端 / Functions</p></li><li><p>Cloudflare：DNS / CDN / Workers / Cron / R2</p></li><li><p>Render：后端 / Docker / API / 数据库</p></li><li><p>Northflank：Docker / 后端 / Jobs / Cron / 数据库</p></li><li><p>KataBump：Node.js / Python / Discord Bot / 常驻程序</p></li></ul><p><strong>注意：免费额度、计费方式和限制都会调整。本文数据以 2026 年 8 月查询到的官方资料为准，实际使用前建议再次查看各平台官方价格页面。</strong></p></body></html><!--EndFragment-->
</body>
</html>

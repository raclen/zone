---
title: "如何在 Express 中集成 Apollo Server，并在前端执行 GraphQL 查询"
description: "<html> <body> <!--StartFragment--><html><head></head><body> <p>在现代 Web 开发中，<strong>GraphQL</strong> 已成为替代传统 REST API 的强大工具。<br> <strong>Apollo Server<..."
pubDate: 2025-02-08T03:05:43Z
issueNumber: 159
issueUrl: https://github.com/raclen/zone/issues/159
tags: ["Node.js", "nodejs", "服务器"]
author:
  name: "raclen"
  avatar: "https://avatars.githubusercontent.com/u/7697758?v=4"
draft: false
---


<html>
<body>
<!--StartFragment--><html><head></head><body>
<p>在现代 Web 开发中，<strong>GraphQL</strong> 已成为替代传统 REST API 的强大工具。<br>
<strong>Apollo Server</strong> 是最流行的 GraphQL 服务器框架之一，通常与 <strong>Express</strong> 结合使用。</p>
<p>本篇文章将详细讲解如何：<br>
✅ <strong>在 Express 中集成 Apollo Server</strong><br>
✅ <strong>使用多个 Express 中间件（CORS、Body Parser、日志记录）</strong><br>
✅ <strong>在前端执行 GraphQL 查询（Apollo Client &amp; Fetch API）</strong></p>
<p>无论你是后端开发者还是前端开发者，这篇文章都能帮助你快速掌握 <strong>Express + Apollo Server + GraphQL 查询</strong> 的完整流程！🚀</p>
<hr>
<h2><strong>1. 在 Express 中集成 Apollo Server</strong></h2>
<h3><strong>1.1 安装依赖</strong></h3>
<p>首先，我们需要安装以下依赖：</p>
<pre><code class="language-sh">npm install express apollo-server-express graphql cors body-parser morgan
</code></pre>
<p>或者使用 <code inline="">yarn</code>：</p>
<pre><code class="language-sh">yarn add express apollo-server-express graphql cors body-parser morgan
</code></pre>
<hr>
<h3><strong>1.2 创建 Express 服务器并集成 Apollo Server</strong></h3>
<p>在 <code inline="">server.js</code> 文件中编写以下代码：</p>

```javascript
import express from "express";
import { ApolloServer, gql } from "apollo-server-express";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";

// 1️⃣ **定义 GraphQL Schema**
const typeDefs = gql`
  type Query {
    getUser(id: ID!): User
  }

  type User {
    id: ID!
    name: String!
    posts: [Post!]!
  }

  type Post {
    id: ID!
    title: String!
    content: String
  }
`;

// 2️⃣ **模拟数据库**
const users = [
  {
    id: "123",
    name: "张三",
    posts: [
      { id: "1", title: "第一篇文章", content: "这是第一篇文章的内容。" },
      { id: "2", title: "第二篇文章", content: "这是第二篇文章的内容。" }
    ]
  }
];

// 3️⃣ **定义 Resolvers**
const resolvers = {
  Query: {
    getUser: (_, { id }) =>users.find(user => user.id === id) || null
  }
};

// 4️⃣ **创建 Express 应用**
const app = express();

// 5️⃣ **注册 Express 中间件**
app.use(cors()); // 允许跨域请求
app.use(bodyParser.json()); // 解析 JSON 请求体
app.use(morgan("dev")); // 记录 HTTP 请求日志

// 6️⃣ **创建 Apollo Server**
const server = new ApolloServer({ typeDefs, resolvers });

// 7️⃣ **启动 Apollo Server 并绑定到 Express**
await server.start();
server.applyMiddleware({ app }); // Apollo GraphQL 作为中间件

// 8️⃣ **启动 Express 服务器**
app.listen(4000, () => {
  console.log(`🚀 服务器运行在 http://localhost:4000${server.graphqlPath}`);
});
```

<hr>
<h3><strong>1.3 代码解析</strong></h3>
<p>✅ <code inline="">app.use(cors())</code> → 允许跨域请求，避免 CORS 错误<br>
✅ <code inline="">app.use(bodyParser.json())</code> → 解析 JSON 请求体，方便解析 GraphQL 请求<br>
✅ <code inline="">app.use(morgan("dev"))</code> → 记录 HTTP 请求日志，方便调试<br>
✅ <code inline="">server.applyMiddleware({ app })</code> → 把 Apollo Server 作为 Express 中间件</p>
<p><strong>启动服务器</strong></p>
<pre><code class="language-sh">node server.js
</code></pre>
<p>服务器启动后，访问：</p>
<pre><code>http://localhost:4000/graphql
</code></pre>
<p>你会看到 <strong>GraphQL Playground</strong>，可以在其中测试查询！🎉</p>
<hr>
<h2><strong>2. 在前端执行 GraphQL 查询</strong></h2>
<p>后端搭建完成后，我们需要在前端请求数据。</p>
<p>这里介绍 <strong>两种方式</strong>：</p>
<ol>
<li><strong>Apollo Client</strong>（适用于 React/Vue/Angular）</li>
<li><strong>Fetch API</strong>（适用于所有前端环境）</li>
</ol>
<hr>
<h3><strong>2.1 方式 1：使用 Apollo Client（适用于 React / Vue / Angular）</strong></h3>
<p>如果你的前端使用 <strong>React</strong>，推荐使用 Apollo Client 来管理 GraphQL 查询。</p>
<h3><strong>2.1.1 安装 Apollo Client</strong></h3>
<pre><code class="language-sh">npm install @apollo/client graphql
</code></pre>
<hr>
<h3><strong>2.1.2 React 代码示例</strong></h3>

```javascript
import React from "react";
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql } from "@apollo/client";

// 1️⃣ **创建 Apollo Client**
const client = new ApolloClient({
  uri: "http://localhost:4000/graphql", // GraphQL 服务器地址
  cache: new InMemoryCache(),
});

// 2️⃣ **定义 GraphQL 查询**
const GET_USER = gql`
  query GetUser($id: ID!) {
    getUser(id: $id) {
      name
      posts {
        title
        content
      }
    }
  }
`;

// 3️⃣ **创建 React 组件**
const UserInfo = ({ userId }: { userId: string }) => {
  const { loading, error, data } = useQuery(GET_USER, { variables: { id: userId } });

  if (loading) return <p>加载中...</p>;
  if (error) return <p>错误: {error.message}</p>;

 return (
  <div>
    <h2>用户: {data.getUser.name}</h2>
    <h3>文章列表:</h3>
    <ul>
      {data.getUser.posts.map((post: { title: string; content: string }, index: number) => (
        <li key={index}>
          <strong>{post.title}</strong> - {post.content}
        </li>
      ))}
    </ul>
  </div>
);
};

// 4️⃣ **渲染组件**
const App = () => (
  <ApolloProvider client={client}>
    <UserInfo userId="123" />
  </ApolloProvider>
);

export default App;
```

<hr>
<h3><strong>2.2 方式 2：使用 Fetch API（适用于所有前端环境）</strong></h3>
<p>如果你不想安装 Apollo Client，可以使用 <strong>原生 Fetch API</strong> 直接发送 GraphQL 请求。</p>

```javascript

async function fetchUser(userId) {
  const query = `
    query GetUser($id: ID!) {
      getUser(id: $id) {
        name
        posts {
          title
          content
        }
      }
    }
  `;

  const variables = { id: userId };

  const response = await fetch("http://localhost:4000/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  const result = await response.json();
  console.log(result.data);
}

// 执行查询
fetchUser("123");
```

<hr>
<h2><strong>3. 选择哪种方式？</strong></h2>

方式 | 适用场景 | 适用框架
-- | -- | --
Apollo Client | 需要管理 GraphQL 状态、缓存、订阅等 | React / Vue / Angular
Fetch API | 只需发送简单请求，依赖少 | 原生 JS / Vue / 小程序等


<p>如果你使用 <strong>React / Vue / Angular</strong>，建议使用 <strong>Apollo Client</strong>，因为它提供了更好的 <strong>状态管理和缓存机制</strong>。<br>
如果你的项目 <strong>没有安装 Apollo</strong>，可以使用 <strong>Fetch API</strong> 直接请求 GraphQL 服务器。</p>
<hr>
<h2><strong>4. 总结</strong></h2>
<p>✅ <strong>Express + Apollo Server 轻松构建 GraphQL API</strong><br>
✅ <strong>使用 CORS、Body Parser、Morgan 等 Express 中间件</strong><br>
✅ <strong>前端可使用 Apollo Client 或 Fetch API 查询数据</strong></p>
<p>希望这篇文章能帮你快速上手 <strong>GraphQL + Express + Apollo Server</strong>！🚀</p></body></html><!--EndFragment-->
</body>
</html>

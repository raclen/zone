---
title: "在next中，使用文件系统（getStaticProps + Markdown 文件）加载博客内容"
description: "要在 Next.js 中使用文件系统加载博客内容，可以结合  和 Markdown 文件来实现。以下是一个基本示例，展示如何使用这些功能：  1. **安装必要的依赖**：    首先，需要安装一些用于解析 Markdown 的依赖项：          -  用于解析 Markdow..."
pubDate: 2025-01-07T12:26:26Z
updatedDate: 2025-01-07T12:26:26Z
issueNumber: 42
issueUrl: https://github.com/raclen/raclen.github.io/issues/42
tags: []
author:
  name: "raclen"
  avatar: "https://avatars.githubusercontent.com/u/7697758?v=4"
draft: false
---

要在 Next.js 中使用文件系统加载博客内容，可以结合 `getStaticProps` 和 Markdown 文件来实现。以下是一个基本示例，展示如何使用这些功能：

1. **安装必要的依赖**：
   首先，需要安装一些用于解析 Markdown 的依赖项：

   ```bash
   npm install gray-matter marked
   ```

   - `gray-matter` 用于解析 Markdown 文件中的元数据。
   - `marked` 用于将 Markdown 转换为 HTML。

2. **创建 Markdown 文件**：
   在项目的根目录下创建一个文件夹 `posts`，并在其中创建一些 Markdown 文件，例如 `hello-world.md`：

   ```markdown
   ---
   title: "Hello World"
   date: "2025-01-07"
   ---

   This is my first blog post in Markdown!
   ```

3. **在 `pages` 文件夹中创建一个页面来显示博客内容**：
   创建一个新的页面文件 `pages/posts/[slug].js`：

   ```jsx
   import fs from 'fs';
   import path from 'path';
   import matter from 'gray-matter';
   import marked from 'marked';

   export async function getStaticPaths() {
     const files = fs.readdirSync('posts');
     const paths = files.map((filename) => ({
       params: {
         slug: filename.replace('.md', ''),
       },
     }));

     return {
       paths,
       fallback: false, // 可以将其设为 true 或 'blocking' 以支持 ISR
     };
   }

   export async function getStaticProps({ params: { slug } }) {
     const markdownWithMeta = fs.readFileSync(path.join('posts', slug + '.md'), 'utf-8');
     const { data: frontmatter, content } = matter(markdownWithMeta);
     const htmlContent = marked(content);

     return {
       props: {
         frontmatter,
         slug,
         htmlContent,
       },
     };
   }

   const PostPage = ({ frontmatter: { title, date }, htmlContent }) => {
     return (
       <div>
         <h1>{title}</h1>
         <p>{date}</p>
         <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
       </div>
     );
   };

   export default PostPage;
   ```

4. **创建主页来列出所有博客文章**：
   创建一个新的页面文件 `pages/index.js`：

   ```jsx
   import fs from 'fs';
   import path from 'path';
   import Link from 'next/link';
   import matter from 'gray-matter';

   export async function getStaticProps() {
     const files = fs.readdirSync('posts');
     const posts = files.map((filename) => {
       const markdownWithMeta = fs.readFileSync(path.join('posts', filename), 'utf-8');
       const { data: frontmatter } = matter(markdownWithMeta);

       return {
         slug: filename.replace('.md', ''),
         frontmatter,
       };
     });

     return {
       props: {
         posts,
       },
     };
   }

   const Home = ({ posts }) => {
     return (
       <div>
         <h1>Blog Posts</h1>
         <ul>
           {posts.map(({ slug, frontmatter: { title, date } }) => (
             <li key={slug}>
               <Link href={`/posts/${slug}`}>
                 <a>{title} - {date}</a>
               </Link>
             </li>
           ))}
         </ul>
       </div>
     );
   };

   export default Home;
   ```

通过上述步骤，你可以在 Next.js 中使用文件系统加载博客内容，并使用 `getStaticProps` 和 Markdown 文件来生成静态页面。这种方法不仅可以提高性能，还可以使博客内容的管理更加灵活。

---

💬 **[在 GitHub Issue 讨论这篇文章](https://github.com/raclen/raclen.github.io/issues/42)**

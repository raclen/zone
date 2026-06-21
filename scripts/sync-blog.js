import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置
const CONFIG = {
  owner: 'raclen',
  repo: 'raclen.github.io',
  blogDir: path.join(__dirname, '../src/content/blog'),
  metaFile: path.join(__dirname, '../src/content/blog/.sync-meta.json'),
  apiBase: 'https://api.github.com',
};

/**
 * 生成 URL 友好的 slug
 * 简化版：使用英文和数字，移除特殊字符
 */
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^一-龥a-z0-9\s-]/g, '') // 保留中文、英文、数字、空格、连字符
    .trim()
    .replace(/\s+/g, '-') // 空格转连字符
    .replace(/-+/g, '-') // 多个连字符合并
    .slice(0, 50); // 限制长度
}

/**
 * 生成文件名
 */
function generateFilename(issue) {
  const date = new Date(issue.created_at);
  const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
  const issueNum = String(issue.number).padStart(3, '0');
  const slug = generateSlug(issue.title);
  return `${dateStr}-${issueNum}-${slug}.md`;
}

/**
 * 提取描述（正文前 150 字符）
 */
function extractDescription(body) {
  if (!body) return '';
  const cleaned = body
    .replace(/#{1,6}\s/g, '') // 移除 markdown 标题符号
    .replace(/!\[.*?\]\(.*?\)/g, '') // 移除图片
    .replace(/\[.*?\]\(.*?\)/g, '') // 移除链接
    .replace(/`{1,3}.*?`{1,3}/gs, '') // 移除代码
    .replace(/\n+/g, ' ') // 换行转空格
    .trim();
  return cleaned.slice(0, 150) + (cleaned.length > 150 ? '...' : '');
}

/**
 * 构建 Markdown 文件内容
 */
function buildMarkdown(issue) {
  const frontmatter = {
    title: issue.title,
    description: extractDescription(issue.body),
    pubDate: issue.created_at,
    updatedDate: issue.updated_at,
    issueNumber: issue.number,
    issueUrl: issue.html_url,
    tags: issue.labels
      .map(label => label.name)
      .filter(name => name !== 'blog'), // 排除 'blog' 标签本身
    author: {
      name: issue.user.login,
      avatar: issue.user.avatar_url,
    },
    draft: false,
  };

  // 转换为 YAML frontmatter
  const yamlLines = [
    '---',
    `title: "${frontmatter.title.replace(/"/g, '\\"')}"`,
    frontmatter.description ? `description: "${frontmatter.description.replace(/"/g, '\\"')}"` : '',
    `pubDate: ${frontmatter.pubDate}`,
    frontmatter.updatedDate ? `updatedDate: ${frontmatter.updatedDate}` : '',
    `issueNumber: ${frontmatter.issueNumber}`,
    `issueUrl: ${frontmatter.issueUrl}`,
    `tags: [${frontmatter.tags.map(t => `"${t}"`).join(', ')}]`,
    `author:`,
    `  name: "${frontmatter.author.name}"`,
    frontmatter.author.avatar ? `  avatar: "${frontmatter.author.avatar}"` : '',
    `draft: ${frontmatter.draft}`,
    '---',
  ].filter(Boolean); // 移除空行

  return `${yamlLines.join('\n')}

${issue.body || ''}

---

💬 **[在 GitHub Issue 讨论这篇文章](${issue.html_url})**
`;
}

/**
 * 读取同步元数据
 */
async function readSyncMeta() {
  try {
    const content = await fs.readFile(CONFIG.metaFile, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    // 文件不存在，返回初始结构
    return {
      lastSyncTime: null,
      issues: {},
    };
  }
}

/**
 * 写入同步元数据
 */
async function writeSyncMeta(meta) {
  await fs.writeFile(CONFIG.metaFile, JSON.stringify(meta, null, 2), 'utf-8');
}

/**
 * 从 GitHub API 获取 Issues
 */
async function fetchIssues() {
  const url = `${CONFIG.apiBase}/repos/${CONFIG.owner}/${CONFIG.repo}/issues?state=open&per_page=100`;

  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'raclen-blog-sync',
  };

  // 如果有 GITHUB_TOKEN，使用它以提高速率限制
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  console.log(`正在获取 Issues: ${url}`);
  const response = await fetch(url, { headers });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`GitHub API 错误: ${response.status} ${error}`);
  }

  // 检查速率限制
  const remaining = response.headers.get('X-RateLimit-Remaining');
  const limit = response.headers.get('X-RateLimit-Limit');
  console.log(`API 速率限制: ${remaining}/${limit}`);

  const issues = await response.json();

  // 过滤掉 Pull Requests（GitHub API 会返回 PR）
  return issues.filter(issue => !issue.pull_request);
}

/**
 * 对比变化
 */
function detectChanges(issues, meta) {
  const newOrUpdated = [];
  const deleted = [];

  // 检查新增或更新的 Issues
  for (const issue of issues) {
    const cached = meta.issues[issue.number];
    if (!cached || cached.updatedAt !== issue.updated_at) {
      newOrUpdated.push(issue);
    }
  }

  // 检查已删除的 Issues（关闭或删除）
  const currentIssueNumbers = new Set(issues.map(i => i.number));
  for (const [issueNumber, data] of Object.entries(meta.issues)) {
    if (!currentIssueNumbers.has(Number(issueNumber))) {
      deleted.push({
        issueNumber: Number(issueNumber),
        filename: data.filename,
      });
    }
  }

  return { newOrUpdated, deleted };
}

/**
 * 主同步逻辑
 */
async function syncBlog() {
  console.log('🚀 开始同步博客...\n');

  // 确保目录存在
  await fs.mkdir(CONFIG.blogDir, { recursive: true });

  // 1. 读取元数据
  console.log('📖 读取同步元数据...');
  const meta = await readSyncMeta();

  // 2. 获取 Issues
  console.log('🔍 获取 GitHub Issues...');
  const issues = await fetchIssues();
  console.log(`✅ 获取到 ${issues.length} 个 Issues\n`);

  if (issues.length === 0) {
    console.log('⚠️  没有找到任何 Issues，跳过同步');
    return;
  }

  // 3. 对比变化
  console.log('🔄 检测变化...');
  const changes = detectChanges(issues, meta);
  console.log(`  - 新增或更新: ${changes.newOrUpdated.length}`);
  console.log(`  - 删除: ${changes.deleted.length}\n`);

  // 4. 处理新增和更新
  let processedCount = 0;
  for (const issue of changes.newOrUpdated) {
    const filename = generateFilename(issue);
    const filepath = path.join(CONFIG.blogDir, filename);
    const content = buildMarkdown(issue);

    await fs.writeFile(filepath, content, 'utf-8');
    console.log(`✏️  已写入: ${filename}`);

    // 更新元数据
    meta.issues[issue.number] = {
      updatedAt: issue.updated_at,
      filename: filename,
    };

    processedCount++;
  }

  // 5. 处理删除
  for (const item of changes.deleted) {
    const filepath = path.join(CONFIG.blogDir, item.filename);
    try {
      await fs.unlink(filepath);
      console.log(`🗑️  已删除: ${item.filename}`);
      delete meta.issues[item.issueNumber];
    } catch (error) {
      console.warn(`⚠️  删除失败 ${item.filename}: ${error.message}`);
    }
  }

  // 6. 更新元数据
  meta.lastSyncTime = new Date().toISOString();
  await writeSyncMeta(meta);

  console.log('\n✨ 同步完成!');
  console.log(`  - 处理了 ${processedCount} 个文章`);
  console.log(`  - 删除了 ${changes.deleted.length} 个文章`);
  console.log(`  - 最后同步时间: ${meta.lastSyncTime}`);
}

// 运行同步
syncBlog().catch(error => {
  console.error('❌ 同步失败:', error);
  process.exit(1);
});

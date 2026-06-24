import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置
const CONFIG = {
  owner: 'raclen',
  repo: 'zone',
  blogDir: path.join(__dirname, '../src/content/blog'),
  metaFile: path.join(__dirname, '../src/content/blog/.sync-meta.json'),
  apiBase: 'https://api.github.com',
};

/**
 * 生成 URL 友好的 slug
 */
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^一-龥a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 50);
}

/**
 * 读取导入脚本写入 Issue 正文中的历史发布时间。
 */
function extractBlogMeta(body) {
  if (!body) return {};

  const match = body.match(/<!--\s*blog-meta\s*([\s\S]*?)\s*-->/i);
  if (!match) return {};

  return match[1].split('\n').reduce((meta, line) => {
    const item = line.match(/^\s*([A-Za-z][\w-]*)\s*:\s*(.+?)\s*$/);
    if (item) meta[item[1]] = item[2];
    return meta;
  }, {});
}

function getIssuePubDate(issue) {
  const meta = extractBlogMeta(issue.body || '');
  return meta.pubDate || issue.created_at;
}

function getIssueUpdatedDate(issue) {
  const meta = extractBlogMeta(issue.body || '');
  if (meta.updatedDate) return meta.updatedDate;
  if (meta.pubDate) return null;
  return issue.updated_at;
}

function stripBlogMeta(body) {
  return (body || '').replace(/\n?<!--\s*blog-meta\s*[\s\S]*?\s*-->\s*\n?/i, '\n');
}

function yamlString(value) {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"');
}

/**
 * 生成文件名
 */
function generateFilename(issue) {
  const date = new Date(getIssuePubDate(issue));
  const dateStr = date.toISOString().split('T')[0];
  const issueNum = String(issue.number).padStart(3, '0');
  const slug = generateSlug(issue.title);
  return `${dateStr}-${issueNum}-${slug}.md`;
}

/**
 * 提取描述
 */
function extractDescription(body) {
  if (!body) return '';
  const cleaned = body
    .replace(/\n?💬 \*\*\[在 GitHub Issue 讨论这篇文章\]\([^\n]+\)\*\*\s*\n?/g, '\n')
    .replace(/#{1,6}\s/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[.*?\]\(.*?\)/g, '')
    .replace(/`{1,3}.*?`{1,3}/gs, '')
    .replace(/\n+/g, ' ')
    .trim();
  return cleaned.slice(0, 150) + (cleaned.length > 150 ? '...' : '');
}

/**
 * 构建 Markdown 文件内容
 */
function buildMarkdown(issue) {
  const contentBody = stripBlogMeta(issue.body || '')
    .replace(
      /\n?💬 \*\*\[在 GitHub Issue 讨论这篇文章\]\([^\n]+\)\*\*\s*\n?/g,
      '\n'
    );
  const pubDate = getIssuePubDate(issue);
  const updatedDate = getIssueUpdatedDate(issue);
  const frontmatter = {
    title: issue.title,
    description: extractDescription(contentBody),
    pubDate,
    updatedDate,
    issueNumber: issue.number,
    issueUrl: issue.html_url,
    tags: issue.labels
      .map(label => label.name)
      .filter(name => name !== 'blog'),
    author: {
      name: issue.user.login,
      avatar: issue.user.avatar_url,
    },
    draft: false,
  };

  const yamlLines = [
    '---',
    `title: "${yamlString(frontmatter.title)}"`,
    frontmatter.description ? `description: "${yamlString(frontmatter.description)}"` : '',
    `pubDate: ${frontmatter.pubDate}`,
    frontmatter.updatedDate ? `updatedDate: ${frontmatter.updatedDate}` : '',
    `issueNumber: ${frontmatter.issueNumber}`,
    `issueUrl: ${frontmatter.issueUrl}`,
    `tags: [${frontmatter.tags.map(t => `"${yamlString(t)}"`).join(', ')}]`,
    `author:`,
    `  name: "${yamlString(frontmatter.author.name)}"`,
    frontmatter.author.avatar ? `  avatar: "${yamlString(frontmatter.author.avatar)}"` : '',
    `draft: ${frontmatter.draft}`,
    '---',
  ].filter(Boolean);

  return `${yamlLines.join('\n')}

${contentBody}
`;
}

async function readSyncMeta() {
  try {
    const content = await fs.readFile(CONFIG.metaFile, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    return {
      lastSyncTime: null,
      issues: {},
    };
  }
}

async function writeSyncMeta(meta) {
  await fs.writeFile(CONFIG.metaFile, JSON.stringify(meta, null, 2), 'utf-8');
}

async function fetchIssues() {
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'raclen-blog-sync',
  };

  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const issues = [];
  let page = 1;
  let remaining = null;
  let limit = null;

  while (true) {
    const url = `${CONFIG.apiBase}/repos/${CONFIG.owner}/${CONFIG.repo}/issues?state=open&labels=blog&per_page=100&page=${page}`;
    console.log(`正在获取 Issues: ${url}`);
    const response = await fetch(url, { headers });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`GitHub API 错误: ${response.status} ${error}`);
    }

    remaining = response.headers.get('X-RateLimit-Remaining');
    limit = response.headers.get('X-RateLimit-Limit');

    const pageIssues = await response.json();
    issues.push(...pageIssues.filter(issue => !issue.pull_request));

    if (pageIssues.length < 100) break;
    page++;
  }

  console.log(`API 速率限制: ${remaining}/${limit}`);
  return issues;
}

function detectChanges(issues, meta) {
  const newOrUpdated = [];
  const deleted = [];

  for (const issue of issues) {
    const cached = meta.issues[issue.number];
    if (!cached || cached.updatedAt !== issue.updated_at) {
      newOrUpdated.push(issue);
    }
  }

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

async function syncBlog() {
  console.log('🚀 开始同步博客...\n');

  await fs.mkdir(CONFIG.blogDir, { recursive: true });

  console.log('📖 读取同步元数据...');
  const meta = await readSyncMeta();

  console.log('🔍 获取 GitHub Issues...');
  const issues = await fetchIssues();
  console.log(`✅ 获取到 ${issues.length} 个 Issues\n`);

  if (issues.length === 0) {
    console.log('⚠️  没有找到任何 Issues，跳过同步');
    return;
  }

  console.log('🔄 检测变化...');
  const changes = detectChanges(issues, meta);
  console.log(`  - 新增或更新: ${changes.newOrUpdated.length}`);
  console.log(`  - 删除: ${changes.deleted.length}\n`);

  let processedCount = 0;
  for (const issue of changes.newOrUpdated) {
    const filename = generateFilename(issue);
    const filepath = path.join(CONFIG.blogDir, filename);
    const content = buildMarkdown(issue);

    await fs.writeFile(filepath, content, 'utf-8');
    console.log(`✏️  已写入: ${filename}`);

    meta.issues[issue.number] = {
      updatedAt: issue.updated_at,
      filename: filename,
    };

    processedCount++;
  }

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

  meta.lastSyncTime = new Date().toISOString();
  await writeSyncMeta(meta);

  console.log('\n✨ 同步完成!');
  console.log(`  - 处理了 ${processedCount} 个文章`);
  console.log(`  - 删除了 ${changes.deleted.length} 个文章`);
  console.log(`  - 最后同步时间: ${meta.lastSyncTime}`);
}

syncBlog().catch(error => {
  console.error('❌ 同步失败:', error);
  process.exit(1);
});

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
  redirectsFile: path.join(__dirname, '../public/_redirects'),
  apiBase: 'https://api.github.com',
};

/**
 * 生成稳定的文件名。
 * Issue 编号在仓库内唯一，标题修改时也不会导致文章 URL 变化。
 */
function generateFilename(issue) {
  return `${issue.number}.md`;
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
    const parsed = JSON.parse(content);
    return {
      issues: Object.fromEntries(
        Object.entries(parsed.issues || {}).map(([issueNumber, data]) => [
          issueNumber,
          {
            ...data,
            aliases: Array.isArray(data.aliases) ? data.aliases : [],
          },
        ])
      ),
    };
  } catch (error) {
    return {
      issues: {},
    };
  }
}

async function writeSyncMeta(meta) {
  await fs.writeFile(
    CONFIG.metaFile,
    JSON.stringify(
      {
        issues: meta.issues || {},
      },
      null,
      2
    ),
    'utf-8'
  );
}

function getFilenameSlug(filename) {
  return filename.replace(/\.(md|mdx)$/i, '');
}

function encodePathSegment(segment) {
  return encodeURIComponent(segment);
}

/**
 * 生成旧文章 URL 到新编号 URL 的永久重定向。
 * 同时覆盖带和不带末尾斜杠的旧链接，避免历史分享链接失效。
 */
async function writeRedirects(meta) {
  const rules = [];
  const emitted = new Set();

  for (const data of Object.values(meta.issues)) {
    const filename = data.filename;
    if (!filename) continue;

    const destination = `/blog/${encodePathSegment(getFilenameSlug(filename))}/`;
    for (const alias of data.aliases || []) {
      const source = `/blog/${encodePathSegment(getFilenameSlug(alias))}`;
      for (const sourcePath of [source, `${source}/`]) {
        const rule = `${sourcePath} ${destination} 301`;
        if (!emitted.has(rule)) {
          emitted.add(rule);
          rules.push(rule);
        }
      }
    }
  }

  const header = `# Cloudflare Pages 重定向规则
# 重要：Cloudflare Pages 的 _redirects 不支持「域名级」重定向（官方文档标注 ❌），
#       形如 https://old.domain/* → https://new.domain/* 的规则不会生效。
#       跨域名跳转请用账户级「批量重定向（Bulk Redirects）」或各域名下的「重定向规则」。
#       本文件只保留站点内部的路径级重定向。

# 博客旧标题 URL → 新 Issue 编号 URL
`;

  await fs.writeFile(
    CONFIG.redirectsFile,
    `${header}${rules.length > 0 ? `${rules.join('\n')}\n` : ''}`,
    'utf-8'
  );
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
    if (
      !cached ||
      cached.updatedAt !== issue.updated_at ||
      cached.filename !== generateFilename(issue)
    ) {
      newOrUpdated.push(issue);
    }
  }

  const currentIssueNumbers = new Set(issues.map(i => i.number));
  for (const [issueNumber, data] of Object.entries(meta.issues)) {
    if (!currentIssueNumbers.has(Number(issueNumber))) {
      deleted.push({
        issueNumber: Number(issueNumber),
        filename: data.filename,
        aliases: data.aliases || [],
      });
    }
  }

  return { newOrUpdated, deleted };
}

function getMarkdownIssueNumber(content) {
  const frontmatter = content.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1];
  const issueNumber = frontmatter?.match(/^issueNumber:[ \t]*(\d+)[ \t]*\r?$/m)?.[1];
  return issueNumber ? Number(issueNumber) : null;
}

/**
 * 清理已记录为 alias 的旧文件。
 * 只有文件 frontmatter 的 Issue 编号匹配时才删除，避免误删手写文章。
 */
async function removeStaleFiles(meta) {
  let removedCount = 0;

  for (const [issueNumber, data] of Object.entries(meta.issues)) {
    for (const filename of data.aliases || []) {
      const filepath = path.join(CONFIG.blogDir, filename);
      try {
        const content = await fs.readFile(filepath, 'utf-8');
        if (getMarkdownIssueNumber(content) !== Number(issueNumber)) continue;
        await fs.unlink(filepath);
        console.log(`🗑️  已清理旧文件: ${filename}`);
        removedCount++;
      } catch (error) {
        if (error.code !== 'ENOENT') throw error;
      }
    }
  }

  return removedCount;
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
    const previous = meta.issues[issue.number];
    const aliases = new Set(previous?.aliases || []);
    if (previous?.filename && previous.filename !== filename) {
      aliases.add(previous.filename);
    }

    await fs.writeFile(filepath, content, 'utf-8');
    console.log(`✏️  已写入: ${filename}`);

    meta.issues[issue.number] = {
      updatedAt: issue.updated_at,
      filename: filename,
      aliases: [...aliases],
    };

    processedCount++;
  }

  for (const item of changes.deleted) {
    const filenames = [item.filename, ...(item.aliases || [])].filter(Boolean);
    for (const filename of new Set(filenames)) {
      const filepath = path.join(CONFIG.blogDir, filename);
      try {
        await fs.unlink(filepath);
        console.log(`🗑️  已删除: ${filename}`);
      } catch (error) {
        if (error.code !== 'ENOENT') {
          console.warn(`⚠️  删除失败 ${filename}: ${error.message}`);
        }
      }
    }
    delete meta.issues[item.issueNumber];
  }

  const removedStaleCount = await removeStaleFiles(meta);
  await writeRedirects(meta);

  if (processedCount > 0 || changes.deleted.length > 0 || removedStaleCount > 0) {
    await writeSyncMeta(meta);
  } else {
    console.log('ℹ️  没有检测到文章变更，跳过更新同步元数据');
  }

  console.log('\n✨ 同步完成!');
  console.log(`  - 处理了 ${processedCount} 个文章`);
  console.log(`  - 删除了 ${changes.deleted.length} 个文章`);
  console.log(`  - 清理了 ${removedStaleCount} 个旧文件`);
}

syncBlog().catch(error => {
  console.error('❌ 同步失败:', error);
  process.exit(1);
});

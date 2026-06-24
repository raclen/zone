import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const CONFIG = {
  owner: 'raclen',
  repo: 'zone',
  blogDir: path.join(ROOT_DIR, 'src/content/blog'),
  syncMetaFile: path.join(ROOT_DIR, 'src/content/blog/.sync-meta.json'),
  defaultLabels: ['blog'],
  imageBranch: 'main',
  imageDir: 'blog-assets',
  apiBase: 'https://api.github.com',
  labelColor: 'bfd4f2',
};

function parseArgs(argv) {
  const args = {
    source: CONFIG.blogDir,
    write: false,
    includeSynced: false,
    includeUndated: false,
    labels: [...CONFIG.defaultLabels],
    imageDir: CONFIG.imageDir,
    imageBranch: CONFIG.imageBranch,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--write') args.write = true;
    else if (arg === '--include-synced') args.includeSynced = true;
    else if (arg === '--include-undated') args.includeUndated = true;
    else if (arg === '--source' && argv[i + 1]) args.source = path.resolve(argv[++i]);
    else if (arg === '--labels' && argv[i + 1]) args.labels = parseLabels(argv[++i]);
    else if (arg === '--image-dir' && argv[i + 1]) args.imageDir = argv[++i].replace(/^\/+|\/+$/g, '');
    else if (arg === '--image-branch' && argv[i + 1]) args.imageBranch = argv[++i];
    else if (arg === '--help' || arg === '-h') args.help = true;
    else throw new Error(`未知参数: ${arg}`);
  }

  return args;
}

function parseLabels(value) {
  const labels = value
    .split(',')
    .map(label => label.trim())
    .filter(Boolean);

  return Array.from(new Set([...CONFIG.defaultLabels, ...labels]));
}

function showHelp() {
  console.log(`用法:
  node scripts/import-md-to-issues.js [选项]

选项:
  --source <path>          要导入的 md 文件或目录，默认 src/content/blog
  --labels <a,b>          额外添加到 Issue 的标签，默认始终包含 blog
  --image-dir <path>      本地图片上传到目标仓库的目录，默认 blog-assets
  --image-branch <branch> 读取图片 raw URL 使用的分支，默认 main
  --include-synced        包含已经有 issueNumber/issueUrl 或同步元数据的文章
  --include-undated       包含没有 date/pubDate 的文件，默认跳过
  --write                 真的创建 Issue 并上传图片；不加时只预览
  --help                  显示帮助

示例:
  node scripts/import-md-to-issues.js --source src/content/blog
  node scripts/import-md-to-issues.js --source ./old-posts --labels idea --write
`);
}

async function readJson(file) {
  try {
    return JSON.parse(await fs.readFile(file, 'utf-8'));
  } catch {
    return null;
  }
}

async function collectMarkdownFiles(source) {
  const stats = await fs.stat(source);
  if (stats.isFile()) return /\.mdx?$/i.test(source) ? [source] : [];

  const entries = await fs.readdir(source, { withFileTypes: true });
  const files = await Promise.all(entries.map(async entry => {
    const filepath = path.join(source, entry.name);
    if (entry.isDirectory()) return collectMarkdownFiles(filepath);
    return /\.mdx?$/i.test(entry.name) ? [filepath] : [];
  }));

  return files.flat().sort();
}

function parseFrontmatter(content) {
  const normalized = content.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
  if (!normalized.startsWith('---\n')) {
    const legacyEnd = normalized.indexOf('\n---');
    if (legacyEnd === -1) return { data: {}, body: normalized };

    const raw = normalized.slice(0, legacyEnd);
    const data = parseSimpleYaml(raw);
    if (!data.title && !data.date && !data.tags) return { data: {}, body: normalized };

    const body = normalized.slice(legacyEnd).replace(/^\n---\s*\n?/, '');
    return { data, body };
  }

  const end = normalized.indexOf('\n---', 4);
  if (end === -1) return { data: {}, body: normalized };

  const raw = normalized.slice(4, end);
  const body = normalized.slice(end).replace(/^\n---\s*\n?/, '');
  return { data: parseSimpleYaml(raw), body };
}

function parseSimpleYaml(raw) {
  const data = {};
  const lines = raw.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() || /^\s/.test(line)) continue;

    const match = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (!match) continue;

    const [, key, value] = match;
    if (value === '') {
      const nested = {};
      while (i + 1 < lines.length && /^\s+/.test(lines[i + 1])) {
        const nestedMatch = lines[++i].match(/^\s+([A-Za-z][\w-]*):\s*(.*)$/);
        if (nestedMatch) nested[nestedMatch[1]] = parseYamlValue(nestedMatch[2]);
      }
      data[key] = nested;
    } else {
      data[key] = parseYamlValue(value);
    }
  }

  return data;
}

function parseYamlValue(value) {
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;
  if (/^\[.*\]$/.test(trimmed)) {
    const body = trimmed.slice(1, -1).trim();
    if (!body) return [];
    return body.split(',').map(item => stripQuotes(item.trim())).filter(Boolean);
  }
  if (/^\d+$/.test(trimmed)) return Number(trimmed);
  return stripQuotes(trimmed);
}

function normalizeTags(value) {
  if (Array.isArray(value)) return value.map(String).map(tag => tag.trim()).filter(Boolean);
  if (typeof value === 'string') return value.split(',').map(tag => tag.trim()).filter(Boolean);
  return [];
}

function normalizeLabels(...values) {
  return values.flatMap(normalizeTags);
}

function getRawPubDate(data) {
  return data.pubDate || data.date || data.created || data.createdAt;
}

function categoryFromPath(filepath, sourceRoot) {
  const relative = path.relative(sourceRoot, filepath).replace(/\\/g, '/');
  const [category] = relative.split('/');
  if (!category || category === path.basename(filepath)) return '';
  if (category.startsWith('.') || category === '_image' || category === 'img') return '';
  return category;
}

function stripQuotes(value) {
  return value.replace(/^['"]|['"]$/g, '').replace(/\\"/g, '"');
}

function toIsoDate(value, fallbackFile) {
  if (value) {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return date.toISOString();
  }

  const filenameDate = path.basename(fallbackFile).match(/^(\d{4}-\d{2}-\d{2})/);
  if (filenameDate) return new Date(`${filenameDate[1]}T00:00:00.000Z`).toISOString();

  return new Date().toISOString();
}

function buildTitle(data, filepath) {
  if (typeof data.title === 'string' && data.title.trim()) return data.title.trim();

  return path.basename(filepath, path.extname(filepath))
    .replace(/^\d{4}-\d{2}-\d{2}-\d{3}-/, '')
    .replace(/^\d{4}-\d{2}-\d{2}-/, '')
    .replace(/-/g, ' ')
    .trim();
}

function hasSyncedIssue(data, filepath, syncMeta) {
  if (data.issueNumber || data.issueUrl) return true;

  const relative = path.relative(CONFIG.blogDir, filepath).replace(/\\/g, '/');
  return Object.values(syncMeta?.issues || {}).some(item => item.filename === relative || item.filename === path.basename(filepath));
}

function cleanBody(body) {
  return body
    .replace(/\n?💬 \*\*\[在 GitHub Issue 讨论这篇文章\]\([^\n]+\)\*\*\s*\n?/g, '\n')
    .trim();
}

async function rewriteLocalImages(body, filepath, args) {
  const segments = body.split(/(```[\s\S]*?```)/g);
  const rewrittenSegments = [];
  const uploaded = [];

  for (const segment of segments) {
    if (segment.startsWith('```')) {
      rewrittenSegments.push(segment);
      continue;
    }

    const result = await rewriteLocalImagesInSegment(segment, filepath, args);
    rewrittenSegments.push(result.body);
    uploaded.push(...result.uploaded);
  }

  return { body: rewrittenSegments.join(''), uploaded };
}

async function rewriteLocalImagesInSegment(body, filepath, args) {
  const replacements = [];
  const markdownImagePattern = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  const htmlImagePattern = /<img\b([^>]*?)\bsrc=["']([^"']+)["']([^>]*)>/gi;

  for (const match of body.matchAll(markdownImagePattern)) {
    const url = match[2];
    if (isLocalImage(url)) replacements.push({ kind: 'markdown', original: match[0], alt: match[1], url });
  }

  for (const match of body.matchAll(htmlImagePattern)) {
    const url = match[2];
    if (isLocalImage(url)) replacements.push({ kind: 'html', original: match[0], before: match[1], after: match[3], url });
  }

  let rewritten = body;
  const uploaded = [];
  for (const item of replacements) {
    const imagePath = decodeImagePath(item.url.split('#')[0].split('?')[0]);
    const absoluteImagePath = await resolveLocalImagePath(imagePath, filepath, args.source);
    try {
      await fs.access(absoluteImagePath);
    } catch {
      console.warn(`  图片未找到，保留原路径: ${item.url}`);
      continue;
    }

    const remoteUrl = await uploadImage(absoluteImagePath, filepath, args);
    uploaded.push({ local: absoluteImagePath, remote: remoteUrl });

    if (item.kind === 'markdown') {
      rewritten = rewritten.replace(item.original, `![${item.alt}](${remoteUrl})`);
    } else {
      rewritten = rewritten.replace(item.original, `<img${item.before}src="${remoteUrl}"${item.after}>`);
    }
  }

  return { body: rewritten, uploaded };
}

async function resolveLocalImagePath(imagePath, articlePath, sourceRoot) {
  const articleDir = path.dirname(articlePath);
  const articleName = path.basename(articlePath, path.extname(articlePath));
  const candidates = [];

  if (imagePath.startsWith('~/')) {
    const filename = imagePath.slice(2);
    candidates.push(path.join(articleDir, '_image', articleName, filename));
    candidates.push(path.join(articleDir, '_image', filename));
    candidates.push(path.join(sourceRoot, '_image', articleName, filename));
  } else if (imagePath.startsWith('/')) {
    candidates.push(path.join(sourceRoot, imagePath.slice(1)));
  } else {
    candidates.push(path.resolve(articleDir, imagePath));
  }

  for (const candidate of candidates) {
    try {
      await fs.access(candidate);
      return candidate;
    } catch {
      // Try the next historical image layout.
    }
  }

  return candidates[0];
}

function isLocalImage(url) {
  return Boolean(url)
    && !/^(?:https?:)?\/\//i.test(url)
    && !/^data:/i.test(url)
    && !url.startsWith('#');
}

function decodeImagePath(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

async function uploadImage(imagePath, articlePath, args) {
  const articleSlug = path.basename(articlePath, path.extname(articlePath))
    .toLowerCase()
    .replace(/[^一-龥a-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  const filename = path.basename(imagePath).replace(/[^一-龥a-zA-Z0-9._-]+/g, '-');
  const remotePath = `${args.imageDir}/${articleSlug}/${filename}`;
  const rawUrl = `https://raw.githubusercontent.com/${CONFIG.owner}/${CONFIG.repo}/${args.imageBranch}/${encodeURI(remotePath)}`;

  if (!args.write) return rawUrl;

  const content = await fs.readFile(imagePath, 'base64');
  const currentSha = await getRemoteFileSha(remotePath, args.imageBranch);
  const payload = {
    message: `Upload blog image ${remotePath}`,
    content,
    branch: args.imageBranch,
  };
  if (currentSha) payload.sha = currentSha;

  await githubRequest(`/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${encodeURIComponentPath(remotePath)}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

  return rawUrl;
}

async function getRemoteFileSha(remotePath, branch) {
  try {
    const file = await githubRequest(`/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${encodeURIComponentPath(remotePath)}?ref=${branch}`);
    return file.sha;
  } catch (error) {
    if (error.status === 404) return null;
    throw error;
  }
}

function encodeURIComponentPath(value) {
  return value.split('/').map(encodeURIComponent).join('/');
}

function buildIssueBody({ body, pubDate, updatedDate, sourcePath, sourceMeta }) {
  const meta = [
    '<!-- blog-meta',
    `pubDate: ${pubDate}`,
    updatedDate ? `updatedDate: ${updatedDate}` : '',
    sourceMeta?.category ? `category: ${sourceMeta.category}` : '',
    sourceMeta?.tags?.length ? `tags: ${sourceMeta.tags.join(', ')}` : '',
    `source: ${path.relative(ROOT_DIR, sourcePath).replace(/\\/g, '/')}`,
    '-->',
  ].filter(Boolean).join('\n');

  return `${meta}\n\n${body}\n`;
}

async function createIssue({ title, body, labels }) {
  return githubRequest(`/repos/${CONFIG.owner}/${CONFIG.repo}/issues`, {
    method: 'POST',
    body: JSON.stringify({ title, body, labels }),
  });
}

async function ensureLabels(labels, cache) {
  for (const label of labels) {
    if (cache.has(label)) continue;

    try {
      await githubRequest(`/repos/${CONFIG.owner}/${CONFIG.repo}/labels`, {
        method: 'POST',
        body: JSON.stringify({ name: label, color: CONFIG.labelColor }),
      });
      console.log(`已创建标签: ${label}`);
    } catch (error) {
      if (error.status !== 422) throw error;
    }

    cache.add(label);
  }
}

async function fetchLabelCache() {
  const labels = await githubRequest(`/repos/${CONFIG.owner}/${CONFIG.repo}/labels?per_page=100`);
  return new Set(labels.map(label => label.name));
}

async function fetchExistingIssueCache() {
  const issues = await githubRequest(`/repos/${CONFIG.owner}/${CONFIG.repo}/issues?state=all&per_page=100`);
  return new Map(issues.filter(issue => !issue.pull_request).map(issue => [normalizeIssueTitle(issue.title), issue]));
}

function normalizeIssueTitle(title) {
  return String(title || '').trim().replace(/\s+/g, ' ').toLowerCase();
}

function issueHasSource(issue, sourcePath) {
  const relative = path.relative(ROOT_DIR, sourcePath).replace(/\\/g, '/');
  return typeof issue.body === 'string' && issue.body.includes(`source: ${relative}`);
}

async function githubRequest(endpoint, options = {}) {
  const token = process.env.GITHUB_TOKEN || getGhToken();
  if (!token) throw new Error('缺少 GitHub Token。请先运行 gh auth login，或设置 GITHUB_TOKEN。');

  const response = await fetch(`${CONFIG.apiBase}${endpoint}`, {
    ...options,
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'raclen-blog-import',
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const error = new Error(`GitHub API 错误: ${response.status} ${text}`);
    error.status = response.status;
    throw error;
  }

  return data;
}

function getGhToken() {
  const result = spawnSync('gh', ['auth', 'token'], { encoding: 'utf-8' });
  if (result.status !== 0) return '';
  return result.stdout.trim();
}

async function importPosts() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    showHelp();
    return;
  }

  if (!process.argv.includes('--image-branch')) {
    args.imageBranch = await getDefaultBranch();
  }

  const syncMeta = await readJson(CONFIG.syncMetaFile);
  const files = await collectMarkdownFiles(args.source);
  const labelCache = args.write ? await fetchLabelCache() : new Set();
  const existingIssues = args.write ? await fetchExistingIssueCache() : new Map();
  const seenPosts = new Set();
  let skipped = 0;
  let duplicates = 0;
  let created = 0;

  console.log(args.write ? '开始写入 GitHub Issues...' : '预览模式，不会创建 Issue 或上传图片。');
  console.log(`源文件: ${args.source}`);
  console.log(`找到 Markdown: ${files.length}\n`);

  for (const file of files) {
    const content = await fs.readFile(file, 'utf-8');
    const { data, body: rawBody } = parseFrontmatter(content);
    const title = buildTitle(data, file);
    const rawPubDate = getRawPubDate(data);

    if (!rawPubDate && !args.includeUndated) {
      skipped++;
      console.log(`跳过无日期文件: ${title}`);
      continue;
    }

    if (!args.includeSynced && hasSyncedIssue(data, file, syncMeta)) {
      skipped++;
      console.log(`跳过已同步: ${title}`);
      continue;
    }

    const existingIssue = existingIssues.get(normalizeIssueTitle(title));
    if (existingIssue && issueHasSource(existingIssue, file)) {
      skipped++;
      console.log(`跳过远端已存在: #${existingIssue.number} ${title}`);
      continue;
    }

    const pubDate = toIsoDate(rawPubDate, file);
    const updatedDate = data.updatedDate ? toIsoDate(data.updatedDate, file) : undefined;
    const category = categoryFromPath(file, args.source);
    const sourceMeta = {
      category: normalizeLabels(data.category, data.categories)[0] || category,
      tags: normalizeLabels(data.tags),
    };
    const labels = Array.from(new Set(args.labels.filter(Boolean)));
    const cleanedBody = cleanBody(rawBody);
    const duplicateKey = `${title}\n${pubDate}\n${cleanedBody.replace(/\s+/g, ' ').trim()}`;

    if (seenPosts.has(duplicateKey)) {
      duplicates++;
      console.log(`跳过重复文章: ${title}`);
      continue;
    }
    seenPosts.add(duplicateKey);

    const { body, uploaded } = await rewriteLocalImages(cleanedBody, file, args);
    const issueBody = buildIssueBody({ body, pubDate, updatedDate, sourcePath: file, sourceMeta });

    if (!args.write) {
      console.log(`待创建: ${title}`);
      console.log(`  日期: ${pubDate}`);
      console.log(`  标签: ${labels.join(', ') || '(无)'}`);
      if (uploaded.length > 0) console.log(`  图片: ${uploaded.length} 个将上传到 ${CONFIG.owner}/${CONFIG.repo}/${args.imageDir}`);
      continue;
    }

    await ensureLabels(labels, labelCache);
    const issue = await createIssue({ title, body: issueBody, labels });
    created++;
    console.log(`已创建: #${issue.number} ${title}`);
  }

  console.log('\n完成');
  console.log(`  创建: ${created}`);
  console.log(`  跳过: ${skipped}`);
  console.log(`  重复: ${duplicates}`);
  if (!args.write) console.log('  这是预览模式；确认无误后加 --write 执行。');
}

async function getDefaultBranch() {
  try {
    const repo = await githubRequest(`/repos/${CONFIG.owner}/${CONFIG.repo}`);
    return repo.default_branch || CONFIG.imageBranch;
  } catch {
    return CONFIG.imageBranch;
  }
}

importPosts().catch(error => {
  console.error('导入失败:', error.message);
  process.exit(1);
});

import { spawnSync } from 'child_process';
import { LABEL_COLORS, extractBlogMeta, suggestBlogLabels } from './blog-labels.js';

const CONFIG = {
  sourceOwner: 'raclen',
  sourceRepo: 'raclen.github.io',
  targetOwner: 'raclen',
  targetRepo: 'zone',
  apiBase: 'https://api.github.com',
  createDelayMs: 800,
};

function parseArgs(argv) {
  return {
    write: argv.includes('--write'),
  };
}

async function fetchIssues(owner, repo) {
  const issues = [];
  for (let page = 1; ; page++) {
    const chunk = await githubRequest(`/repos/${owner}/${repo}/issues?state=open&per_page=100&page=${page}`);
    issues.push(...chunk.filter(issue => !issue.pull_request));
    if (chunk.length < 100) break;
  }
  return issues;
}

function getPubDate(issue) {
  const meta = extractBlogMeta(issue.body || '');
  return meta.pubDate || issue.created_at;
}

function buildBody(issue) {
  const meta = extractBlogMeta(issue.body || '');
  const body = issue.body || '';
  const sourceLine = `sourceIssue: ${issue.html_url}`;

  if (/<!--\s*blog-meta/i.test(body)) {
    return body.replace(/(<!--\s*blog-meta\s*\n)/i, `$1${sourceLine}\n`);
  }

  return [
    '<!-- blog-meta',
    `pubDate: ${meta.pubDate || issue.created_at}`,
    sourceLine,
    '-->',
    '',
    body,
  ].join('\n');
}

function getSourceIssueUrl(issue) {
  return extractBlogMeta(issue.body || '').sourceIssue;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function ensureLabels(owner, repo, labels, cache) {
  for (const label of labels) {
    if (cache.has(label)) continue;
    await githubRequest(`/repos/${owner}/${repo}/labels`, {
      method: 'POST',
      body: JSON.stringify({ name: label, color: LABEL_COLORS[label] || 'bfd4f2' }),
    });
    cache.add(label);
    console.log(`已创建标签: ${label}`);
  }
}

async function fetchLabelCache(owner, repo) {
  const labels = await githubRequest(`/repos/${owner}/${repo}/labels?per_page=100`);
  return new Set(labels.map(label => label.name));
}

async function createIssue(owner, repo, payload) {
  return githubRequest(`/repos/${owner}/${repo}/issues`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
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
      'User-Agent': 'raclen-blog-issue-migrator',
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) throw new Error(`GitHub API 错误: ${response.status} ${text}`);
  return data;
}

function getGhToken() {
  const result = spawnSync('gh', ['auth', 'token'], { encoding: 'utf-8' });
  return result.status === 0 ? result.stdout.trim() : '';
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const existingTarget = (await fetchIssues(CONFIG.targetOwner, CONFIG.targetRepo))
    .sort((a, b) => a.number - b.number);

  const sourceIssues = await fetchIssues(CONFIG.sourceOwner, CONFIG.sourceRepo);
  const posts = sourceIssues
    .map(issue => ({ issue, pubDate: getPubDate(issue) }))
    .sort((a, b) => new Date(a.pubDate) - new Date(b.pubDate) || a.issue.number - b.issue.number);

  const labelCache = args.write ? await fetchLabelCache(CONFIG.targetOwner, CONFIG.targetRepo) : new Set();
  console.log(`${args.write ? '开始迁移' : '预览迁移'} ${posts.length} 篇文章到 ${CONFIG.targetOwner}/${CONFIG.targetRepo}`);
  console.log(`第 1 篇: ${posts[0]?.pubDate} ${posts[0]?.issue.title}`);
  console.log(`最后一篇: ${posts.at(-1)?.pubDate} ${posts.at(-1)?.issue.title}\n`);

  let startIndex = 0;
  if (existingTarget.length > 0) {
    for (let index = 0; index < existingTarget.length; index++) {
      const targetSource = getSourceIssueUrl(existingTarget[index]);
      const expectedSource = posts[index]?.issue.html_url;
      if (!targetSource || targetSource !== expectedSource) {
        throw new Error(`${CONFIG.targetOwner}/${CONFIG.targetRepo} 已有 Issue #${existingTarget[index].number}，且不匹配迁移顺序。为保证编号顺序，请先人工确认目标仓库。`);
      }
    }
    startIndex = existingTarget.length;
    console.log(`检测到已迁移前缀: ${startIndex} 篇，将从第 ${startIndex + 1} 篇继续。\n`);
  }

  let created = startIndex;
  for (const { issue, pubDate } of posts.slice(startIndex)) {
    const labels = suggestBlogLabels(issue);
    console.log(`${String(created + 1).padStart(3, '0')} | ${pubDate} | ${issue.title} | ${labels.join(', ')}`);

    if (!args.write) {
      created++;
      continue;
    }

    await ensureLabels(CONFIG.targetOwner, CONFIG.targetRepo, labels, labelCache);
    const createdIssue = await createIssue(CONFIG.targetOwner, CONFIG.targetRepo, {
      title: issue.title,
      body: buildBody(issue),
      labels,
    });
    created++;
    console.log(`  -> #${createdIssue.number} ${createdIssue.html_url}`);
    await sleep(CONFIG.createDelayMs);
  }

  console.log(`\n${args.write ? '已迁移' : '预览完成'}: ${created} 篇`);
  if (!args.write) console.log('确认顺序和标签后，加 --write 执行。');
}

main().catch(error => {
  console.error('迁移失败:', error.message);
  process.exit(1);
});

import { spawnSync } from 'child_process';
import { LABEL_COLORS, suggestBlogLabels } from './blog-labels.js';

const CONFIG = {
  owner: 'raclen',
  repo: 'zone',
  apiBase: 'https://api.github.com',
};

function parseArgs(argv) {
  return {
    write: argv.includes('--write'),
    prune: argv.includes('--prune'),
  };
}

async function fetchIssues() {
  const issues = [];
  for (let page = 1; ; page++) {
    const chunk = await githubRequest(`/repos/${CONFIG.owner}/${CONFIG.repo}/issues?state=open&per_page=100&page=${page}`);
    issues.push(...chunk.filter(issue => !issue.pull_request));
    if (chunk.length < 100) break;
  }
  return issues;
}

async function fetchLabelCache() {
  const labels = await githubRequest(`/repos/${CONFIG.owner}/${CONFIG.repo}/labels?per_page=100`);
  return new Set(labels.map(label => label.name));
}

async function ensureLabels(labels, cache) {
  for (const label of labels) {
    if (cache.has(label)) continue;
    await githubRequest(`/repos/${CONFIG.owner}/${CONFIG.repo}/labels`, {
      method: 'POST',
      body: JSON.stringify({ name: label, color: LABEL_COLORS[label] || 'bfd4f2' }),
    });
    cache.add(label);
    console.log(`已创建标签: ${label}`);
  }
}

async function setIssueLabels(issue, labels, args) {
  const current = issue.labels.map(label => label.name);
  const next = args.prune ? [...new Set(labels)] : [...new Set([...current, ...labels])];

  await githubRequest(`/repos/${CONFIG.owner}/${CONFIG.repo}/issues/${issue.number}/labels`, {
    method: 'PUT',
    body: JSON.stringify({ labels: next }),
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
      'User-Agent': 'raclen-blog-labeler',
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
  const issues = await fetchIssues();
  const labelCache = args.write ? await fetchLabelCache() : new Set();
  const stats = new Map();
  let changed = 0;

  for (const issue of issues) {
    const labels = suggestBlogLabels(issue);
    for (const label of labels) stats.set(label, (stats.get(label) || 0) + 1);

    const current = issue.labels.map(label => label.name).sort();
    const merged = [...new Set([...current, ...labels])].sort();
    if (current.join('\n') === merged.join('\n')) continue;

    changed++;
    console.log(`#${issue.number} ${issue.title}`);
    console.log(`  ${current.join(', ') || '(无)'} -> ${merged.join(', ')}`);

    if (args.write) {
      await ensureLabels(labels, labelCache);
      await setIssueLabels(issue, labels, args);
    }
  }

  console.log('\n标签统计:');
  for (const [label, count] of [...stats.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))) {
    console.log(`  ${label}: ${count}`);
  }
  console.log(`\n${args.write ? '已处理' : '待处理'} Issue: ${changed}`);
  if (!args.write) console.log('预览模式；确认后加 --write 执行。');
}

main().catch(error => {
  console.error('打标签失败:', error.message);
  process.exit(1);
});

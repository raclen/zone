export const LABEL_COLORS = {
  blog: 'bfd4f2',
  legacy: 'bfd4f2',
  idea: '98e87a',
  book: '0e8a16',
  nodejs: '43853d',
  前端: '1d76db',
  English: '006b75',
  JavaScript: 'f7df1e',
  TypeScript: '3178c6',
  React: '61dafb',
  Vue: '42b883',
  Angular: 'dd0031',
  CSS: '563d7c',
  HTML: 'e34c26',
  'Node.js': '43853d',
  Git: 'f05032',
  GitHub: '24292f',
  数据库: '006b75',
  MongoDB: '47a248',
  SQL: '336791',
  正则: 'c586c0',
  工具: '6f42c1',
  服务器: '0e8a16',
  网络: '0366d6',
  AI: '8a63d2',
  投资: 'd4a72c',
  读书: '0e8a16',
  生活: 'fbca04',
  设计: 'ff6f91',
  面试: 'd73a49',
};

const TITLE_RULES = [
  ['AI', /\b(ai|agent|claude|chatgpt|copilot|cursor|openrouter|大模型|人工智能)\b/i],
  ['投资', /(投资|美股|黄金|国债|指数|ETF|A股|数字货币|交易|策略|收益|趋势|均值|回归|yahoo finance)/i],
  ['读书', /(经济学|读书|十大原理|读书笔记)/i],
  ['服务器', /(ubuntu|linux|vps|服务器|cloudflare|v2ray|vless|hy2|节点|内网穿透|zero trust|ec2|部署|nginx)/i],
  ['网络', /(telegram|bot|api|https|sse|server-sent|跨域|jsonp|网络|请求|websocket|代理|内网穿透)/i],
  ['Node.js', /(node\.js|nodejs|\bnode\b|express|apollo|graphql|mongoose|npm|request模块)/i],
  ['React', /(react|redux|antd|ant design)/i],
  ['Vue', /\bvue\b|vuejs|vue\.js/i],
  ['Angular', /angular/i],
  ['TypeScript', /(typescript|\bts\b)/i],
  ['JavaScript', /(javascript|\bjs\b|jquery|zepto|promise|generator|object\.create|prototype|闭包|数组|字符串|this|ajax|fetch|jsonp|dom|事件|防抖|节流|call|apply|bind|es6|btoa|atob|二维码|模板)/i],
  ['CSS', /(css|flex|rem|iframe|布局|动画|loading|transform|盒子模型|reset|边框|提示框|自适应|float)/i],
  ['HTML', /(html|iframe|form|表单|placeholder)/i],
  ['Git', /\bgit\b|gitignore|rebase|merge|stash|commit/i],
  ['GitHub', /(github issues|github actions|giscus|github pages)/i],
  ['数据库', /(数据库|mongodb|mongoose|sql|mysql|sae)/i],
  ['MongoDB', /(mongodb|mongoose)/i],
  ['SQL', /\bsql\b|mysql/i],
  ['正则', /(正则|regexp|regex|零宽断言|匹配)/i],
  ['工具', /(工具|gulp|webpack|vscode|reqable|playwright|render|bat|在线地址|google maps)/i],
  ['设计', /(photoshop|字体|颜色|设计|美术)/i],
  ['生活', /(生活|感冒|药箱|药物|日记|定律|对症下药|清晨好文章)/i],
  ['面试', /(面试|知识点|常问|错题)/i],
];

const BODY_RULES = [
  ['AI', /\b(ai|agent|claude|chatgpt|copilot|cursor|大模型|人工智能)\b/i],
  ['投资', /(投资|美股|黄金|国债|指数|ETF|A股|数字货币|交易策略|年化收益)/i],
  ['服务器', /(ubuntu|linux|vps|cloudflare|v2ray|vless|hy2|nginx|服务器)/i],
  ['数据库', /(mongodb|mysql|数据库)/i],
];

const CATEGORY_LABELS = new Map([
  ['javascript', 'JavaScript'],
  ['css', 'CSS'],
  ['angular', 'Angular'],
  ['node', 'Node.js'],
  ['数据库', '数据库'],
  ['工具', '工具'],
  ['生活', '生活'],
  ['美术设计', '设计'],
  ['other', '工具'],
  ['未分类', '工具'],
]);

const TAG_ALIASES = new Map([
  ['js', 'JavaScript'],
  ['nodejs', 'Node.js'],
  ['node', 'Node.js'],
  ['css3', 'CSS'],
  ['布局', 'CSS'],
  ['flex', 'CSS'],
  ['rem', 'CSS'],
  ['正则表达式', '正则'],
  ['面试题', '面试'],
  ['sql', 'SQL'],
  ['sae', '数据库'],
  ['git', 'Git'],
  ['gulp', '工具'],
  ['replace', 'JavaScript'],
  ['数组', 'JavaScript'],
  ['模板', 'JavaScript'],
  ['跨域', '网络'],
]);

export function extractBlogMeta(body = '') {
  const match = body.match(/<!--\s*blog-meta\s*([\s\S]*?)\s*-->/i);
  if (!match) return {};

  return match[1].split('\n').reduce((meta, line) => {
    const item = line.match(/^\s*([A-Za-z][\w-]*)\s*:\s*(.+?)\s*$/);
    if (item) meta[item[1]] = item[2];
    return meta;
  }, {});
}

export function cleanupBody(body) {
  return body
    .replace(/<!--\s*blog-meta\s*[\s\S]*?\s*-->/gi, ' ')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function suggestBlogLabels(issue) {
  const meta = extractBlogMeta(issue.body || '');
  const currentLabels = (issue.labels || []).map(label => typeof label === 'string' ? label : label.name);
  const titleText = `${issue.title}\n${meta.category || ''}\n${meta.tags || ''}`;
  const bodyText = cleanupBody(issue.body || '').slice(0, 2000);
  const labels = new Set(['blog']);

  if (currentLabels.includes('legacy')) labels.add('legacy');
  if (meta.category && CATEGORY_LABELS.has(meta.category)) labels.add(CATEGORY_LABELS.get(meta.category));

  for (const rawTag of normalizeMetaTags(meta.tags)) {
    const alias = TAG_ALIASES.get(rawTag.toLowerCase()) || TAG_ALIASES.get(rawTag) || rawTag;
    if (LABEL_COLORS[alias]) labels.add(alias);
  }

  for (const [label, pattern] of TITLE_RULES) {
    if (pattern.test(titleText)) labels.add(label);
  }

  for (const [label, pattern] of BODY_RULES) {
    if (pattern.test(bodyText)) labels.add(label);
  }

  if (labels.has('React') || labels.has('Vue') || labels.has('Angular') || labels.has('CSS') || labels.has('HTML')) {
    labels.add('前端');
  }

  if (labels.has('Node.js')) labels.add('nodejs');
  if (currentLabels.includes('book')) labels.add('读书');
  if (currentLabels.includes('idea')) labels.add('idea');
  if (currentLabels.includes('English')) labels.add('English');

  return rankLabels([...labels]);
}

function normalizeMetaTags(value = '') {
  return value.split(',').map(tag => tag.trim()).filter(Boolean);
}

function rankLabels(labels) {
  const stable = ['blog', 'legacy', 'idea', 'book', 'English'];
  const aliases = ['nodejs', '前端'];
  const content = labels
    .filter(label => !stable.includes(label) && !aliases.includes(label))
    .slice(0, 4);
  const result = [...stable.filter(label => labels.includes(label)), ...content];
  for (const label of aliases) {
    if (labels.includes(label) && result.length < 8) result.push(label);
  }
  return result;
}

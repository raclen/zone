---
title: "Yahoo Finance 的 search方法"
description: "好的，我会将该文档翻译成中文，并添加参数注释，整理成博客文章。  ---  搜索功能  用法：    **注意：** 上述示例输出并未涵盖所有可能的返回结果，这些结果可能会因资产类型甚至交易时段（交易期间）而异。有关我们涵盖的所有内容以及您可能获得的返回结果的详尽列表，请参阅 h..."
pubDate: 2024-12-28T05:42:12Z
updatedDate: 2024-12-28T05:42:13Z
issueNumber: 39
issueUrl: https://github.com/raclen/raclen.github.io/issues/39
tags: []
author:
  name: "raclen"
  avatar: "https://avatars.githubusercontent.com/u/7697758?v=4"
draft: false
---

好的，我会将该文档翻译成中文，并添加参数注释，整理成博客文章。

---

# 搜索功能

## 用法：

```js
import yahooFinance from 'yahoo-finance2';

const query = 'GOO';
const result = await yahooFinance.search(query, /* queryOptions */);

{
  explains: [],
  count: 3,
  quotes: [
    {
      exchange: 'NMS',  // 交易所
      shortname: 'Alphabet Inc.',  // 简称
      quoteType: 'EQUITY',  // 报价类型
      symbol: 'GOOG',  // 股票代码
      index: 'quotes',  // 索引
      score: 597831,  // 分数
      typeDisp: 'Equity',  // 类型显示
      longname: 'Alphabet Inc.',  // 全称
      isYahooFinance: true  // 是否为雅虎财经
    },
    {
      index: '5167b830a941ed08d275f74473d13e91',
      name: 'Google for Startups',  // 名称
      permalink: 'google-for-entrepreneurs',  // 永久链接
      isYahooFinance: false  // 是否为雅虎财经
    },
    {
      index: '26e6817312a98f234d2fcf80fa1abc1c',
      name: 'Google Cloud Platform',  // 名称
      permalink: 'google-cloud-platform',  // 永久链接
      isYahooFinance: false  // 是否为雅虎财经
    }
  ],
  news: [],
  nav: [],
  lists: [],
  researchReports: [],
  totalTime: 20,  // 总时间
  timeTakenForQuotes: 414,  // 获取报价所用时间
  timeTakenForNews: 0,  // 获取新闻所用时间
  timeTakenForAlgowatchlist: 400,  // 获取算法关注列表所用时间
  timeTakenForPredefinedScreener: 400,  // 获取预定义筛选器所用时间
  timeTakenForCrunchbase: 400,  // 获取Crunchbase所用时间
  timeTakenForNav: 400,  // 获取导航所用时间
  timeTakenForResearchReports: 0  // 获取研究报告所用时间
}
```

**注意：** 上述示例输出并未涵盖所有可能的返回结果，这些结果可能会因资产类型甚至交易时段（交易期间）而异。有关我们涵盖的所有内容以及您可能获得的返回结果的详尽列表，请参阅 https://github.com/gadicc/node-yahoo-finance2/blob/devel/src/modules/search.ts 中的 TypeScript 接口。

另请参见：[autoc](./autoc.md)（自动完成）。

## API

```js
await yahooFinance.search(query, queryOptions, moduleOptions);
```

### 查询词

查询词是您在 https://finance.yahoo.com/ 顶部搜索框中输入的任何内容。
该文本为“搜索新闻、符号、公司”。

我们发现有用的内容包括：列出SEDOL。

### 查询选项

| 名称                      | 类型      | 默认值    | 描述                                |
| ------------------------- | ----------| ---------- | ----------------------------------- |
| `lang`                    | string    | "en-US"    | 语言                                |
| `region`                  | string    | "US"       | 区域                                |
| `quotesCount`             | number    | 6          | 返回的最大报价数量                  |
| `newsCount`               | number    | 4          | 返回的最大新闻条目数量              |
| `enableFuzzyQuery`        | boolean   | false      | 启用模糊查询                       |
| `quotesQueryId`           | string    | "tss_match_phrase_query" | 报价查询ID       |
| `multiQuoteQueryId`       | string    | "multi_quote_single_token_query" | 多报价查询ID   |
| `newsQueryId`             | string    | "news_cie_vespa" | 新闻查询ID                      |
| `enableCb`                | boolean   | true       | 启用Cb                            |
| `enableNavLinks`          | boolean   | true       | 启用导航链接                       |
| `enableEnhancedTrivialQuery` | boolean | true       | 启用增强的简单查询                |

### 模块选项

请参阅 [常见选项](../README.md#common-options)。

---

这是关于如何使用 `yahoo-finance2` 包中的搜索功能的详细指南。该功能允许您在雅虎财经中搜索新闻、符号和公司，并返回相关结果。通过调整查询选项，您可以自定义返回的结果数量和类型，以满足您的需求。

希望这篇文章能帮助您更好地理解和使用 `yahoo-finance2` 包中的搜索功能。如有任何问题，请随时联系我。

---


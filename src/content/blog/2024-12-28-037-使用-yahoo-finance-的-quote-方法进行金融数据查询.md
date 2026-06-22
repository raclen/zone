---
title: "使用 Yahoo Finance 的 `quote` 方法进行金融数据查询"
description: "在金融数据查询中， 是一个非常强大的工具，它提供了丰富的功能用于获取各种类型的金融市场数据。其中， 方法可以帮助开发者快速查询股票、期权等资产的详细信息。本文将介绍  方法的使用方式，包括其输入参数、返回数据结构以及各字段的具体含义。  ---  ** 方法的使用**  **基本用法**..."
pubDate: 2024-12-28T05:30:52Z
updatedDate: 2024-12-28T05:32:12Z
issueNumber: 37
issueUrl: https://github.com/raclen/raclen.github.io/issues/37
tags: ["idea"]
author:
  name: "raclen"
  avatar: "https://avatars.githubusercontent.com/u/7697758?v=4"
draft: false
---

在金融数据查询中，`yahoo-finance2` 是一个非常强大的工具，它提供了丰富的功能用于获取各种类型的金融市场数据。其中，`quote` 方法可以帮助开发者快速查询股票、期权等资产的详细信息。本文将介绍 `quote` 方法的使用方式，包括其输入参数、返回数据结构以及各字段的具体含义。

---

## **`quote` 方法的使用**

### **基本用法**

以下是 `quote` 方法的典型用法：

```typescript
import yahooFinance from 'yahoo-finance2';

// 查询单个股票信息
const result = await yahooFinance.quote('AAPL');
console.log(result);

// 查询多个股票信息
const results = await yahooFinance.quote(['AAPL', 'GOOGL']);
console.log(results);

// 使用字段筛选
const filteredResult = await yahooFinance.quote('TSLA', { fields: ['symbol', 'displayName'] });
console.log(filteredResult);
```

### **输入参数**

1. **`symbol`（必需）**
   - 类型：`string | string[]`
   - 描述：要查询的资产标识符，可以是单个字符串或字符串数组。例如，股票代码 `AAPL` 表示苹果公司。

2. **`queryOptions`（可选）**
   - 类型：`object`
   - 主要属性：
     - `fields`（`string[]`）：指定需要返回的字段列表。
     - `return`（`string`）：指定返回数据的结构类型，支持 `"array"`、`"map"` 和 `"object"`。

3. **`moduleOptions`（可选）**
   - 类型：`object`
   - 描述：配置通用模块选项，如缓存。

### **返回数据结构**

`quote` 方法返回的数据结构可能因查询的资产类型和当前市场状态而有所不同，但通常包括以下字段。

---

## **返回数据字段详解**

以下是 `quote` 方法返回的数据中所有可能的字段及其含义：

```typescript
interface QuoteResponse {
  // 基本信息
  symbol: string;                // 股票代码或标识符
  shortName?: string;            // 简短的公司名称
  longName?: string;             // 全称公司名称
  displayName?: string;          // 用于展示的名称
  quoteType: string;             // 类型（如 "EQUITY", "OPTION", "INDEX" 等）
  market: string;                // 所属市场（如 "us_market"）
  exchange: string;              // 交易所代码（如 "NMS" 表示纳斯达克）
  fullExchangeName?: string;     // 交易所完整名称（如 "NasdaqGS"）
  financialCurrency?: string;    // 交易货币（如 "USD"）

  // 市场状态
  marketState: string;           // 当前市场状态（如 "REGULAR", "PRE", "POST"）
  exchangeTimezoneName: string;  // 交易所所在时区名称（如 "America/New_York"）
  exchangeTimezoneShortName: string; // 交易所时区缩写（如 "EST"）
  gmtOffSetMilliseconds: number; // 与 UTC 的时间偏移（毫秒）
  tradeable: boolean;            // 是否可交易
  triggerable: boolean;          // 是否可触发交易

  // 当前价格数据
  currency: string;              // 货币单位（如 "USD"）
  regularMarketPrice: number;    // 正常交易时段当前价格
  regularMarketChange: number;   // 正常交易时段价格变动
  regularMarketChangePercent: number; // 正常交易时段价格变动百分比
  regularMarketDayHigh: number;  // 正常交易时段当天最高价
  regularMarketDayLow: number;   // 正常交易时段当天最低价
  regularMarketOpen: number;     // 正常交易时段开盘价
  regularMarketPreviousClose: number; // 昨日收盘价
  regularMarketVolume: number;   // 正常交易时段成交量

  // 盘后/盘前价格数据
  postMarketPrice?: number;      // 盘后价格
  postMarketChange?: number;     // 盘后价格变动
  postMarketChangePercent?: number; // 盘后价格变动百分比
  postMarketTime?: Date;         // 盘后数据更新时间
  preMarketPrice?: number;       // 盘前价格
  preMarketChange?: number;      // 盘前价格变动
  preMarketChangePercent?: number; // 盘前价格变动百分比
  preMarketTime?: Date;          // 盘前数据更新时间

  // 历史价格区间
  fiftyTwoWeekRange?: {          // 52周价格区间
    low: number;                 // 52周最低价
    high: number;                // 52周最高价
  };
  fiftyTwoWeekLow: number;       // 52周最低价
  fiftyTwoWeekHigh: number;      // 52周最高价
  fiftyTwoWeekLowChange: number; // 当前价格相对于52周最低价的变动
  fiftyTwoWeekLowChangePercent: number; // 当前价格相对于52周最低价的变动百分比
  fiftyTwoWeekHighChange: number; // 当前价格相对于52周最高价的变动
  fiftyTwoWeekHighChangePercent: number; // 当前价格相对于52周最高价的变动百分比

  // 均价数据
  fiftyDayAverage: number;       // 最近50天的平均价格
  fiftyDayAverageChange: number; // 当前价格相对50天均价的变化
  fiftyDayAverageChangePercent: number; // 当前价格相对50天均价的变化百分比
  twoHundredDayAverage: number;  // 最近200天的平均价格
  twoHundredDayAverageChange: number; // 当前价格相对200天均价的变化
  twoHundredDayAverageChangePercent: number; // 当前价格相对200天均价的变化百分比

  // 财务数据
  marketCap: number;             // 市值（单位：美元）
  trailingPE?: number;           // 静态市盈率（过去12个月）
  forwardPE?: number;            // 动态市盈率（未来12个月）
  priceToBook?: number;          // 市净率
  bookValue?: number;            // 每股账面价值
  epsTrailingTwelveMonths?: number; // 每股收益（过去12个月）
  epsForward?: number;           // 预计每股收益（未来12个月）
  epsCurrentYear?: number;       // 本年每股收益
  priceEpsCurrentYear?: number;  // 本年市盈率

  // 成交信息
  bid: number;                   // 买盘价格
  ask: number;                   // 卖盘价格
  bidSize: number;               // 买盘数量
  askSize: number;               // 卖盘数量

  // 股息和分红
  trailingAnnualDividendRate?: number; // 过去12个月的股息率
  trailingAnnualDividendYield?: number; // 过去12个月的股息收益率
  dividendDate?: Date;           // 下一次股息分配日期

  // 其他数据
  earningsTimestamp?: Date;      // 下次财报发布时间
  earningsTimestampStart?: Date; // 财报发布时间窗口的起点
  earningsTimestampEnd?: Date;   // 财报发布时间窗口的终点
  firstTradeDateMilliseconds?: Date; // 股票的首次交易日期
  averageDailyVolume3Month: number; // 最近3个月日均成交量
  averageDailyVolume10Day: number; // 最近10天日均成交量
  sourceInterval: number;        // 数据更新时间间隔（秒）
  exchangeDataDelayedBy: number; // 数据延迟时间（秒）

  // 可能的特殊值
  quoteSourceName?: string;      // 数据来源（如 "Nasdaq Real Time Price"）
  esgPopulated?: boolean;        // 是否包含 ESG 数据
}
```

---

## **总结**

`quote` 方法通过灵活的输入参数和丰富的输出字段，能够满足开发者对金融市场数据的多样化需求。无论是股票还是期权，该方法都能快速返回详细的实时或历史数据。

如果你对 `yahoo-finance2` 的其他功能感兴趣，欢迎深入探索其文档或尝试更多模块。



---


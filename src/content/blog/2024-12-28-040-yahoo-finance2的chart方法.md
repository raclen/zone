---
title: "yahoo-finance2的chart方法"
description: "是一个用于获取雅虎财经数据的 JavaScript 库。  方法用于获取股票或其他金融工具的价格图表数据。以下是  方法的所有输入参数和输出参数的解释：  输入参数  -  (string): 要获取图表数据的股票或金融工具的符号。例如， 代表苹果公司。  -  (object): 一个..."
pubDate: 2024-12-28T05:50:56Z
updatedDate: 2024-12-28T05:50:56Z
issueNumber: 40
issueUrl: https://github.com/raclen/raclen.github.io/issues/40
tags: []
author:
  name: "raclen"
  avatar: "https://avatars.githubusercontent.com/u/7697758?v=4"
draft: false
---

`yahoo-finance2` 是一个用于获取雅虎财经数据的 JavaScript 库。 `chart` 方法用于获取股票或其他金融工具的价格图表数据。以下是 `chart` 方法的所有输入参数和输出参数的解释：

### 输入参数

- `symbol` (string): 要获取图表数据的股票或金融工具的符号。例如，`AAPL` 代表苹果公司。

- `options` (object): 一个可选的配置对象，包含以下属性：

  - `interval` (string): 数据的时间间隔。例如：
    - `1m` - 1 分钟
    - `2m` - 2 分钟
    - `5m` - 5 分钟
    - `15m` - 15 分钟
    - `30m` - 30 分钟
    - `60m` - 60 分钟
    - `1d` - 1 天
    - `1wk` - 1 周
    - `1mo` - 1 个月
    - `3mo` - 3 个月

  - `range` (string): 数据的时间范围。例如：
    - `1d` - 1 天
    - `5d` - 5 天
    - `1mo` - 1 个月
    - `3mo` - 3 个月
    - `6mo` - 6 个月
    - `1y` - 1 年
    - `2y` - 2 年
    - `5y` - 5 年
    - `10y` - 10 年
    - `ytd` - 年初至今
    - `max` - 最大时间范围

  - `region` (string): 地区代码，例如 `US` 表示美国。

  - `lang` (string): 语言代码，例如 `en` 表示英语。

  - `events` (string): 包含的事件类型，例如 `div` 表示股息，`split` 表示拆分。

### 输出参数

`chart` 方法返回一个包含图表数据的对象，主要属性如下：

- `timestamp` (Array<number>): 时间戳数组，表示每个数据点的时间。

- `indicators` (object): 包含多种指标数据的对象：
  - `quote` (Array<object>): 包含报价数据的对象数组：
    - `open` (Array<number>): 开盘价数组。
    - `close` (Array<number>): 收盘价数组。
    - `high` (Array<number>): 最高价数组。
    - `low` (Array<number>): 最低价数组。
    - `volume` (Array<number>): 成交量数组。

  - `adjclose` (Array<object>): 调整后收盘价数据的对象数组。

- `meta` (object): 包含元数据的对象，包括：
  - `currency` (string): 货币代码，例如 `USD`。
  - `symbol` (string): 股票或金融工具的符号。
  - `exchangeName` (string): 交易所名称。
  - `instrumentType` (string): 金融工具类型。
  - `firstTradeDate` (number): 首次交易日期的时间戳。
  - `regularMarketTime` (number): 正常市场交易时间的时间戳。
  - `gmtoffset` (number): GMT 偏移量。
  - `timezone` (string): 时区名称。
  - `exchangeTimezoneName` (string): 交易所时区名称。
  - `regularMarketPrice` (number): 正常市场价格。
  - `chartPreviousClose` (number): 上一个收盘价。
  - `previousClose` (number): 前一个收盘价。
  - `scale` (number): 比例。
  - `priceHint` (number): 价格提示。

### 示例代码

```javascript
const yahooFinance = require('yahoo-finance2').default;

(async () => {
  const symbol = 'AAPL';
  const options = { interval: '1d', range: '1mo' };
  
  try {
    const result = await yahooFinance.chart(symbol, options);
    console.log(result);
  } catch (error) {
    console.error(error);
  }
})();
```

以上代码演示了如何使用 `chart` 方法获取苹果公司过去一个月的日线图表数据。

---

💬 **[在 GitHub Issue 讨论这篇文章](https://github.com/raclen/raclen.github.io/issues/40)**

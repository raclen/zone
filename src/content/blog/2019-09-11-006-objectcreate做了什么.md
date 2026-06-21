---
title: "Object.create做了什么？"
description: "关联两个构造函数的原型,可以在继承或者创建实例（会丢失this）"
pubDate: 2019-09-11T02:20:44Z
updatedDate: 2019-09-11T03:19:33Z
issueNumber: 6
issueUrl: https://github.com/raclen/raclen.github.io/issues/6
tags: ["idea"]
author:
  name: "raclen"
  avatar: "https://avatars.githubusercontent.com/u/7697758?v=4"
draft: false
---

关联两个构造函数的原型,可以在继承或者创建实例（会丢失this）
```javascript
    function create(Base) {
      let Fn = function() {};
      Fn.prototype = Base;
      return new Fn();
    }
    let s3 = create(Student.prototype);
```

---

💬 **[在 GitHub Issue 讨论这篇文章](https://github.com/raclen/raclen.github.io/issues/6)**

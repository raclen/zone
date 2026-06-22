---
title: "认识__proto__和prototype"
description: "首先来批评一下这张图吧，画的真差，看睡着了，醒过来才看懂 我们给它标个序号，来分析一下     举个例子  第一步：  第二步： 这一步没有谁等于谁，谁指向谁 第三步：  第四步：  第五步： 这一步没有谁等于谁，谁指向谁 第六步：  第七步： 这一步没有谁..."
pubDate: 2019-09-08T10:32:11Z
updatedDate: 2024-12-30T02:30:52Z
issueNumber: 1
issueUrl: https://github.com/raclen/raclen.github.io/issues/1
tags: ["idea"]
author:
  name: "raclen"
  avatar: "https://avatars.githubusercontent.com/u/7697758?v=4"
draft: false
---

首先来批评一下这张图吧，画的真差，看睡着了，醒过来才看懂
我们给它标个序号，来分析一下

![image](https://user-images.githubusercontent.com/7697758/64487068-448c7c00-d268-11e9-999d-c8956e352883.png)


举个例子
```javascript
    function People(name, age) {
      this.name = name;
      this.age = age;
    }
    People.prototype.run = function() {
      return "i im run --";
    };

    function Student(name, age, sex) {
      People.call(this, name, age);
      this.sex = sex;
    }
    Student.prototype.speak = function() {
      return "i im speak";
    };
    // Object.setPrototypeOf(Student.prototype, People.prototype);

    let s1 = new Student("悟空", 23);
    let p1 = new People("吴京", 24);
    console.log("s1.name", s1.name);
    // console.log("p1", p1.speak());
    // console.log("s1.run", s1.run());
   //console.log(Student.__proto__ == Function.prototype);
```
第一步：
`s1.__proto__===Student.prototype`
第二步：
这一步没有谁等于谁，谁指向谁
第三步：
`Student.prototype.__proto__ === Object.prototype`
第四步：
`Student.__proto__ === Function.prototype`
第五步：
这一步没有谁等于谁，谁指向谁
第六步：
`Object.__proto__ === Function.prototype`
第七步：
这一步没有谁等于谁，谁指向谁
第八步：
`Function.prototype.__proto__ === Object.prototype`

总结一下
* 对象的__proto__指向它的构造函数原型；
* 只有函数对象才同时有__proto__和prototype，他们的__proto__指向它的父级或者Function.prototype,
而它prototype的不指向到谁，是被指向的，也就是__proto__是获取对象原型的连接符，而prototype就是原型；
* 函数对象的原型的__proto__指向的是它父级的原型
* 对象的__proto__最终都指向到Object.prototype，而Object.prototype的__proto__指向了null






---


---
title: "hasOwnProperty的作用"
description: "hasOwnProperty 作用是在一个对象里面找是否有某个属性或对象， 但是不会在它的原型中找， 返回boolean类型 一般用来过滤for in循环， 在for in循环中， 会遍历对象原型中的属性， 如果JS代码太多， 封装了一些组件， 大概就是模块化开发那种， 一个对象继承另一个对象， 你..."
pubDate: 2014-12-05T12:33:50.000Z
issueNumber: 32
issueUrl: https://github.com/raclen/zone/issues/32
tags: ["legacy", "JavaScript"]
author:
  name: "raclen"
  avatar: "https://avatars.githubusercontent.com/u/7697758?v=4"
draft: false
---


hasOwnProperty 作用是在一个对象里面找是否有某个属性或对象， 但是不会在它的原型中找， 返回boolean类型 一般用来过滤for in循环， 在for in循环中， 会遍历对象原型中的属性， 如果JS代码太多， 封装了一些组件， 大概就是模块化开发那种， 一个对象继承另一个对象， 你或许不知道这个对象继承了哪个对象， 就可以在遍历的时候用hasOwnProperty过滤了
```javascript
Object.prototype.bar = 1;
var foo = {
    moo: 2
};
foo.constructor.prototype.hi = 6;
for (var i in foo) {
    console.log(i); // 输出两个属性：bar 和 moo,hi
}
for (var i in foo) {
    if (foo.hasOwnProperty(i)) {
        console.log("hasOwnProperty过滤后的i-----" + i); //moo

    }
}
```
在这里还涉及到一个知识点， 对象实例设置不了原型属性， 要用到constructor关键字， 还有点比较奇怪的， hasOwnProperty不是js关键字， 所以编译器可能不会变色， 也没有提示， 所以JS也没有保护它， 你也可以自己定义一个hasOwnProperty函数， 所以我们尽量避免这样的命名


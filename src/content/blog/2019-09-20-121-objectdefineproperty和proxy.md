---
title: "Object.defineProperty和Proxy"
description: "${hero.name}${hero.name}to ${value}  扩展阅读"
pubDate: 2019-09-20T09:07:08Z
issueNumber: 121
issueUrl: https://github.com/raclen/zone/issues/121
tags: ["idea"]
author:
  name: "raclen"
  avatar: "https://avatars.githubusercontent.com/u/7697758?v=4"
draft: false
---


```javascript
let hero = {
  name: '赵云',
  age: 25,
  arms: ['枪', '长刀']
}
let handler = {
  // get(hero,name,obj){
  //   // console.log("hero===========",hero) // 监测的对象
  //   // console.log("name===========",name) // 当前改变的key
  //   let heroName = `${hero.name}`
  //   return heroName
  //
  // },
  set(hero, name, value){
    // console.log("hero===========",hero)  // 对象
    console.log("name===========", name)  // 改变的key
    // console.log("value===========",value)  // 改变后的值
    // 这里就可以做一些拦截操作，比如，不允许为某个值，检测到 就return
    console.log("set===========", `${hero.name}to ${value}`)
    hero[name] = value
    return true
  }
}
// let heroProxy = new Proxy(hero,handler);
// heroProxy.name = '白起';

let heroProxy1 = new Proxy(hero.arms, handler);
console.log("===========", heroProxy1)
heroProxy1.push('剑')
console.log("===========", hero)

let obj1 = {
  name: ''
}


let index = 0;
let objProxy = new Proxy(obj1, {
  get(obj, name){
    if (name == 'name') {
      let value = ''
      if (index == 0) value = 'a';
      if (index == 1) value = 'b';
      if (index == 2) value = 'c'
      index++;
      return value

    }


  }
})
console.log("===========", objProxy.name == 'a' && objProxy.name == 'b' && objProxy.name == 'c');//true

let index1 = 0;
let window1 = {
  q: ''
}

// 注意这里不能监测window
Object.defineProperty(window1, 'q', {
  get(){
    let value = '';
    if (index1 == 0) value = 'a';
    if (index1 == 1) value = 'b';
    if (index1 == 2) value = 'c';
    index1++
    return value

  }
})
console.log("q===========", window1.q == 'a' && window1.q == 'b' && window1.q == 'c');//true

let w = {}
let index3 = 0;
w.valueOf = function (v) {
  let value = '';
  if (index3 == 0) value = 'a';
  if (index3 == 1) value = 'b';
  if (index3 == 2) value = 'c';
  ;
  index3++
  return value
}
console.log("w===========", w == 'a' && w == 'b' && w == 'c');//true

```

### 扩展阅读
[深入实践 ES6 Proxy & Reflect](https://zhuanlan.zhihu.com/p/60126477)

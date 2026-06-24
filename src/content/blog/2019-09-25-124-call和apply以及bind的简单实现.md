---
title: "call和apply以及bind的简单实现"
pubDate: 2019-09-25T03:49:28Z
issueNumber: 124
issueUrl: https://github.com/raclen/zone/issues/124
tags: ["JavaScript", "idea"]
author:
  name: "raclen"
  avatar: "https://avatars.githubusercontent.com/u/7697758?v=4"
draft: false
---


```javascript

Function.prototype.call2 = function(context,...args){
  // console.log("arguments===========",arguments)
  // // let fn = this;
  // let args = Array.prototype.slice.apply(arguments);
  // // let args = args.shift();
  // console.log("args===========",args)
  // args.shift();
  context.fn = this;
  context.fn(...args);
  delete context.fn

}

let obj = {name:'11'}
function test(a,b){
  console.log("===========",this.name);
  console.log("a===========",a);
  console.log("b===========",b);
}

// test.call2(obj,'aa','bb');

Function.prototype.apply2  = function(context,args){
  context.fn = this;
  context.fn(args);
  delete context.fn


}

// test.apply2(obj,['aa','bb']);

Function.prototype.bind2 = function(context,...agrs){
   context.fn  = this;
   return function(){
      return context.fn.call(context,...agrs)
   }

}
let test1= test.bind2(obj,'aa','bb');
test1();
```

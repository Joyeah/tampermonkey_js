// ==UserScript==
// @name         zhihu-cleaner
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  解决禁止选择复制的问题
// @author       You
// @match        https://zhuanlan.zhihu.com/p/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @grant        none
// ==/UserScript==
function denyEvent() {
  window.addEventListener(
    "copy",
    function (e) {
      e.stopPropagation();
    },
    true
  );
  window.addEventListener(
    "select",
    function (e) {
      e.stopPropagation();
    },
    true
  );
//   HTMLElement.prototype.addEventListener = function () {};

  let oldadd = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function (...args) {
    console.log("addEventListener", ...args);
    oldadd.call(this, ...args);
  };
}
denyEvent();


(function() {
    'use strict';
    moveToRoot();
    removeClass();
    var intvl2 = setInterval(removeScripts, 1000);
    var intvl3 = setInterval(removeOtherNodes, 2000);

    setTimeout(()=>{
        clearInterval(intvl2);
        clearInterval(intvl3);
    }, 20000);    
})();


function moveToRoot(){
    var article = document.querySelector("article");
    // var article2 = article.cloneNode(true);
    // article.remove();
    document.body.appendChild(article);
}

/**
 * 移动class，避免下拉时动态添加防复制事件
 */
function removeClass(){
    var article = document.querySelector("article");
    article.classList.forEach((item) => {
        article.classList.remove(item);
    });
    document.body.classList.forEach(item=>{
        document.body.classList.remove(item);
    })
}
function removeOtherNodes() {
      var divs = document.body.childNodes;
      for (let i = divs.length - 1; i >= 0; i--) {
        const e = divs[i];
        if (e.tagName.toLowerCase() != "article") {
          e.remove();
        }
      }
}
function removeScripts(){
    var scripts = document.scripts;
    for (let i = scripts.length-1; i>=0; i--) {
        const s = scripts[i];
        s.remove();
    }
}
// ==UserScript==
// @name         huxiumoment-TextCleaner
// @namespace    http://www.github.com/joysong
// @version      0.1
// @description  文本清洗(去掉无用的标签）-huxiu-moment
// @author       You
// @match        https://www.huxiu.com/moment/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=huxiu.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    setInterval(clean, 3000);
    removeOnce();
})();

function removeOnce() {
  // document.querySelectorAll(".viewer-container").forEach((e) => e.remove());

  // var ee = document.querySelectorAll("section");
  // ee.forEach((e) => e.remove());

  // for (let i = document.scripts.length - 1; i >= 0; i--) {
  //   const element = document.scripts[i];
  //   element.remove();
  // }
}
function clean(){
  var e = document.querySelector("#header-nav");
  if (e) {
    e.remove();
  }
  e = document.querySelector(".moment-date");
  if (e) {
    e.remove();
  }
  e = document.querySelector("footer");
  if (e) {
    e.remove();
  }

  var ee = document.querySelectorAll(".user-info");
  ee.forEach((e) => e.remove());

  ee = document.querySelectorAll(".origin-link");
  ee.forEach((e) => e.remove());

  ee = document.querySelectorAll(".moment-operate-wrap");
  ee.forEach((e) => e.remove());

  ee = document.querySelectorAll(".moment-comment-box");
  ee.forEach((e) => e.remove());
  ee = document.querySelectorAll(".moment-comment-wrap");
  ee.forEach((e) => e.remove());

  ee = document.querySelectorAll("svg");
  ee.forEach((e) => e.remove());

  //除首行外移除
  var ps = document.querySelectorAll(".plain-text");
  for (let i = 0; i < ps.length - 1; i++) {
    const ele = ps[i];
    for (let j = ele.childNodes.length - 1; j > 1; j--) {
        try {
            ele.childNodes[j].remove();
        } catch (error) {
            console.error(error);
        }
        
      //   const n = e.childNodes[j];
      //   if (n.nodeType === Node.TEXT_NODE && j > 1) {}
    }
    ele.classList.remove("plain-text"); //避免第二次被查到
  }

  // ee = document.querySelectorAll(".moment-images");
  // ee.forEach((e) => e.remove());

  // ee = document.querySelectorAll(".comment");
  // ee.forEach((e) => e.remove());
}
// ==UserScript==
// @name         CSDNCleaner
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://blog.csdn.net/*/article/details/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @grant        none
// ==/UserScript==
var intl = null;

function denyEvent() {
  window.addEventListener(
    "copy",
    function (e) {
      e.stopPropagation();
    },
    true
  );

  HTMLElement.prototype.addEventListener = function () {};

  let oldadd = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function (...args) {
    console.log("addEventListener", ...args);
    oldadd.call(this, ...args);
  };
}
denyEvent();

(function () {
  "use strict";
  // cleanLoginDeny();
  
  moveContentToRoot();
  
  intl = setInterval(clean, 2000);
  setTimeout(()=>{
    // clearInterval(intl);
    // removeAllEvtListeners();
    cleanCssSelectNone();
  }, 15000)
  
})();
/**清除CSS中的禁止选择
 *  -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
 */
function cleanCssSelectNone(){

  var codes = document.querySelectorAll("#content_views pre code");
  codes.forEach(c=>c.style.setProperty('userSelect', 'text'));
  codes.forEach((c) => c.style.setProperty("user-select", "text"));
  codes.forEach((c) => c.style.setProperty("-ms-user-select", "text"));
  codes.forEach((c) => c.style.setProperty("-moz-user-select", "text"));
  codes.forEach((c) => c.style.setProperty("-khtml-user-select", "text"));
  codes.forEach((c) => c.style.setProperty("-webkit-user-callout", "text"));

  
  var pres = document.querySelectorAll("#content_views pre");
  pres.forEach((c) => c.style.setProperty("userSelect", "text"));
  pres.forEach((c) => c.style.setProperty("user-select", "text"));
  pres.forEach((c) => c.style.setProperty("-ms-user-select", "text"));
}


function cleanLoginDeny(){
  document.querySelectorAll("signin").forEach((item) => item.remove()); 
  document.querySelectorAll('code').forEach(item=>{
    item.classList.remove("language-js");
    
    //remove event litener
    delEvtListeners(item)
  })
  document.querySelector(".passport-login-container").remove();
}

function removeAllEvtListeners(){
  for (let i = 0; i < document.body.children.length; i++) {
    var node = document.body.children[i];
    if (node.nodeType == Document.ELEMENT_NODE && ! ['LINK','STYLE','A'].includes(node.nodeName)){
      removeEvtListeners(document.body.children[i]);
    }
  }
}
function removeEvtListeners(dom){
  if(dom.childElementCount>0){
    for (let i = 0; i < dom.childElementCount; i++) {
      removeEvtListeners(dom.children[i]);
    }
  }
  delEvtListeners(dom);
}
function delEvtListeners(dom){
  //非console模式下getEventListenes()无效
  var listeners = getEventListeners(dom);
  Object.keys(listeners).forEach((k) => {
    var events = listeners[k];
    // if(k == 'click'||k=='copy'||k=='focus'||k=='keydown'||k=='keyup')
    events.forEach((event) => {
      dom.removeEventListener(k, event.listener, event.useCapture);
    });
  });
}

function moveContentToRoot() {
  var n = 0;
  var h = document.querySelector("h1.title-article");
  if (h) {
    n++;
    document.body.appendChild(h);
  }

  //document.querySelector('link[href*=markdown]')
  // var d = document.querySelector("#content_views");
  var d = document.querySelector("#article_content");
  if (d) {
    n++;
    document.body.appendChild(d);
  }
  if(n==2){
    clearInterval(intl);
  }
  return n;
}

function clean() {
  
  var scripts = document.scripts;
  for (let i = scripts.length - 1; i >= 0; i--) {
    const s = scripts[i];
    s.remove();
  }
  
  var arr = document.body.children;
  for (var i = arr.length-1; i >= 0; i--) {
    if (
      arr[i].tagName == "h1" ||
      (arr[i].getAttribute("id") && 
        (arr[i].getAttribute("id")) == "content_views" 
          || arr[i].getAttribute("id") == "article_content")
    ){
        continue;
    }
    arr[i].remove();
  }

  //login iframe 
  document.querySelectorAll("iframe").forEach((iframe) => iframe.remove()); 
  //document.querySelector(".passport-login-container").remove();
  //click事件
  document.querySelectorAll('code').forEach(d=>{
    d.removeAttribute('onclick');
  });
}

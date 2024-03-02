// ==UserScript==
// @name         MSNCleaner
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  clean msn article ads!
// @author       Yusen
// @match        https://www.msn.cn/zh-cn/news/*
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
  setTimeout(()=>{
    clean()
  }, 300)

  
})();
/**清除CSS中的禁止选择
 *  -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
 */

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


function clean() {
  
  var scripts = document.scripts;
  for (let i = scripts.length - 1; i >= 0; i--) {
    const s = scripts[i];
    s.remove();
  }
  //header
  //document.querySelectorAll("div[class*=articleHeader]").forEach(ele=>ele.remove());
  //msn-article
  const div = document.querySelector("msn-article");
  div.shadowRoot.querySelectorAll("[class*=image]").forEach((e) => e.remove());
}
function getTextContent(){
    const dom = document.querySelector("msn-article");
    const text = dom.shadowRoot.textContent;
}

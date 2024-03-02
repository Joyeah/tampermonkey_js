// ==UserScript==
// @name         cdt
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://*.secretchina.com/news/gb/*/*.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=secretchina.com
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  initDialog();
  showText();
})();
function showText(){
    var texts = getArticle();
    console.log(texts);
    document.querySelector("#_title").innerText = texts[0];
    document.querySelector('#_content').value = texts[0] +'\r\n\r\n'+ texts[1];
}
function getArticle(){
    var title = document.querySelector("h1").innerText;
    var doms = document.querySelectorAll(".article_right p");
    var txts = [];
    doms.forEach(e => {
        if(! e.hasAttribute('style') && ! e.hasAttribute('class')){
            txts.push(e.innerText);
        }
    });

    return [title, txts.join('\r\n')];
}


  function loadStyles(url) {
    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = url;
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(link);
  }
  function loadStyleString(css) {
    var style = document.createElement("style");
    style.type = "text/css";
    try {
      style.appendChild(document.createTextNode(css));
    } catch (ex) {
      style.styleSheet.cssText = css;
    }
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(style);
  }
  function initDialog() {
    //loadStyles('https://cdn.bootcss.com/jqueryui/1.12.1/jquery-ui.min.css');
    loadStyleString(
      ".tm_layer{display: block;z-index:9999;position: fixed;top: 30px;right: 15px;width:300px;height:800px;background-color: lightgray;}\
        #_title{font-size:2em;} \
        #_content{width:300px;height:680px;} \
        "
    );

    var _father = document.createElement('div');
    _father.className = 'tm_layer';
    document.body.appendChild(_father);

    var row1 = document.createElement('div');
    var row2 = document.createElement('textarea');
    row1.id = '_title';
    row2.id = '_content'
    _father.appendChild(row1);
    _father.appendChild(row2);
  }

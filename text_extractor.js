// ==UserScript==
// @name         Z-Text Extractor
// @namespace    http://tampermonkey.net/
// @version      2024-02-18
// @description  Article Content Text Extractor
// @author       You
// @include         https://blog.creaders.net/u/*.html
// @include        https://www.msn.cn/zh-cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=creaders.net
// @grant        none
// ==/UserScript==

(function () {
  "use strict";


})();

function analyzeCurrentPage(){
    var href = document.location.href;
    if (href.startsWith("https://blog.creaders.net/")) {
      blog_creaders();
    } else if (href.startsWith("https://www.msn.cn/zh-cn/news/")) {
      msn_cn();
    }
    
}
function blog_creaders(){
    var arr = [];
    var title = document.querySelector("a.diary_title").text;
    arr.push(title);
    //var content = document.querySelector(".diary_content").textContent;
    var ps = document.querySelectorAll(".diary_content>p");
    ps.forEach(e=>arr.push(e.textContent));
    try {
        document.getElementById("row1").textContent = arr.join('\n');
    } catch (error) {
        console.error(error)
    }
}
function msn_cn() {
  //cp-article,msn-article
  var arr = [];
  var dom = document.querySelector("cp-article");
  if(dom && dom.shadowRoot && dom.shadowRoot.isConnected){
    arr.push(dom.data.title);
    dom.data.body.querySelectorAll('p').forEach(e=>{
      arr.push(e.textContent);
    })
  }
 
  try {
    document.getElementById("row1").textContent = arr.join("\n");
  } catch (error) {
    console.error(error);
  }
}

//////////////////////////////////////////
// TTS
// ref: https://mdn.github.io/dom-examples/web-speech-api/speak-easy-synthesis/
const synth = window.speechSynthesis;
const voices = synth.getVoices().filter((e) => e.name.includes("Natural") && e.name.includes("Chinese"));
// voices.filter(e=>e.name.includes('Xiaoxiao'))
function speak() {
  if (synth.speaking) {
    console.error("speechSynthesis.speaking");
    return;
  }
  const txt = document.getElementById("row1").textContent;
  if (txt !== "") {
    const utterThis = new SpeechSynthesisUtterance(txt);

    utterThis.onend = function (event) {
      console.log("SpeechSynthesisUtterance.onend");
    };

    utterThis.onerror = function (event) {
      console.error("SpeechSynthesisUtterance.onerror");
    };

    var i = (voices.length * Math.random()).toFixed();
    utterThis.voice = voices[i];
    utterThis.pitch = 1;
    utterThis.rate = 1;
    synth.speak(utterThis);
  }
}
//end TTS
////////////////////////////////////


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
    style.nodeType = "text/css";
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
      ".tm_layer{z-index:9999;display: block;position: fixed;top: 30px;right: 15px;width:300px;height:200px;background-color: lightgray;}\
        .tm_btn{display: inline-block;color: darkblue;background-color: lightskyblue;border-radius: 5px;padding: 2px;} \
        .lbl{display:flex; justify-content:space-between;}.lbl>input{flex-grow:1;}"
    );

    var _father = document.createElement("div");
    _father.className = "tm_layer";
    document.body.appendChild(_father);

    var row1 = document.createElement("textarea");
    row1.id = "row1";
    row1.style="width:312px;height:485px;";
    _father.appendChild(row1);

    var btn1 = document.createElement("button");
    btn1.innerText = "提取文字";
    btn1.addEventListener("click", analyzeCurrentPage);
    _father.appendChild(btn1);

    var btn2 = document.createElement("button");
    btn2.innerText = "语音播放";
    btn2.addEventListener("click", speak);
    _father.appendChild(btn2);
  }

var dom = document.querySelector("tm_layer");
if (!dom) initDialog();
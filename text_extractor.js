// ==UserScript==
// @name         Z-Text Extractor
// @namespace    http://tampermonkey.net/
// @version      2024-02-18
// @description  Article Content Text Extractor
// @description_cn  文本提取
// @author       Yusen
// @include         https://blog.creaders.net/u/*.html
// @include        https://wallstreetcn.com/articles/*
// @include        https://www.msn.cn/zh-cn/news/*
// @include        https://www.huxiu.com/moment/
// @include        https://www.zhihu.com/question/*/answer/*
// @include        https://chinadigitaltimes.net/*.html
// @include        https://world.huanqiu.com/article/*
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
    } else if (href.startsWith("https://www.huxiu.com/moment/")) {
      huxiu_moment();
    } else if (href.startsWith("https://www.zhihu.com/question/")) {
      zhihu_question();
    } else if (href.startsWith("https://chinadigitaltimes.net/")) {
      chinadigitaltimes();
    } else if (href.startsWith("https://wallstreetcn.com/")) {
      wallstreetcn();
    } else if (href.startsWith("https://world.huanqiu.com/article")) {
      huanqiu()
    } else if (href.startsWith("http://127.0.0.1")) {
      document.getElementById("row1").textContent = document.body.textContent;
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
        document.querySelector("#row1").select();
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
    document.querySelector("#row1").select();
  } catch (error) {
    console.error(error);
  }
}

function huxiu_moment(){
  var arr = [];
  var texts = document.querySelectorAll(".plain-text-wrap");
  texts.forEach(e => arr.push(e.innerText));
  try {
    document.getElementById("row1").textContent = arr.join("\n");
    // document.getElementById("row1").ariaSelected();
    document.querySelector("#row1").select();
  } catch (error) {
    console.error(error);
  }
}
function zhihu_question(){
  var arr = [];
  var texts = document.querySelectorAll(".RichContent-inner p");

  texts.forEach(e => arr.push(e.innerText));
  try {
    document.getElementById("row1").textContent = arr.join("\n");
    // document.getElementById("row1").ariaSelected();
    document.querySelector("#row1").select();
  } catch (error) {
    console.error(error);
  }
}

function chinadigitaltimes(){
  // var arr = [];
  // var texts = document.querySelectorAll(".post-content p");
  // texts.forEach(e => arr.push(e.innerText));
  // var header = document.querySelector('.post-header h1 ').innerText
  var header = document.querySelector('.post-header').innerText
  var content = document.querySelector('.post-content').innerText

  try {
    document.getElementById("row1").textContent = `${header}\n${content}`
    // document.getElementById("row1").ariaSelected();
    document.querySelector("#row1").select();
  } catch (error) {
    console.error(error);
  }
}

//////////////////////////////////////////
// TTS
// ref: https://mdn.github.io/dom-examples/web-speech-api/speak-easy-synthesis/
const synth = window.speechSynthesis;
// const voices = synth.getVoices().filter((voice) => voice.name.includes("Natural") && voice.name.includes("Chinese")); 
// const voices = synth.getVoices().filter((voice) => voice.localService == true && voice.lang == 'zh-CN');
// voices.filter(e=>e.name.includes('Xiaoxiao'))
function speak() {
  if (synth.speaking) {
    console.warn("speechSynthesis.speaking, pause..");
    pauseSpeech();
    return
  }
  const txt = document.getElementById("row1").textContent;
  if (txt == "") {
    alert("No text to speak");
    return
  }
  const utterThis = new SpeechSynthesisUtterance(txt);

  utterThis.onend = function (event) {
    console.log("SpeechSynthesisUtterance.onend");
  };

  utterThis.onerror = function (event) {
    console.error("SpeechSynthesisUtterance.onerror");
  };

  // let voices = synth.getVoices().filter((voice) => voice.localService == true && voice.lang == 'zh-CN'); //本机地语音引擎
  // let voices = synth.getVoices().filter((voice) => voice.name.includes("Natural") && voice.name.includes("Chinese"));
  let lang = getLangValue()
  let voices = synth.getVoices().filter((voice) => voice.lang == lang);

  var i = (voices.length * Math.random()).toFixed();
  
  utterThis.voice = voices[i];
  utterThis.pitch = 1.5;
  utterThis.rate = 1.3;
  console.log(utterThis.voice.name)
  synth.speak(utterThis);
  document.getElementById("btn2").innerText = "⏸️";
}

function getLangValue(){
	var radios = document.getElementsByName('lang');
	for (var i = 0, length = radios.length; i < length; i++) {
		if (radios[i].checked) {
			return radios[i].value;
		}
	}
}

function stopSpeech() {
  document.getElementById("btn2").innerText = "▶️";
  synth.cancel();
}
function pauseSpeech() {
  document.getElementById("btn2").innerText = "▶️";
  synth.pause();
}
function resumeSpeech() {
  document.getElementById("btn2").innerText = "⏸️";
  synth.resume();
}
function toggleSpeech() {
  if (synth.paused) {
    resumeSpeech();
  } else {
    pauseSpeech();
  }
}


function wallstreetcn() {
  var arr = [];
  var texts = document.querySelector('article').innerText
  try {
    document.getElementById("row1").textContent = texts
    // document.getElementById("row1").ariaSelected();
    document.querySelector("#row1").select();
  } catch (error) {
    console.error(error);
  }
}
function huanqiu() {
  // shadowRoot is closed cant
  var arr = [];
  const hostElement = document.querySelector('article-container-template');
  try {
    document.getElementById("row1").textContent = texts
    // document.getElementById("row1").ariaSelected();
    document.querySelector("#row1").select();
  } catch (error) {
    console.error(error);
  }
}

function traverseShadowDOM(element) {
  if (element.shadowRoot) {
    console.log('Shadow Root内容:', element.shadowRoot.innerHTML);
    // 递归遍历Shadow DOM中的子元素
    element.shadowRoot.querySelectorAll('*').forEach(child => {
      traverseShadowDOM(child);
    });
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
        .tm_layer>button{color: #ffffff;background-color: #00a6ed;border-radius: 5px;padding: 2px;} \
        .tm_layer>input{}"
    );

    var _father = document.createElement("div");
    _father.className = "tm_layer";
    document.body.appendChild(_father);

    var row1 = document.createElement("textarea");
    row1.id = "row1";
    row1.style="width:312px;height:485px;";
    _father.appendChild(row1);

    var btn1 = document.createElement("button");
    btn1.id = "btn1";
    btn1.setAttribute('type', 'button');
    btn1.classList.add(["Button", "Button--primary", "Button--blue"]);
    btn1.innerText = "提取文字";
    btn1.addEventListener("click", analyzeCurrentPage);
    _father.appendChild(btn1);

    var btn_sel = document.createElement("button");
    btn_sel.id = "btn_sel";
    btn_sel.setAttribute('type', 'button');
    btn_sel.classList.add(["Button", "Button--primary", "Button--blue"]);
    btn_sel.innerText = "全选复制";
    btn_sel.addEventListener("click", document.getElementById("row1").select);
    _father.appendChild(btn_sel);

    var btn2 = document.createElement("button");
    btn2.id = "btn2";
    btn2.innerText = "▶️";
    btn2.addEventListener("click", speak);
    _father.appendChild(btn2);

    var btn3 = document.createElement("button");
    btn3.id = "btn3";
    btn3.innerText = "⏹️";
    btn3.addEventListener("click", stopSpeech);
    _father.appendChild(btn3);

    var radio1 = document.createElement("input");
    radio1.type = "radio";
    radio1.id = "radio1";
    radio1.name = "lang"
    radio1.value = "zh-CN"
    radio1.setAttribute('checked', 'checked')
    _father.appendChild(radio1);
    var label1 = document.createElement("label");
    label1.setAttribute('for', 'radio1')
    label1.innerText = "普通话";
    _father.appendChild(label1);

    var radio2 = document.createElement("input");
    radio2.type = "radio";
    radio2.id = "radio2";
    radio2.name = "lang"
    radio2.value = "zh-TW"
    _father.appendChild(radio2);
    var label2 = document.createElement("label");
    label2.setAttribute('for','radio2')
    label2.innerText = "台語";
    _father.appendChild(label2);

    var radio3 = document.createElement("input");
    radio3.type = "radio";
    radio3.id = "radio3";
    radio3.name = "lang"
    radio3.value = "zh-HK"
    _father.appendChild(radio3);
    var label3 = document.createElement("label");
    label3.setAttribute('for','radio3')
    label3.innerText = "粤語";
    _father.appendChild(label3);
  }

var dom = document.querySelector("tm_layer");
if (!dom) initDialog();
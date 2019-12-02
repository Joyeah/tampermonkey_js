// ==UserScript==
// @name         阿里TTS批量转语音文件
// @namespace    http://tampermonkey.net/
// @homepage     https://joyeah.github.io
// @version      0.1
// @description  通过阿里免费的TTS体验网页批量转语音
// @author       Joyeah
// @match        https://ai.aliyun.com/nls/tts
// @require      https://cdn.bootcss.com/jqueryui/1.12.1/jquery-ui.min.js
// @grant        none
// ==/UserScript==

//句子
var conds = {};
conds.sentences = [
  '这个工具还不错', 
  'IT是技术革新的引擎',
  '技术无止境', 
  '需求无止境', 
  '技能培训有很大的市场空间，教育产业化规范化。'
];
//处理逻辑：点击“立即合成”，通过改变样式后，再次模拟点击滑块；语音生成后，再发起缓存文件获得程序
//技术参考：https://www.cnblogs.com/likers/p/3937472.html
//http://www.voidcn.com/article/p-thpduaxe-bsb.html

(function () {
  'use strict';

  filter();
})();

function filter(options) {  
  options = options || conds;

  var rows = $('#resultList .el');
  for (var i = 1; i < rows.length; i++) { //第0行为标题，忽略之
    var row = rows[i];
    // var title = $(row).children(':first').children('span').text().trim();
    //添加行id,用于方便过滤
    // $(row).attr('id', `el${i}`);
    var text = $(row).text().trim();
    var hits = options.words.filter((val, idx)=>{return text.indexOf(val) != -1});
    if(hits.length > 0){
      $(row).show();
    }else{
      $(row).hide();
    }
  }

  //显示
  if (rows.length > 0) {
    show()
  }
}

function redo_filter() {
  var options = {};
  options.words = $('#__words').val()
  options.words = options.words.replace(/，|　/ig, ','); //替换全角空格，逗号为半角,
  options.words = options.words.split(',');
  filter(options);
}

function nextpage() {
  //不起作用
  // $('#rtNext').click();
  location.href = $('#rtNext').attr('href');
}

/**
 * 显示数据
 * @param {*} arr
 */
function show() {
  setTimeout(() => {
    $('#__dialog').dialog({
      width: 430, height: 200, maxHeight: 800, position: { my: "right top", at: "right center", of: window }
    });
  }, 1200);
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
  loadStyles('https://cdn.bootcss.com/jqueryui/1.12.1/jquery-ui.min.css');
  loadStyleString('.lbl{display:flex; justify-content:space-between;}.lbl>input{flex-grow:1;}');

  var html = $('<div id="__dialog" title="筛选结果"></div>');
  var html_1 = $('<div></div>');

  $(html_1).append(`<label class="lbl">关键词:<input id="__words" value="${conds.sentences.join(',')}"></label>`);
  $(html_1).append(`<label class="lbl"><button id="__search">筛选</button></label>`);
  $(html_1).appendTo(html);
  html.append('<div id="__content" ></div>')
  html.append(`<label class="lbl"><button id="__nextpage">下一页</button></label>`);
  $('body').append(html);

  $('#__search').click(function (e) {
    e.preventDefault();
    redo_filter();
  });
  $('#__words').keydown(function (e) {
    //空格 32   Enter 13   ESC 27 逗号188、229
    // console.log(e.keyCode);
    if(e.keyCode == 32 || e.keyCode == 13 || e.keyCode == 27||e.keyCode == 118||e.keyCode==229){
      redo_filter();
    }
  });

  $('#__nextpage').click(function (e) {
    e.preventDefault();
    nextpage();
  });
}
initDialog();

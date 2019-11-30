// ==UserScript==
// @name         工作筛子_二次过滤(猎聘)
// @namespace    http://tampermonkey.net/
// @homepage     https://joyeah.github.io
// @version      0.2
// @description  工作岗位筛选器,对搜索结果进行二次过滤
// @author       Joyeah
// @match        https://www.liepin.com/zhaopin/?*
// @require      https://cdn.bootcss.com/jqueryui/1.12.1/jquery-ui.min.js
// @grant        GM_notification
// ==/UserScript==

//注意：根据情况适当修改@match，以及关键词
var conds = {};
conds.words = ['经理', '主管', 'IT', '技术', '需求', '总监', '培训']; //关键词
conds.minSalary = 11; //薪水（单位K) （非必须）
conds.minEmployees = 100; //最少人数 （非必须）

(function () {
  'use strict';
  //remove ADs
  var ad = document.querySelector('.guider');
  ad.parentNode.remove();

  filter();
})();

function filter(options) {
  options = options || conds;

  var rows = $('.sojob-item-main');
  var arr = [];
  var doms = [];
  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    //.job-info, .company-info
    var pri = row.children[0];
    var com = row.children[0];
    var job = {};
    //岗位
    job.path = pri.children[0].children[0].getAttribute('href');
    job.title = pri.children[0].children[0].textContent;
    var condtion = pri.children[1];
    job.salary = condtion.children[0].textContent;

    var hits = options.words.filter((item, idx) => { return job.title.indexOf(item) != -1 }); //匹配关键词
    if (hits.length == 0) {
      continue;
    }
    if (options.minSalary && job.salary.indexOf('·') != -1 && lowSalary(job.salary, options.minSalary)) { //忽略薪水低于10K的
      continue;
    }
    job.company = com.children[0].children[0].textContent.trim();
    job.com_href = com.children[0].children[0].href;
    job.financing = com.children[1].children[0].textContent;
    var dt = pri.getElementsByTagName('time')[0];
    job.date = dt.getAttribute('title');
    job.time = dt.textContent

    arr.push(job);
    doms.push($(row).clone(true)); //克隆整个节点
  }

  //显示
  // if (doms.length > 0) {
    show(arr, doms);
  // }
}

function redo_filter() {
  var options = {};
  options.words = $('#__words').val().split(',');
  options.minSalary = $('#__salary').val();
  options.minEmployees = $('#__num').val();
  filter(options);
}

function nextpage() {  
  var btns = $('a:contains("下一页")');
  if(btns.length){
    btns[0].click()
  }
}
/**
 * 判断低薪岗位
 * @param {*} salary 薪水:11-17k·12薪
 * @param {*} n 低于此值时返回true
 */
function lowSalary(salary, n) {
  if(salary.indexOf('-') ==-1){
    return false;
  }
  var ss = salary.split('.')[0];
  var s1 = ss.split('-')[1]; //上限
  s1.replace('k', '');
  s1 = Number.parseInt(s1);
  if (s1 < n) {
    return true;
  }
  
  return false;
}
/**
 * 判断人数范围
 * @param {*} range 低于n时返回true
 * @param {*} n
 */
function lessEmployee(range, n) {
  if (range.indexOf('-') == -1) { //似乎不存在此情况
    return true;
  } else {
    var s1 = range.split('-')[1];
    s1.replace('人', '');
    s1 = Number.parseInt(s1);
    if (s1 < n) {
      return true;
    }
  }
  return false;
}

/**
 * 显示数据
 * @param {*} arr
 */
function show(arr, doms) {
  setTimeout(() => {
    $('#__data').text(JSON.stringify(arr));
    var old = $('#__content').children();
    if(old.length>0){
      $('#__content').empty()
      $('#__content').append(...doms);
    }else{
      $('#__content').append(...doms); //注意：不同版本的jQuery可能语法不同
      $('#__dialog').dialog({
        width: 430, height: 800, maxHeight: 800, position: { my: "right top", at: "right bottom", of: window }
      });
    }
    
    // $('#__dialog').dialog("moveToTop");
    // GM_notification('提示', '数据过滤完成');
  }, 1200);
}


function loadScript(url) {
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = url;
  document.body.appendChild(script);
}
function loadScriptString(code) {
  var script = document.createElement("script");
  script.type = "text/javascript";
  try {
    script.appendChild(document.createTextNode(code));
  } catch (ex) {
    script.text = code;
  }
  document.body.appendChild(script);
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
  // loadScript('https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js');
  // loadScript('https://cdn.bootcss.com/jqueryui/1.12.1/jquery-ui.min.js');
  loadStyleString('.lbl{display:flex; justify-content:space-between;}.lbl>input{flex-grow:1;}');
  // loadScriptString(redo_filter.toString());
  // loadScriptString(filter.toString());
  // loadScriptString(lowSalary.toString());
  // loadScriptString(lessEmployee.toString());
  // loadScriptString(show.toString());

  var html = $('<div id="__dialog" title="筛选结果"></div>');
  var html_1 = $('<div></div>');

  $(html_1).append(`<label class="lbl">关键词:<input id="__words" value="${conds.words.join(',')}"></label>`);
  $(html_1).append(`<label class="lbl">薪水下限:<input id="__salary" style="width:60px;" value="${conds.minSalary}">K&nbsp;公司规模:<input id="__num" style="width:60px;" value="${conds.minEmployees}">人</label>`);
  // $(html_1).append(`<label class="lbl"><button onclick="redo_filter()">筛选</button></label>`);
  $(html_1).append(`<label class="lbl"><button id="__search">筛选</button></label>`);
  $(html_1).appendTo(html);
  html.append('<div id="__content" ></div>')
  html.append(`<label class="lbl"><button id="__nextpage">下一页</button></label>`);
  html.append('<textarea id="__data" rows=8 style="width:99%;"></textarea>');
  $('body').append(html);

  $('#__search').click(function (e) { 
    e.preventDefault();
    redo_filter();
  });
  $('#__nextpage').click(function (e) { 
    e.preventDefault();
    nextpage();
  });

}
initDialog();


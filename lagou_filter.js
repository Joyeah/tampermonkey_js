// ==UserScript==
// @name         工作筛子_二次过滤(拉勾网)
// @namespace    http://tampermonkey.net/
// @homepage     https://joyeah.github.io
// @version      0.1
// @description  拉勾网岗位筛选器,对搜索结果进行二次过滤
// @author       Joyeah
// @match        https://www.lagou.com/jobs/list_/p-city*
// @require      https://cdn.bootcss.com/jqueryui/1.12.1/jquery-ui.min.js
// @grant        none
// ==/UserScript==

//注意：适当修改@match，以及关键词
//筛选条件
var conds = {};
conds.words = ['经理', 'IT', '技术', '需求', '培训'];
conds.minSalary = 11; //薪水（单位K)
conds.minEmployees = 100; //最少人数

(function () {
  'use strict';
  //移除底部大大的footer
  $('#footer').remove();

  filter();
})();

function filter(options) {  
  options = options || conds;

  var rows = $('.con_list_item');
  var arr = [];
  var doms = [];
  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    var top = $(row).find('.list_item_top')[0];
    var tags = $(row).find('.list_item_bot')[0];
    var pri = $(top).find('.position')[0];
    var com = $(top).find('.company')[0];

    var job = {};
    //岗位
    job.path = $(pri).find('.position_link')[0].getAttribute('href');
    job.title = $(row).find('h3').text();
    var hits = options.words.filter((item, idx) => { return job.title.indexOf(item) != -1 }); //匹配关键词
    if (hits.length == 0) {
      continue;
    }
    job.salary = $(pri).find('.money').text();
    if (options.minSalary && lowSalary(job.salary, options.minSalary)) { //忽略薪水低于10K的
      continue;
    }

    job.company = com.children[0].children[0].textContent;
    job.com_href = com.children[0].children[0].href;

    var industry = com.children[1].textContent; //移动互联网,金融 / 天使轮 / 150-500人
    var strs = industry.split('/');
    job.com_industry = strs[0].trim();
    job.com_finance = strs[1].trim();
    job.com_employeenum = strs[2].trim();
    if (options.minEmployees && lessEmployee(job.com_employeenum, options.minEmployees)) {
      continue;
    }
    //特色
    job.tag = $.map(tags.children[0].children, function (ele, idx) {
      return ele.textContent;
    });
    job.feathers = tags.children[1].textContent;
    //人事(忽略)
    //发布时间
    job.updated = $(pri).find('.format-time')[0].textContent;

    arr.push(job);
    doms.push($(row).clone(true)); //克隆整个节点
  }

  //显示
  console.log(arr);
  // if (doms.length > 0) {
    show(arr, doms)
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
  var btns = $('span:contains("下一页")');
  if (btns.length) {
    btns[0].click();
    //采用ajax请求下一页数据，延时重新过滤数据
    // setTimeout(() => {
    //   redo_filter();
    // }, 1000);
  }
}
/**
 * 判断低薪岗位(面议时，返回true)
 * @param {*} salary 薪水
 * @param {*} n 低于此值时返回true
 */
function lowSalary(salary, n) {
  if (salary.indexOf('-') == -1) { //忽略面议
    return true;
  } else {
    var s1 = salary.split('-')[1];
    s1.replace('K', '');
    s1 = Number.parseInt(s1);
    if (s1 < n) {
      return true;
    }
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
    if (old.length > 0) {
      $('#__content').empty()
      $('#__content').append(...doms);
    } else {
      $('#__content').append(...doms); //注意：不同版本的jQuery可能语法不同
      $('#__dialog').dialog({
        width: 430, height: 800, maxHeight: 800, position: { my: "right top", at: "right center", of: window }
      });
    }

    // $('#__dialog').dialog("moveToTop");
    // GM_notification('提示', '数据过滤完成');
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

  $(html_1).append(`<label class="lbl">关键词:<input id="__words" value="${conds.words.join(',')}"></label>`);
  $(html_1).append(`<label class="lbl">薪水下限:<input id="__salary" style="width:60px;" value="${conds.minSalary}">K&nbsp;公司规模:<input id="__num" style="width:60px;" value="${conds.minEmployees}">人</label>`);
  // $(html_1).append(`<label class="lbl"><button onclick="redo_filter()">筛选</button></label>`);
  $(html_1).append(`<label class="lbl"><button id="__search">筛选</button></label>`);
  $(html_1).appendTo(html);
  html.append('<div id="__content" ></div>')
  html.append(`<div class="lbl"><button id="__nextpage" style="background-color: #00b38a;color: #fff;">下一页</button></div>`);
  html.append('<textarea id="__data" rows=8 style="width:99%;"></textarea>');
  $('body').append(html);

  $('#__search').click(function (e) {
    e.preventDefault();
    redo_filter();
  });
  $('#__words').keydown(function (e) {
    //空格 32   Enter 13   ESC 27 逗号188、229
    // console.log(e.keyCode);
    if (e.keyCode == 32 || e.keyCode == 13 || e.keyCode == 27 || e.keyCode == 118 || e.keyCode == 229) {
      redo_filter();
    }
  });
  $('#__nextpage').click(function (e) {
    e.preventDefault();
    nextpage();
  });
  //检测ajax请求数据结束
  $(document).ajaxComplete(function (event, request, settings) {
    if (settings.url.startsWith('https://www.lagou.com/jobs/position')){
      redo_filter();
    }
  })
}
initDialog();

// ==UserScript==
// @name         工作筛子(猎聘)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  工作岗位筛选器
// @author       Joysee
// @match        https://www.liepin.com/zhaopin/?*&fromSearchBtn=*
// @grant        none
// ==/UserScript==

//注意：适当修改@match，以及关键词
//关键词
var words = ['经理', 'IT', '技术', '需求', '总监', '培训'];
//其它条件（非必须）
var conds = {};
conds.minSalary = 11; //薪水（单位K)
conds.minEmployees = 100; //最少人数

$('body').append('<link href="https://cdn.bootcss.com/jqueryui/1.12.1/jquery-ui.min.css" rel="stylesheet">');
$('body').append('<script src="https://cdn.bootcss.com/jqueryui/1.12.1/jquery-ui.min.js"></script>');

(function () {
  'use strict';
  //remove ADs
  var ad = document.querySelector('.guider');
  ad.parentNode.remove();


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

    var hits = words.filter((item, idx) => { return job.title.indexOf(item) != -1 }); //匹配关键词
    if (hits.length == 0) {
      continue;
    }
    if (conds.minSalary && job.salary.indexOf('.') != -1 && lowSalary(job.salary, conds.minSalary)) { //忽略薪水低于10K的
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
  if (doms.length > 0) {
    show(arr, doms)
  }
})();

/**
 * 判断低薪岗位
 * @param {*} salary 薪水:11-17k·12薪
 * @param {*} n 低于此值时返回true
 */
function lowSalary(salary, n) {
  if (salary.indexOf('-') == -1) {
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
  var textarea = $('<textarea rows=10 cols=100></textarea>').text(JSON.stringify(arr));
  $(textarea).attr('style', 'width: 99%;');
  var html = $('<div id="__dialog" title="筛选结果" style="padding:10px;width:800px;height:800px;bottom:10px;right:0;z-index:9999;display:block;position:absolute;background:#ecf6ff;border-radius:10px;box-shadow: 5px 5px 5px #888888;overflow: scroll;"></div>');
  $(html).append('<span style="width:28px;height:28px;color:red;" onclick="__dialog_close()">X</span>')
  $(html).append(...doms); //注意：不同版本的jQuery可能语法不同
  $(html).append(textarea);
  $('body').append(html);
  // $("#__dialog").dialog();
}
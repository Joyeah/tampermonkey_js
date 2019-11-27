// ==UserScript==
// @name         工作筛子(直聘网)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  直聘网岗位筛选器
// @author       Joysee
// @match        https://www.zhipin.com/c*/?ka=sel*
// @grant        none
// ==/UserScript==

//注意：适当修改@match，以及关键词
//关键词
var words = ['经理','IT','技术','需求','总监','培训'];
//其它条件（非必须）
var conds = {};
conds.minSalary = 11; //薪水（单位K)
conds.minEmployees = 100; //最少人数

(function () {
  'use strict';

  var rows = $('.job-primary');
  var arr = [];
  var doms = [];
  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    var pri = $(row).find('.info-primary')[0];
    var com = $(row).find('.info-company')[0];
    var pub = $(row).find('.info-publis')[0];
    var contract = $(row).find('.btn-startchat')[0];
    var job = {};
    //岗位
    job.path = pri.children[0].children[0].getAttribute('href');
    job.title = $(row).find('.job-title').text();
    var hits = words.filter((item, idx) => { return job.title.indexOf(item) != -1 }); //匹配关键词
    if(hits.length == 0){
      continue;
    }
    // job.title = pri.children[0].children[0].children[0].textContent;
    job.salary = pri.children[0].children[0].children[1].textContent;
    if (conds.minSalary && lowSalary(job.salary, conds.minSalary)) { //忽略薪水低于10K的
      continue;
    }
    //pri.children[1].textContent  地址/工作年限/学历
    job.company = com.children[0].children[0].children[0].textContent;
    job.com_href = com.children[0].children[0].children[0].href;
    //公司
    var nodes = com.children[0].children[1].childNodes;
    job.com_industry = nodes[0].textContent;
    if (nodes.length >= 5) {
      job.com_employeenum = nodes[4].textContent;
      job.com_finance = nodes[2].textContent;
    } else if (nodes.length == 3) {
      job.com_employeenum = nodes[2].textContent;
    }
    if (conds.minEmployees && lessEmployee(job.com_employeenum, conds.minEmployees)) {
      continue;
    }
    //人事(忽略)
    //立即沟通
    job.redirect_url = contract.getAttribute('redirect-url');
    //发布时间
    job.updated = pub.children[1].textContent;

    arr.push(job);
    doms.push($(row).clone(true)); //克隆整个节点
  }

  //显示
  console.log(arr);
  if (doms.length > 0) {
    show(arr, doms)
  }
})();

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
  var textarea = $('<textarea rows=10></textarea>').text(JSON.stringify(arr));
  $(textarea).attr('style', 'margin:10px 10px;width: 99%;');
  var html = $('<div id="__dialog" title="筛选结果" style="width:800px;height:800px;bottom:10px;right:0;z-index:9999;display:block;position:absolute;background:#ecf6ff;border-radius:10px;box-shadow: 5px 5px 5px #888888;overflow: scroll;"></div>');
  $(html).append(doms);
  $(html).append(textarea);
  $('body').append(html);
  $("#__dialog").dialog();
}
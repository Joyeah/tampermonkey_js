// ==UserScript==
// @name         工作筛子(拉勾网)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  拉勾网岗位筛选器
// @author       Joyeah
// @match        https://www.lagou.com/jobs/list_/p-city*&district=*
// @grant        none
// ==/UserScript==

//注意：适当修改@match，以及关键词
//关键词
var words = ['经理','IT','技术','需求','培训'];
//其它条件（非必须）
var conds = {};
conds.minSalary = 11; //薪水（单位K)
conds.minEmployees = 100; //最少人数

(function () {
  'use strict';

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
    job.path = pri.find('.position_link')[0].getAttribute('href');
    job.title = $(row).find('h3').text();
    var hits = words.filter((item, idx) => { return job.title.indexOf(item) != -1 }); //匹配关键词
    if(hits.length == 0){
      continue;
    }
    job.salary = pri.find('.money').text();
    if (conds.minSalary && lowSalary(job.salary, conds.minSalary)) { //忽略薪水低于10K的
      continue;
    }
  
    job.company = com.children[0].children[0].textContent;
    job.com_href = com.children[0].children[0].href;

    var industry = com.children[1].textContent; //移动互联网,金融 / 天使轮 / 150-500人
    var strs = industry.split('/');
    job.com_industry = strs[0].trim();
    job.com_finance = strs[1].trim();
    job.com_employeenum = strs[2].trim();
    if (conds.minEmployees && lessEmployee(job.com_employeenum, conds.minEmployees)) {
      continue;
    }
    //特色
    job.tag = $.map(tags.children[0].children, function (ele, idx) {
      return ele.textContent;
    });
    job.feathers = tags.children[1].textContent;
    //人事(忽略)
    //发布时间
    job.updated = pri.find('.format-time')[0].textContent;

    arr.push(job);
    doms.push($(row).clone(true)); //克隆整个节点
  }

  //显示
  console.log(arr);
  if(doms.length > 0){
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
// ==UserScript==
// @name         ic.net.cn数据抓取
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.ic.net.cn/search/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

// 设置：运行时期:document-end, 仅在顶层页面（框架）运行:是

var title ='';
var myinfo = [];
(function() {
    'use strict';

    let title = document.getElementById('key').value;
    initDialog();
    setTimeout(function(){
      myinfo = getPageData();
        if(myinfo && myinfo.length){
            showInfo(title, myinfo);
        }else{
          setTimeout(function(){
            myinfo = getPageData();
            showInfo(title, myinfo);
            alert(`当前页有效"现货排名"共${myinfo.length}条. 未若获得数据，重新刷新`);
          },1000)
        }
    },1000); //延时处理, 若响应慢，则调大值
})();

function getPageData(){
    var lis = document.querySelectorAll('li.stair_tr')
    var data = [];
    for (let i = 0; i < lis.length; i++) {
        const li = lis[i];
        if(li.children.length>=13 && li.querySelector('.icon_xianHuo')){ //忽略非数据行 &&现货排名
            data.push(getData(li))
        }
    }
    return data;
}

function getData(li){
    var info = {};
    info.supply = li.children[1].children[0].text.trim(); //供应商
    info.xianhuo = li.querySelector('.result_id').children[1].href;
    info.factory = li.querySelector('.result_factory').textContent; 
    info.batchNumber = li.querySelector('.result_batchNumber').textContent;  //result_batchNumber
    //result_totalNumber得到不确定的多个干扰数据，通过offsetParent/offsetWidth等可判断是否显示，显示的即为真实的数据
    var totals = li.querySelectorAll('.result_totalNumber');
    for (let i = 0; i < totals.length ; i++) {
        const ele = totals[i];
        if(ele.offsetParent){
          info[`totalNumber`] = ele.textContent;
          break;
        }
    }
    info.pakaging = li.querySelector('.result_pakaging').textContent; //封装
    info.date = li.querySelector('.result_date').textContent;
    info.askPrice = li.querySelector('.result_askPrice').children[0].href; //QQ询价，取1个

    return info;
}

function showInfo(title, info){
    document.getElementById('div1').innerText = title;
    document.getElementById('jsontext').innerText = JSON.stringify(info);
    document.getElementById('csvtext').innerText(transAllToCSV(info));
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
    loadStyleString('.tm_layer{display: block;position: fixed;top: 30px;right: 15px;width:300px;height:800px;background-color: lightgray;}\
        .btn{display: inline-block;color: darkblue;background-color: lightskyblue;border-radius: 5px;padding: 2px;} \
        .lbl{display:flex; justify-content:space-between;}.lbl>input{flex-grow:1;}');

    var _father = document.createElement('div');
    _father.className = 'tm_layer';
    document.body.appendChild(_father);

    var row1 = document.createElement('div');
    var row2 = document.createElement('div');
    var row3 = document.createElement('div');
    row1.id = 'div1';
    row2.id = 'div2'
    row3.id = 'div3'
    row1.innerHTML = 'search: ';
    _father.appendChild(row1);
    _father.appendChild(row2);
    _father.appendChild(row3);

    var textarea1 = document.createElement('textarea');
    textarea1.id = 'jsontext';
    textarea1.rows = 20;
    textarea1.style.width = '100%';
    textarea1.style.height = '40%';
    row2.appendChild(textarea1);

    var textarea2 = document.createElement('textarea');
    textarea2.id = 'csvtext';
    textarea2.rows = 20;
    textarea2.style.width = '100%';
    textarea2.style.height = '40%';
    row3.appendChild(textarea2);
    //添加自动拷贝事件:注意启用此项后，按钮拷贝将出现无限循环，需要禁用按钮
    //textarea1.addEventListener('focus', autoCopyText);
    //textarea2.addEventListener('focus', autoCopyText);

    var btn = document.createElement('button');
    btn.classList.add('btn');
    btn.innerText = '拷贝为json';
    btn.addEventListener('click', handleClick1);
    
    var btn2 = document.createElement('button');
    btn2.classList.add('btn');
    btn2.innerText = '拷贝为csv';
    btn2.addEventListener('click', handleClick2);

    _father.appendChild(btn);
    _father.appendChild(btn2);
  }

  function handleClick1(){
    // var info = { type: 'text', mimetype: 'text/plain'};
    // var data = document.querySelector('#jsontext').innerText;
    // GM_setClipboard(data, info);
    document.querySelector('#jsontext').select(); // 选择对象
    document.execCommand("Copy"); // 执行浏览器复制命令
    alert("已复制好，可贴粘。");
    //js.execCommand('Copy')
  }

  function handleClick2(){
    document.querySelector('#csvtext').select(); // 选择对象
    document.execCommand("Copy"); // 执行浏览器复制命令
    alert("已复制好，可贴粘。");
  }

  function autoCopyText(evt){
    evt.target.select();
    document.execCommand("Copy"); // 执行浏览器复制命令
    alert("已复制好，可贴粘。");
  }

  /**
   * 把json转为csv行数据
   * @param {json} e json data
   * @returns 
   */
  function toCVS(e){
    return `${e.supply},${e.xianhuo},${e.factory},${e.batchNumber},${e.totalNumber},${e.pakaging},${e.date},${e.askPrice}`;
  }
  function transAllToCSV(){
    let arr = [];
    for (let i = 0; i < myinfo.length; i++) {
      const json = myinfo[i];
      try {
        arr.push(toCVS(json));
      } catch (error) {
        console.error(error);
      }
    }
  
    document.getElementById('csvtext').textContent = arr.join('\r\n')
  }
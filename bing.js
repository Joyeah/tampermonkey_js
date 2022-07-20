// ==UserScript==
// @name         BingWallpaper
// @namespace    https://github.com/Joyeah/tampermonkey_js
// @version      0.1
// @description  try to make the world beautiful!
// @author       Joysong
// @match        https://*.bing.com
// @match        https://*.bing.com/*
// @match        https://*/th?id=*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let href = window.location.href;
    if(href.indexOf('/th?id=')> 0 ){
        //todo save image
    }else{
        initDialog();
        setTimeout(function(){
            var info = getImageInfo();
            if(info && info.text){
                showImageInfo(info);
            }
        },3000);
    }    
})();

function getImageInfo(){
    //注：只有浏览器放大显示，会显示.img_uhd
    var info = {};
    var div = document.querySelector('.img_cont'); //container
    if(div&&div.style){
        let url = div.style.backgroundImage || div.style.background;
        if(url){
            url = url.substr('url("'.length);
            url = url.substring(0, url.indexOf('&'))
        }
        info.img_fit = url;
    }
    div = document.querySelector('.img_uhd'); //大图:当浏览器放大显示时（即超过100%）会插入此大图
    if(div&&div.style){
        let url = div.style.backgroundImage||div.style.background;
        if(url){
            url = url.substr('url("'.length);
            url = url.substring(0, url.indexOf('&'))
        }
        info.img_big = url;
    }

    div = document.querySelector('.musCardCont');
    //info.text = div.children[3].text;
    info.text = div.querySelector('a.title').text;
    return info;
}

function showImageInfo(info){
    document.querySelector('#img_text').textContent = info.text;
    //document.querySelector('#img_fit').textContent = info.img_fit;
    let a = document.createElement('a');
    a.href = info.img_fit;
    a.target = '_blank';
    a.text = '打开图片'
    a.className = 'tm_btn';
    document.querySelector('#img_fit').appendChild(a);
    document.querySelector('#img_fit').append(info.img_fit);
    if(info.img_big){
         //document.querySelector('#img_big').textContent = info.img_big;
        let b = document.createElement('a');
        b.href = info.img_big;
        b.target = '_blank';
        b.text = '打开大图'
        b.className = 'tm_btn';
        document.querySelector('#img_big').appendChild(b);
        document.querySelector('#img_big').append(info.img_big);
    }else{
        document.querySelector('#img_big').append('由于跳转到https://www2.bing.com/?form=DCDN，没有大图');
    }
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
    loadStyleString('.tm_layer{display: block;position: fixed;top: 30px;right: 15px;width:300px;height:200px;background-color: lightgray;}\
        .tm_btn{display: inline-block;color: darkblue;background-color: lightskyblue;border-radius: 5px;padding: 2px;} \
        .lbl{display:flex; justify-content:space-between;}.lbl>input{flex-grow:1;}');

    var _father = document.createElement('div');
    _father.className = 'tm_layer';
    document.body.appendChild(_father);

    var row1 = document.createElement('div');
    var row2 = document.createElement('div');
    var row3 = document.createElement('div');
    row1.id = 'img_text';
    row2.id = 'img_fit'
    row3.id = 'img_big';
    _father.appendChild(row1);
    _father.appendChild(row2);
    _father.appendChild(row3);
    var btn = document.createElement('button');
    btn.innerText = '保存';
    btn.addEventListener('click', saveInfo);
    _father.appendChild(btn);
  }

  function saveInfo(){
      var info = {};
      info.text = document.querySelector('#img_text').text;
      info.img_fit = document.querySelector('#img_fit').text;
      info.img_big = document.querySelector('#img_big').text;
      alert(JSON.stringify(info));
      //todo save info 
  }


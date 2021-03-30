// ==UserScript==
// @name         移除变态的弹窗
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  移除变态的弹窗。
// @author       You
// @match        *.zhihu.com/*
// @match        https://www.csdn.com/*
// @match        https://www.360.cn/*
// @match        https://wenku.baidu.com/*
// @match        https://blog.51cto.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    if(location.href.indexOf('zhihu.com')>0){
        execFuncMulti(removeZhihuLayer, [1000, 1500, 3000]);
    }else if(location.href.indexOf('csdn.net')>0){
        execFuncMulti(removeCsdnLayer, [800, 1500, 2500])
        setTimeout(() => {
            setInterval(()=>{
                removeCsdnLayer();
            }, 3000);
        }, 5000);
    }else if(location.href.indexOf('wenku.baidu.com')>0){ //百度文库
        execFuncMulti(removeBaiduLayer, [1000, 1500, 3000]);    
    }else if(location.href.indexOf('51cto.com')>0){ 
        execFuncMulti(remove51ctoLayer, [1000,2000,3000]);
        //当下拉滚动时，会再次出现弹窗
        //registEvent();
    }else if(location.href.indexOf('abc.com')>0){

    }else{
        execFuncMulti(removeLayer, [1000,2000,3000]);
    }
})();
/**
 * 通用移除层操作：模糊匹配弹层，如mask, model layer close按钮等
 */
function removeLayer(){
    //检测关闭按钮
    arr = document.querySelectorAll('[class*="close"]');
    for(var i=0;i<arr.length;i++){
        dom = arr[i];
        if(dom.click) {
            dom.click();
        }
    }
    //检测mask
    
}
/**延时执行多次方法*/
function execFuncMulti(func,delayTimes){
    for(var i = 0;i<delayTimes.length;i++){
        setTimeout(()=>{
            func();
        }, delayTimes[i]);
    }
}
function removeZhihuLayer(){
    var b =document.querySelector('[aria-label="关闭"]');
    if(b&&b.click) b.click();
}
function removeBaiduLayer(){
    var w = document.querySelector('.experience-card-wrap');
    if (w) w.remove();
}
function removeCsdnLayer() {
    var w = document.querySelector('.login-mark');
    if(w) document.click();
}
function remove51ctoLayer() {
    var b = document.querySelector('.close_icon');
    if(b) b.click();
}


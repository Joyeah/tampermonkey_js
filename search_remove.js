// ==UserScript==
// @name         SearchFilterRemove
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  利用减号过滤掉指定站点
// @description_cn
// @author       Joyeah
// @grant        none
// @license      GPL License
// @include      https://search.fuckoffgoogle.*
// @include      https://www.baidu.com*
// @include      https://cn.bing.com*
// @include      https://yandex.com/search/?text=*
// @include      https://www.google.com/search*
// @run_at       document_end


// ==/UserScript==

//垃圾网站
var filters = ['-csdn','-tencent','-huaweicloud', '-360.cn'];


(function () {
    'use strict';
    var href = document.location.href;
    if (href.startsWith('https://cn.bing.com')) {
        bing_search();
    } else if (href.startsWith('https://www.baidu.com')) {
        baidu_search();
    } else if (href.startsWith('https://www.google.com/search')) {
        google_search();
        setTimeout(()=>{
            var q = document.querySelectorAll('[name=q]')[0];
            q.focus();
        }, 800);
    } else if (href.startsWith('https://yandex.com/')) {

    }

})();

function makefilter(){
    return filters.join(' ');
}

function google_search(){
    console.log('google search filter');
    var filterstr = makefilter();
    var href = location.href;
    var q = document.querySelectorAll('[name=q]')[0];
    if (q.value){
        if(href.indexOf('op=') && href.indexOf(filters[0])>0){
            return ;
        }else{
            q.value = q.value + '  ' + filterstr;
        }
        document.querySelector('[type=submit]').click();
    }else{
        q.value = '   ' + filterstr;
    }
    
}


function bing_search(){
    console.log('bing search filter');
    var filterstr = makefilter();
    var href = location.href;
    var q = document.querySelector('#sb_form_q');
    if (q.value){
        if(href.indexOf('+-') > 0){
            return ;
        }else{
            q.value = q.value + '  ' + filterstr;
        }
        document.querySelector('[type=submit]').click();
    }else{
        q.value = '   ' + filterstr;
    }
    
}

function baidu_search(){
    console.log('baidu search filter');
    var filterstr = makefilter();
    var href = location.href;
    var q = document.querySelector('#kw');
    if (q.value){
        if(href.indexOf('+-') > 0){
            return ;
        }else{
            q.value = q.value + '  ' + filterstr;
        }
        document.querySelector('[type=submit]').click();
    }else{
        q.value = '   ' + filterstr;
        q.focus();
    }
    
}
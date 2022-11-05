// ==UserScript==
// @name         SearchFilter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Google search result filter and marker
// @author       Joyeah
// @grant        none
// @license      GPL License
// @include      https://search.fuckoffgoogle.*
// @include      https://www.baidu.com/s*
// @include      https://cn.bing.com/search?q=*
// @include      https://yandex.com/search/?text=*
// @include      https://www.google.com/search*
// @run_at       document_end


// ==/UserScript==

//垃圾网站
var trashsites = [
    'baidu.com', 'csdn.net','csdn.com','oschina.net', '360.cn','tencent.com','aliyun.com','huaweicloud.com','oschina'
];
//垃圾站点信息处理方式：remove-移除, gray-变灰
var trash_action = 'gray';
//星标网站
var starsites = ['liaoxuefeng.com', 'zhihu.com'];

(function () {
    'use strict';
    var href = document.location.href;
    if (href.startsWith('https://cn.bing.com/')) {
        bingfilter();
    } else if (href.startsWith('https://www.baidu.com/')) {
        baidufilter();
        setTimeout(() => {
            baidufilter();
        }, 300);
    } else if (href.startsWith('https://www.google.com/search')) {
        googlefilter();
    } else if (href.startsWith('https://search.fuckoffgoogle')) {
    } else if (href.startsWith('https://yandex.com/')) {

    }

})();

function bingfilter() {
    var arr = [];
    var rs = document.querySelectorAll('.b_algo');
    for (var i = 0; i < rs.length; i++) {
        var h = rs[i].getElementsByTagName('h2')[0];
        var cite = rs[i].getElementsByTagName('cite')[0];
        if(!cite) continue;
        var exist = trashsites.filter((item, idx) => { return cite.textContent.indexOf(item) != -1 });
        if (exist.length > 0) {
            if (trash_action == 'gray') {
                cite.style.color = 'lightgray';
                h.style.color = 'lightgray';
                h.children[0].style.color = 'lightgray'; //alink
                rs[i].getElementsByClassName('b_caption')[0].style.color = 'lightgray'; //text
            } else {
                arr.push(rs[i]);
            }
            continue;
        }

        exist = starsites.filter((item, idx) => { return cite.textContent.indexOf(item) != -1 });
        if (exist.length > 0) {
            var sp = document.createElement('span');
            sp.innerText = '★';
            sp.style = 'color:red;'
            h.insertAdjacentElement('afterBegin', sp); //在h3内的前面添加标记
        }

    }
    // 移除垃圾站点信息
    if (trash_action == 'remove') {
        for (let i = 0; i < arr.length; i++) {
            const element = arr[i];
            element.remove();
        }
    }
}
function baidufilter() {
    var rs = document.getElementById('content_left').children;
    for (var i = 0; i < rs.length; i++) {
        var c = rs[i].classList[0];
        if (c != 'result') {//tuiguan
            //mark ad
            // rs[i].style.color = 'lightgray';
            // // rs[i].children[0].getElementsByTagName('a')[0].style.color = 'lightgray'; //head title
            // var links = rs[i].getElementsByTagName('a');
            // for (var j = 0; j < links.length;j++){
            //     links[j].style.color = 'lightgray';
            // }
            rs[i].innerHTML = '';
            continue;
        }
        if (rs[i].innerText.endsWith('广告')) {
            rs[i].innerHTML = '';
        }
        var h = rs[i].getElementsByTagName('h3')[0];
        var cite = h.children[0].href;
        var exist = trashsites.filter((item, idx) => { return cite.textContent.indexOf(item) != -1 });
        if (exist.length > 0) {
            if (trash_action == 'gray') {
                cite.style.color = 'lightgray';
                h.style.color = 'lightgray';
                h.children[0].style.color = 'lightgray'; //alink
                var ems = rs[i].getElementsByTagName('em');
                for (var j = 0; j < ems.length; j++) {
                    ems[j].style.color = 'lightgray';
                }

                rs[i].getElementsByClassName('c-abstract')[0].style.color = 'lightgray';
            } else {
                rs[i].innerHTML = '';
            }
            continue;
        }

        exist = starsites.filter((item, idx) => { return cite.textContent.indexOf(item) != -1 });
        if (exist.length > 0) {
            var sp = document.createElement('span');
            sp.innerText = '★';
            sp.style = 'color:red;'
            h.insertAdjacentElement('afterBegin', sp); //在h3内的前面添加标记
        }
    }

}

function googlefilter() {

    //clear ad
    var ads = document.querySelector('#taw');
    ads.remove();
    //google search result
    var arr = [];
    var gs = document.querySelectorAll('.g');
    for (var i = 0; i < gs.length; i++) {
        var h = gs[i].getElementsByTagName('h3')[0];
        var cite = gs[i].getElementsByTagName('cite')[0];
        var exist = trashsites.filter((item, idx) => { return cite.textContent.indexOf(item) != -1 });
        if (exist.length > 0) {
            if (trash_action == 'gray') {
                cite.style.color = 'lightgray';
                h.style.color = 'lightgray';
                gs[i].getElementsByClassName('st')[0].style.color = 'lightgray';
            } else {
                arr.push(gs[i]);
            }
            continue;
        }

        exist = starsites.filter((item, idx) => { return cite.textContent.indexOf(item) != -1 });
        if (exist.length > 0) {
            var sp = document.createElement('span');
            sp.innerText = '★';
            sp.style = 'color:red;'
            h.insertAdjacentElement('afterBegin', sp); //在h3内的前面添加标记
        }

    }
    // 移除垃圾站点信息
    if (trash_action == 'remove') {
        for (let i = 0; i < arr.length; i++) {
            const element = arr[i];
            element.remove();
        }
    }
}
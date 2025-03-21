// ==UserScript==
// @name         Z-SearchFilter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Google search result filter and marker
// @author       Joyeah
// @grant        none
// @license      GPL License
// @include      https://search.fuckoffgoogle.*
// @include      https://www.baidu.com/
// @include      https://www.baidu.com/s*
// @include      https://cn.bing.com/search?q=*
// @include      https://www.bing.com/search?q=*
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
    if (href.startsWith('https://cn.bing.com/')||href.startsWith('https://www.bing.com/')) {
        setTimeout(() => {
            bingfilter();
        }, 800);
        setTimeout(() => {
            bingfilter();
        }, 2000);
    } else if (href.includes('baidu.com/')) {
        setTimeout(() => {
            baidufilter();
        }, 500);
    } else if (href.startsWith('https://www.google.com/search')) {
        googlefilter();
    } else if (href.startsWith('https://search.fuckoffgoogle')) {
    } else if (href.startsWith('https://yandex.com/')) {

    }

})();

function bingfilter() {
    let arr = [];
    // let rs = document.querySelectorAll('.b_algo');
    let rs = document.querySelector('#b_results').children;
    for (var i = rs.length-1; i >= 0; i--) {
        //remove AD
        if (rs[i].classList.contains('b_ad')){
            rs[i].remove();
        }
        var p = rs[i].querySelector('p');
        var before = window.getComputedStyle(p, '::before');
        if(before){
            rs[i].remove();
            // var content = before.getPropertyValue('content');
            // if(content && content.contains('url')){
            //     rs[i].remove();
            // }
        }
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
                //trash_action == 'remove'
                rs[i].remove();
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
function baidufilter() {
    var q = document.querySelector('input').value;
    if(!q || ! q.includes(`-${trashsites[0]}`)){
        document.querySelector('input').value = '  ' + trashsites.join(' -')
    }

    var rs = document.getElementById('content_left').children;
    for (var i = rs.length-1; i >= 0; i--) {
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
        if(rs[i].getAttribute('mu')){
            const mu = rs[i].getAttribute('mu');
            let arr = trashsites.filter((item, idx) => { return mu.indexOf(item) != -1 });
            if(arr.length){
                if (trash_action == 'gray') {
                    let titles = rs[i].getElementsByClassName('c-title')
                    if(titles.length){
                        titles[0].children[0].style.color = 'lightgray'; //alink
                    }
                
                } else {
                    rs[i].innerHTML = '';
                }
                continue;
            }
        }
        var h = rs[i].getElementsByTagName('h3')[0];
        var cite = h.children[0].href;
        var exist = trashsites.filter((item, idx) => { return cite.indexOf(item) != -1 });
        if (exist.length > 0) {
            if (trash_action == 'gray') {
                let titles = rs[i].getElementsByClassName('c-title')
                if(titles.length){
                    titles[0].children[0].style.color = 'lightgray'; //alink
                }
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
// ==UserScript==
// @name         GoogleFilter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Google search result filter and marker
// @author       Joysee
// @match        https://www.google.com/search?*
// @grant        none
// ==/UserScript==

//垃圾网站
var trashsites = [
    'baidu.com','csdn.net','360.cn',
];
//垃圾站点信息处理方式：remove-移除, gray-变灰
var trash_action = 'remove';
//星标网站
var starsites = ['liaoxuefeng.com','shihu.com'];

(function() {
    'use strict';
    //clear ad
    var ads = document.querySelector('#taw');
    ads.remove()
    //google search result
    var arr = [];
    var gs = document.querySelectorAll('.g');
    for(var i = 0;i<gs.length;i++){
        var h = gs[i].getElementsByTagName('h3')[0];
        var cite = gs[i].getElementsByTagName('cite')[0];
        var exist = trashsites.filter((item,idx)=>{return cite.textContent.indexOf(item) != -1});
        if(exist.length >0){
            if(trash_action == 'gray'){
                cite.style.color = 'lightgray';
                h.style.color = 'lightgray';
                gs[i].getElementsByClassName('st')[0].style.color = 'lightgray';
            }else{
                arr.push(gs[i]);
            }
            continue;
        }

        exist = starsites.filter((item, idx) => { return cite.textContent.indexOf(item) != -1 });
        if(exist.length > 0){
            var sp = document.createElement('span');
            sp.innerText = '★';
            sp.style = 'color:red;'
            h.insertAdjacentElement('afterBegin', sp); //在h3内的前面添加标记
        }
        
    }
    // 移除垃圾站点信息
    if(trash_action == 'remove'){
        for (let i = 0; i < arr.length; i++) {
            const element = arr[i];
            element.remove();
        }
    }
})();
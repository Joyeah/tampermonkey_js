// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.qcc.com/firm/43f9be2117ecc265c8510754accce03d.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qcc.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    showInfo();
})();

function showInfo(){
    var arr = document.querySelectorAll(".dt-scroll item");
    for( var i = 0; i<arr.length; i++){
        var txt = arr[i].textContent;
        var url = arr[i].href;
        console.log(txt, url);
    }
}
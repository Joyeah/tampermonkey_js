// ==UserScript==
// @name         ToDarkTheme
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  切换成深色界面
// @author       Yusen
// @match        *
// @grant        none
// ==/UserScript==
// 实现方式选择：
//  1、遍历样式，判断内容为文字的节点设置颜色【低效】
//  2、指定节点，设置颜色（需要针对站点分别设置）【高效】
// 其中1：要根据节点的类型（nodeType：元素, 文本 和 注释）来决定样式设置。可针对Node.TEXT_NODE，Node.TEXT_NODE进行判断
// 参考：https://developer.mozilla.org/zh-CN/docs/Web/API/Node/nodeType

//打开：edge://flags/#enable-force-dark
(function () {
  "use strict";
  setTimeout(() => {
    setThemeStyle("dark");
  }, 1000);
})();

function setThemeStyle(theme) {
  var nodes = document.body.childNodes;
  setNodesStyle(theme, nodes);
}

function setNodesStyle(nodes) {
  if (nodes.length == 0) {
    return;
  } else if (nodes.length == 1) {
    if (isIgnoreNode(nodes[0])) {
      return;
    }
    if (nodes[0].nodeType == Node.TEXT_NODE) {
      setNodeStyle(nodes[0].parentNode);
    } else if (nodes[0].nodeType == Node.ELEMENT_NODE) {
      if (nodes[0].childNodes.length == 0) {
        return;
      } else {
        setNodesStyle(nodes[0].childNodes);
      }
    }
  } else {
    //递归遍历节点
    nodes.forEach((e) => {
      console.log(e);
      if (e.nodeType == Node.TEXT_NODE) {
        setNodeStyle(e);
      } else if (e.nodeType == Node.ELEMENT_NODE) {
        if (e.childElementCount == 0) {
          setNodeStyle(e);
        } else if (
          !isIgnoreNode(e) &&
          e.checkVisibility() &&
          e.hasChildNodes()
        ) {
          setNodesStyle(e.childNodes);
        }
      }
    });
  }
}

function isIgnoreNode(node) {
  return (
    node.nodeName == "IMG" ||
    node.nodeName == "SCRIPT" ||
    node.nodeName == "STYLE" ||
    node.nodeName == "LINK"
  );
}
function setNodeStyle(node) {
  node.style.color = "red";
  node.style.backgroundColor = "blank";
}

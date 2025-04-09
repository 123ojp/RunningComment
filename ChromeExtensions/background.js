// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';
function setStorage(key,value){
  chrome.storage.sync.set({
    key: value
  }, function () {
    console.log('Key:'+key+' change to :'+value);
  });
}
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.popupOpen) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs.length > 0) {
        var tabId = tabs[0].id;

        // 檢查是否已經在這個標籤頁注入了腳本
        chrome.storage.local.get(['injectedTabs'], function(result) {
          var injectedTabs = result.injectedTabs || {};

          if (!injectedTabs[tabId]) {
            // 如果還沒有注入過，則注入腳本
            chrome.scripting.executeScript({
              target: { tabId: tabId },
              files: ["js/jquery.min.js", "js/danmo.js", "js/function.js", "js/insert.js"]
            }, function() {
              // 將這個標籤頁記錄為已經注入過腳本
              injectedTabs[tabId] = true;
              chrome.storage.local.set({ injectedTabs: injectedTabs }, function() {
                console.log('Scripts injected and tabId stored.');
              });
            });
          } else {
            console.log('Scripts already injected in this tab.');
          }
        });
      }
    });
  }
});
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.popupOpen) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs.length > 0) {
        var tabId = tabs[0].id;

        // 執行一段腳本來檢查是否已經插入過腳本
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          func: function() {
            return !!window.scriptsInjected;
          }
        }, function(results) {
          if (results && results.length > 0 && !results[0].result) {
            // 如果沒有插入過腳本，則插入腳本
            chrome.scripting.executeScript({
              target: { tabId: tabId },
              files: ["js/jquery.min.js", "js/danmo.js", "js/function.js", "js/insert.js"]
            }, function() {
              console.log("Scripts executed.");
            });
          }
        });
      }
    });
  }
});

// 當標籤頁刷新時，重置標誌
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'loading') {
    chrome.storage.local.get(['injectedTabs'], function(result) {
      var injectedTabs = result.injectedTabs || {};
      if (injectedTabs[tabId]) {
        delete injectedTabs[tabId];
        chrome.storage.local.set({ injectedTabs: injectedTabs }, function() {
          console.log('Tab ID reset due to page reload.');
        });
      }
    });
  }
});

// background.js


var token;
chrome.runtime.onInstalled.addListener(function () {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  chrome.storage.sync.set({
    danmo_channel: text
  }, function () {
    console.log('The danmo_channel is set.');
  });
  chrome.storage.sync.set({
    danmo_enable: "false"
  }, function () {
    console.log('The danmo_channel is set.');
  });
});


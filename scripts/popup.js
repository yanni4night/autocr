/**
 * Copyright (C) 2014 yanni4night.com
 * popup.js
 *
 * changelog
 * 2015-10-07[16:57:48]:revised
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */

document.querySelector('#do-ocr').addEventListener('click', function(e) {
    chrome.tabs.getCurrent(function(tab) {
        chrome.tabs.sendMessage(tab.id, {
            cmd: 'docheck'
        });
    });
}, false);
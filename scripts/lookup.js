/**
 * Copyright (C) 2014 yanni4night.com
 * lookup.js
 *
 * changelog
 * 2015-10-08[22:17:41]:revised
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */

function doCheck() {
    chrome.runtime.sendMessage({
        cmd: 'check',
        location: location
    });
}

window.addEventListener('load', function() {
    doCheck();
}, false);

var expando = 'autocr-' + Math.round(Math.random() * 1e13);

chrome.runtime.onMessage.addListener(function(msg) {
    switch (msg.cmd) {
        case 'docheck':
            doCheck();
            break;
        case 'checked':
            msg.patterns.forEach(function(pattern) {
                var img = document.querySelector(pattern);
                if (img && img.src) {
                    chrome.runtime.sendMessage({
                        cmd: 'ocr',
                        imgSrc: img.src,
                        pattern: pattern,
                        location: location
                    });
                }
            });

            break;
        case 'ocred':
            var img = document.querySelector(msg.pattern);
            if (img && msg.data.retData.length > 0 && 'true' !== img.getAttribute(expando)) {
                var input = document.createElement('input');
                input.type = 'text';
                input.value = ((msg.data.retData[0] || {}).word || '').trim();
                img.parentNode.insertBefore(input, img);
                img.setAttribute(expando, 'true');
            }
            break;
    }
});
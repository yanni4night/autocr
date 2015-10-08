/**
 * Copyright (C) 2014 yanni4night.com
 * back.js
 *
 * changelog
 * 2015-10-08[22:22:34]:revised
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */

function base64(img) {

  img.crossOrigin = 'Anonymous';
  var imgStyles = window.getComputedStyle(img, null);
  var imgWidth = parseInt(imgStyles['width']);
  var imgHeight = parseInt(imgStyles['height']);

  c = document.createElement('canvas');

  c.width = imgWidth + 10;
  c.height = imgHeight + 10;

  document.body.appendChild(c);

  var ctx = c.getContext("2d");
  ctx.fillStyle = "rgba(255,255,255,255)";
  ctx.fillRect(0, 0, imgWidth + 10, imgHeight + 10);
  ctx.drawImage(img, 5, 5, imgWidth, imgHeight);
  var base64 = c.toDataURL('image/jpeg', 1);
  document.body.removeChild(c);
  return base64;
}


function OCR(imgSrc, cb) {

  var img = new Image();

  img.onload = function() {
    var fd = new FormData();
    fd.append("image", base64(img).replace('data:image/jpeg;base64,', ''));
    fd.append('fromdevice', 'pc');
    fd.append('clientip', '10.10.10.0');
    fd.append('detecttype', 'LocateRecognize');
    fd.append('languagetype', 'CHN_ENG');
    fd.append('imagetype', '1');

    // Now, upload the image
    var y = new XMLHttpRequest();
    y.onload = function() {
      var ret = JSON.parse(y.responseText);
      cb(ret);
    };
    y.open('POST', 'http://apis.baidu.com/apistore/idlocr/ocr');
    y.setRequestHeader('apikey', '9f3604787cd9a770ccf9af5f13b76b96');
    y.send(fd);

    document.body.removeChild(img);
  };

  document.body.appendChild(img);
  img.src = imgSrc;
}

function getPatternsByLocation(loc) {
  if ('h.liepin.com' === loc.hostname && '/resume/showresumedetail/' === loc.pathname) {
    return ['img.telphone', 'img.email'];
  }
  return [];
}

chrome.runtime.onMessage.addListener(function(msg, messageSender) {
  if ('check' === msg.cmd) {
    var patterns = getPatternsByLocation(msg.location);
    if (patterns) {
      chrome.tabs.sendMessage(messageSender.tab.id, {
        cmd: 'checked',
        patterns: patterns
      });
    }
  } else if ('ocr' === msg.cmd) {
    new OCR(msg.imgSrc, function(data) {
      chrome.tabs.sendMessage(messageSender.tab.id, {
        cmd: 'ocred',
        pattern: msg.pattern,
        data: data
      });
    });
  }
});
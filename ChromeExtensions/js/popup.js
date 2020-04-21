// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';
chrome.runtime.sendMessage({popupOpen: true});

let channel_name_tag = document.getElementById('channel');
let channel_button = document.getElementById('setchannelbut');
let msg = $("#msg");
let rand_set_cha = document.getElementById('randomset');
function setStorage(key,value){
  var jsonfile = {};
  jsonfile[key]=value;
  chrome.storage.sync.set(jsonfile, function () {
    console.log('Key:'+key+' change to :'+value);
  });
}

function setOpen(bool){
  setStorage("danmo_enable",bool)
}
$('#myonoffswitch').change(function() {
  if(this.checked) {
    setOpen("true");
  } else {
    setOpen("false");
  }
});
function setQRcode(channel){
  $('#qrcode').empty();
  $('#qrcode').qrcode("https://danmo.foxo.tw/#"+channel);
}

chrome.storage.sync.get('danmo_channel', function (data) {
  if (data.danmo_channel == null) {
    console.log("Channel Not set!");
  } else {
    channel_name_tag.value = data.danmo_channel;
    setQRcode(data.danmo_channel);
  }
});
chrome.storage.sync.get('danmo_enable', function (data) {
  if (data.danmo_enable == "true") {
    $('#myonoffswitch').prop('checked', true);
  } else {
    $('#myonoffswitch').prop('checked', false);
  }
});
function setChannel(channel) {
  setStorage("danmo_channel",channel);

    channel_name_tag.value = channel;
    msg.text = "更改成功";
    setQRcode(channel);

}
channel_button.onclick = function (element) {
  setChannel(channel_name_tag.value);
}
rand_set_cha.onclick = function (element) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
   text += possible.charAt(Math.floor(Math.random() * possible.length));
  setChannel(text);
}
$('#channel').keypress(function (e) {
  var key = e.which;
  if(key == 13)  // the enter key code
   {
    setChannel(channel_name_tag.value);
   }
 });
 
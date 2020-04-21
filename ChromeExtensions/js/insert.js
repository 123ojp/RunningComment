var respmsg, type;
var wsocket
var isOn;


function renewWS() {
  if (isOn == "true" && !document.hidden) {
    wsocket = new WebSocket("wss://danmo.foxo.tw/chat");
  } else {
    return
  }
  wsocket.onmessage = function (e) {
    if (isOn == "true") {
      respmsg = JSON.parse(e.data);
      var type = respmsg.msg_type;
      if (type == "Hello") {
        ServerHello()
      }
      if (type == "danmo") {
        text.push(new Text(respmsg.msg, respmsg.color));
      }
    }
  }
}







function sentws(msg) {
  wsocket.send(JSON.stringify(msg));
}

function ServerHello() {
  chrome.storage.sync.get('danmo_channel', function (data) {
    if (data.danmo_channel == null) {
      alert("錯誤")
    } else {
      if (isOn == "true") {
        text.push(new Text("已連線至頻道:" + data.danmo_channel));
      }
      sentws({
        "msg_type": "ServerHello",
        "channel": data.danmo_channel
      });
    }
  });
}
if (!isActive) {
  isActive = true
  text.push(new Text("初始化..."));
  chrome.storage.sync.get('danmo_enable', function (data) {
    isOn = data.danmo_enable;
    renewWS();
  });
  chrome.storage.onChanged.addListener(function (changes, namespace) {

    for (var key in changes) {
      var storageChange = changes[key];
      if (key == "danmo_channel") {
        ServerHello();
        //storageChange.newValue
      }
      if (key == "danmo_enable") {
        isOn = storageChange.newValue;
        if (!document.hidden) {
          if (isOn == "true") {
            renewWS();
          } else {
            text.push(new Text("彈幕關閉"));
            wsocket.close();
          }
        }
      }
    }

  });
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      if (isOn == "true") {
        wsocket.close();
      }

    } else {
      renewWS();
    }
  });
}
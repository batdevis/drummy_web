var ws = new WebSocket("ws://localhost:8002", "echo-protocol")
ws.onmessage = function (event) {
  const data = JSON.parse(event.data);
  console.log('data', data);

  const channelMap = {
    96: 0,
    97: 1,
    98: 2,
    99: 3
    //100: 4,
    //101: 5
  };

  if (
    (data.channel == 0) &&
    (data.value == 127)
  ){
    var channelId = channelMap[data.controller];
    console.log(`toggle(${channelId})`);
    //toggle(channelMap[data.controller])
    channels[channelId].solo = !channels[channelId].solo;
  }
}

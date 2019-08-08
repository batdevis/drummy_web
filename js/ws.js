const ws = new WebSocket("ws://localhost:8002", "echo-protocol");
ws.onmessage = function (event) {
  const data = JSON.parse(event.data);
  console.log('data', data);

  const channelMap = {
    96: 0,//play/pause
    97: 1,
    98: 2,
    99: 3,
    100: 4
  };

  if (
    (data.channel == 0) &&
    (data.value == 127)
  ){
    if (data.controller == 0) {
      Tone.Transport.toggle();
    } else {
      var channelId = channelMap[data.controller];
      console.log(`toggle(${channelId})`);
      if(channels.indexOf(channelId) > -1) {
        channels[channelId].mute = !channels[channelId].mute;
      }
    }
  }
}

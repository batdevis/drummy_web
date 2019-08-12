const ws = io('http://localhost:8002');
ws.on('midiInpuList', function (data) {
  console.log('[ws] midiInputList', data);

});

ws.on('midiCc', function (data) {
  console.log('[ws] midiCc', data);

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
      if(mixer.channels.indexOf(channelId) > -1) {
        mixer.channels[channelId].mute = !mixer.channels[channelId].mute;
      }
    }
  }
});

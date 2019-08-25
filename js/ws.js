const ws = io('http://localhost:8002');

ws.on('midiInputList', function (data) {
  console.log('[ws] midiInputList', data);
  Store.midiInputs = data;

  Ui.printMidiInputs();
  Ui.printMidiInput();
  Ui.printPedalboard();
});

ws.on('fileTree', function (data) {
  console.log('[ws] fileTree', data);
  Store.fileTree = data;

  Ui.printFileTree();
});

ws.on('channels', function (data) {
  console.log('[ws] channels', data);
  Store.channels = data.channels;

  Ui.printChannels();
  Ui.createMixer();
});

ws.on('cmd', function (data) {
  console.log('[ws] cmd', data);

  switch(cmd) {
    case 'track01':
      mixer.channels[0].mute = !mixer.channels[0].mute;
      break;
    case 'track02':
      mixer.channels[1].mute = !mixer.channels[1].mute;
      break;
    case 'track03':
      mixer.channels[2].mute = !mixer.channels[2].mute;
      break;
    case 'track04':
      mixer.channels[3].mute = !mixer.channels[3].mute;
      break;
    case 'play_pause_all':
      Tone.Transport.toggle();
      break;
    case 'play_stop_all':
      //TODO
      Tone.Transport.toggle();
      break;
    default:
      console.log('cmd not found', cmd);
      break;
  }
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


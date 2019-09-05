const ws = new ReconnectingWebSocket(Store.cfg.ws_server_url);

const areaWhiteList = [
  'greetings',
  'midiInputList',
  'fileTree',
  'channels',
  'cmd'
];

ws.onmessage = dispatch;

ws.addEventListener('open', e => {
  console.log('[ws] websocket open');
  wsSend({area: 'getChannels'});
  wsSend({area: 'getFileTree'});
  wsSend({area: 'getMidiInputList'});
});

function wsSend(msg){
  ws.send(JSON.stringify(msg));
}

function dispatch(e) {
  const data = JSON.parse(e.data);
  console.log('[ws] onmessage data', data);
  if(areaWhiteList.indexOf(data.area) > -1) {
    switch (data.area) {
      case 'midiInputList':
        handleMidiInputList(data.content);
        break;
      case 'fileTree':
        handleFileTree(data.content);
        break;
      case 'channels':
        handleChannels(data.content);
        break;
      case 'cmd':
        handleCmd(data.content);
        break;
    }
  } else {
    console.error('[ws] area not allowed', data.area);
  }
}

function handleMidiInputList(data) {
  console.log('[ws] midiInputList');
  Store.midiInputs = data;

  //setup.html
  Ui.printMidiInputs();
  Ui.printMidiInput();
  Ui.printPedalboard();
}

function handleFileTree(data) {
  console.log('[ws] fileTree', data);
  Store.fileTree = data;

  //filebank.html
  Ui.printFileTree();
}

function handleChannels(data) {
  console.log('[ws] channels', data);
  Store.channels = data.channels;

  //filebank.html
  Ui.printChannels();

  //mixer.html
  Ui.printMixer();
  
  //banco.html
  Ui.printBanco();
}

function handleCmd(data) {
  console.log('[handleCmd]', data);
  const cmd = e.data.cmd;
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
      console.log('[handleCmd] cmd not found', cmd);
      break;
  }
}

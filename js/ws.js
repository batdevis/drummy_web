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
  //Ui.printChannels();
  Ui.printChannelList();

  //mixer.html
  Ui.printMixer();
  
  //banco.html
  Ui.printBanco();
}

function toggleChannel(channelId) {
  const eleTrackWaveId = `track_wave_${channelId}`;
  const eleTrackWave = document.getElementById(eleTrackWaveId);
  if (eleTrackWave) {
    eleTrackWave.classList.toggle('mute');
  }
  mixer.toggleChannelById(channelId);
}

function playStopAll() {
  const eleBancoPlayall = document.querySelector(".banco_playall");
  Tone.Transport.toggle();
  if (Tone.Transport.state === 'stopped') {
    eleBancoPlayall.classList.add('stopped');
    clearGrid();
  } else {
    eleBancoPlayall.classList.remove('stopped');
  }
}

function handleCmd(data) {
  console.log('[handleCmd]', data);
  const cmd = data.cmd;
  
  if(cmd.indexOf('trk') === 0) {
    //cmd is the id of the channel
    toggleChannel(cmd);
  } else {
    switch(cmd) {
      case 'play_pause_all':
        playStopAll();
        break;
      case 'play_stop_all':
        playStopAll();
        break;
      default:
        console.log('[handleCmd] cmd not found', cmd);
        break;
    }
  }
}

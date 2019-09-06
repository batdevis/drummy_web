class Banco {
  channels = [];

  constructor (channels) {
    this.addChannels(channels);
  }

  addChannel(data) {
    let rtn = this.makeChannel(data);
    let channel = {
      toneChannel: rtn.toneChannel,
      player: rtn.player,
      data: data
    };
    this.channels.push(channel);
    return channel;
  }
  
  addChannels(channels) {
    channels.forEach(channel => {
      this.addChannel(channel);
    });
    return this.channels;
  }
  
  makeChannel(channel) {
    var toneChannel = new Tone.Channel().toMaster();
    let url = `${Store.cfg.audio_folder}/${channel.file}`;
    var player = new Tone.Player({
      url : url,
      loop : true
    }).sync().start(0);
    player.chain(toneChannel);
    return {player: player, toneChannel: toneChannel};
  }
}

function printBancoTracks(banco) {
  console.log('[printBancoTracks] banco.channels', banco.channels);

  const eleBancoTracks = document.getElementById("banco_tracks");
  if (eleBancoTracks && banco.channels) {
    Nexus.context = Tone.context;
    
    // main playPauseBtn
    let playPauseBtnId = `play_pause_btn_all`;
    let elePlayPauseBtn = document.createElement('div');
    elePlayPauseBtn.id = playPauseBtnId;
    eleBancoTracks.appendChild(elePlayPauseBtn);
    let nxPlayPauseBtn = new Nexus.TextButton(`#${playPauseBtnId}`, {
      'size': [450,50],
      'state': false,
      'text': 'Play all',
      'alternateText': 'Stop all'
    });
    nxPlayPauseBtn.on('change', v => {
      console.log('[printBancoTracks] play/stop all');
      Tone.Transport.toggle();
    });
    
    const channels = banco.channels;
    let i = 0;

    for(let i = 0; i < channels.length; i++) {
      let channel = channels[i];
      
      let eleTrack = document.createElement('div');
      eleId = `track_${channel.data.id}`;
      eleTrack.id = eleId;
      eleBancoTracks.appendChild(eleTrack);

      // playPauseBtn
      let playPauseBtnId = `play_pause_btn_${channel.data.id}`;
      let elePlayPauseBtn = document.createElement('div');
      elePlayPauseBtn.id = playPauseBtnId;
      eleTrack.appendChild(elePlayPauseBtn);
      let nxPlayPauseBtn = new Nexus.TextButton(`#${playPauseBtnId}`, {
        'size': [150,50],
        'state': false,
        'text': `Activate [${i}] ${channel.data.name}`,
        'alternateText': `Mute [${i}] ${channel.data.name}`
      });
      nxPlayPauseBtn.on('change', v => {
        console.log('[printBancoTracks] channel.toneChannel', i, channel.toneChannel);
        channel.toneChannel.mute = !channel.toneChannel.mute;
      });
      
      //oscilloscope
      let oscilloscopeId = `oscilloscope_${channel.data.id}`;
      let eleOscilloscope = document.createElement('div');
      eleOscilloscope.id = oscilloscopeId;
      eleTrack.appendChild(eleOscilloscope);
      
      let nxOscilloscope = new Nexus.Oscilloscope(`#${oscilloscopeId}`);
      nxOscilloscope.connect(channel.player);

      //ui.oscilloscope.connect(player2)
    }
  } else {
    console.error('[printBancoTracks] banco', banco);
  }
}

function createBanco(){
  let obj = new Banco(Store.channels);
  let eleBancoTracks = document.getElementById("banco_tracks");
  if(eleBancoTracks) {
    empty(eleBancoTracks);
    printBancoTracks(obj);
  } else {
    console.error('[createBanco] eleBancoTracks is', eleBancoTracks);
  }
  return obj;
}
/*
ready( () => {
  const eleBanco = document.querySelector("banco")
  if (eleBanco) {
    setupBanco();
  }
});
*/

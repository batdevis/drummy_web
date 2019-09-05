class Banco {
  channels = [];

  addChannel(channel) {
    let ch = this.makeChannel(channel);
    this.channels.push(ch);
    return ch;
  }

  addChannels(channels) {
    channels.forEach(channel => {
      this.addChannel(channel);
    });
    return this.channels;
  }
  
  makeChannel(channel) {
    var ch = new Tone.Channel().toMaster();
    let url = `${Store.cfg.audio_folder}/${channel.file}`;
    var player = new Tone.Player({
      url : url,
      loop : true
    }).sync().start(0);
    player.chain(ch);

    return ch;
  }
}

function printBancoTracks(channels, banco) {
  console.log('[printBancoTracks] banco.channels', banco.channels);
  const eleBancoTracks = document.getElementById("banco_tracks");
  if (eleBancoTracks && channels) {
    Nexus.context = Tone.context;
    let i = 0;

    //channels.forEach(channel => {
    for(let i = 0; i < channels.length; i++) {
      let channel = channels[i];
      console.log('[createBanco] channel', channel);
      
      let eleTrack = document.createElement('div');
      eleId = `track_${channel.id}`;
      eleTrack.id = eleId;
      eleBancoTracks.appendChild(eleTrack);
      
      console.log('eleId', eleId);
      let playPauseBtn = new Nexus.TextButton(`#${eleId}`, {
        'size': [150,50],
        'state': false,
        'text': `Activate [${i}] ${channel.name}`,
        'alternateText': `Mute [${i}] ${channel.name}`
      });
      playPauseBtn.on('change', v => {
        console.log('[playPauseBtn]', eleTrack.id, v);
        console.log('[printBancoTracks] banco.channels[i]', i, banco.channels[i]);
        banco.channels[i].mute = !banco.channels[i].mute;
      });
    }
  } else {
    console.error('[printBancoTracks] eleBancoTracks, channels', eleBancoTracks, channels);
  }
}

function createBanco(){
  let obj = new Banco();
  let eleBancoTracks = document.getElementById("banco_tracks");
  if(eleBancoTracks) {
    empty(eleBancoTracks);
    if (Store.channels) {
      obj.addChannels(Store.channels);
      printBancoTracks(Store.channels, obj);
    }
  } else {
    console.error('[createBanco] eleBancoTracks is', eleBancoTracks);
  }
  return obj;
}

//let mixer;

ready( () => {
  const eleBanco = document.querySelector("banco")
  if (eleBanco) {
    setupBanco();
  }
});

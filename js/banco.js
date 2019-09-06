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
    let nxPlayPauseBtn = Nexus.Add.TextButton(`#${eleBancoTracks.id}`, {
      'size': [450,50],
      'state': false,
      'text': 'Play all',
      'alternateText': 'Stop all'
    });
    nxPlayPauseBtn.on('change', v => {
      Tone.Transport.toggle();
    });
    
    // grid
    Ui.setupGrid();

    const channels = banco.channels;
    let i = 0;

    for(let i = 0; i < channels.length; i++) {
      let channel = channels[i];
      
      let eleTrack = document.createElement('div');
      eleTrackId = `track_${channel.data.id}`;
      eleTrack.id = eleTrackId;
      eleBancoTracks.appendChild(eleTrack);

      //oscilloscope
      let nxOscilloscope = Nexus.Add.Oscilloscope(`#${eleTrackId}`);
      nxOscilloscope.connect(channel.player);

      // btn
      let nxBtn = Nexus.Add.Button(`#${eleTrackId}`, {
        'size': [50,50],
        'mode': 'toggle',
        'state': !channel.toneChannel.mute
      });
      nxBtn.on('change', v => {
        console.log('[printBancoTracks] channel.toneChannel', i, channel.toneChannel);
        channel.toneChannel.mute = !channel.toneChannel.mute;
        if(channel.toneChannel.mute) {
          nxOscilloscope.disconnect();
        } else {
          nxOscilloscope.connect(channel.player);
        }
      });
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
  }
});
*/

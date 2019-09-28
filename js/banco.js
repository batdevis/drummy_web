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

  toggleChannel(i) {
    console.log('[Banco] toggleChannel', i);
    this.channels[i].toneChannel.mute = !this.channels[i].toneChannel.mute;
  }
}

function printBancoTracks(banco) {
  console.log('[printBancoTracks] banco.channels', banco.channels);

  const eleBancoPlayall = document.getElementById("banco_playall");
  const eleBancoTracks = document.getElementById("banco_tracks");
  eleBancoPlayall.classList.add('stopped');
  if (eleBancoPlayall && eleBancoTracks && banco.channels) {
    
    // main playPauseBtn
    eleBancoPlayall.addEventListener('click', (e) => {
      Tone.Transport.toggle();
      sleep(100).then(() => {
        if (Tone.Transport.state === 'stopped') {
          e.target.classList.add('stopped');
        } else {
          e.target.classList.remove('stopped');
        }
      });
    });
     
    // grid
    Ui.setupGrid();

    const channels = banco.channels;
    let i = 0;

    for(let i = 0; i < channels.length; i++) {
      let channel = channels[i];
      
      let eleTrack = document.createElement('div');
      let eleTrackId = `track_${channel.data.id}`;
      eleTrack.id = eleTrackId;
      eleTrack.classList.add('track');
      
      //oscilloscope
      let eleTrackWave = document.createElement('div');
      let eleTrackWaveId = `track_wave_${channel.data.id}`;
      eleTrackWave.id = eleTrackWaveId;
			eleTrackWave.classList.add('track_control');
			eleTrackWave.classList.add('track_control_wave');
      
      eleTrack.appendChild(eleTrackWave);
      
      eleBancoTracks.appendChild(eleTrack);

/*      
      let eleToneOscilloscope = document.createElement('tone-oscilloscope');
      eleTrackWave.appendChild(eleToneOscilloscope);
      eleToneOscilloscope.bind(channel.player);
*/      
      let eleToneFft = document.createElement('tone-fft');
      eleTrackWave.appendChild(eleToneFft);
      eleToneFft.addEventListener('click', (e) => {
        e.target.classList.toggle('mute');
        banco.toggleChannel(i)
      });
      //eleToneFft.bind(channel.player);
    }

    sleep(500).then(() => {
      bindPlayers(banco);
    });
  } else {
    console.error('[printBancoTracks] banco', banco);
  }
}

function bindPlayers(banco) {
  const channels = banco.channels;
  let i = 0;

  for(let i = 0; i < channels.length; i++) {
    let channel = channels[i];
    let eleTrackWaveId = `track_wave_${channel.data.id}`;
    let eleTrackWave = document.getElementById(eleTrackWaveId);
    
    let eleToneFft = eleTrackWave.querySelector('tone-fft');
    eleToneFft.bind(channel.player);

    /*
    let eleToneOscilloscope = eleTrackWave.querySelector('tone-oscilloscope');
    eleToneOscilloscope.bind(channel.player);
    */
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

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}


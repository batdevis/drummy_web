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
    console.log('[Banco] toggleChannel', i, this.channels[i].toneChannel.muted);
    this.channels[i].toneChannel.mute = !this.channels[i].toneChannel.mute;
  }
  
  toggleChannelById(channelId) {
    const i = mixer.channels.map(channel => channel.data.id).indexOf(channelId);
    console.log('[Banco] toggleChannelById', channelId, this.channels[i].toneChannel.muted);
    this.toggleChannel(i);
  }
}

function printBancoTracks(banco) {
  console.log('[printBancoTracks] banco.channels', banco.channels);

  const eleBancoPlayall = document.querySelector(".banco_playall");
  const eleBancoTracks = document.getElementById("banco_tracks");
  eleBancoPlayall.classList.add('stopped');
  if (eleBancoPlayall && eleBancoTracks && banco.channels) {
    
    // main playPauseBtn
    eleBancoPlayall.addEventListener('click', (e) => {
      e.preventDefault();
      Tone.Transport.toggle();
      sleep(100).then(() => {
        if (Tone.Transport.state === 'stopped') {
          eleBancoPlayall.classList.add('stopped');
          let gridActive = document.querySelector('.grid.active');
          if (gridActive) {
            gridActive.classList.remove('active');
          }
          let gridQuarter = document.querySelector('.grid.quarter');
          if (gridQuarter) {
            gridQuarter.classList.remove('quarter');
          }
        } else {
          eleBancoPlayall.target.classList.remove('stopped');
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
      
      eleTrack.appendChild(eleTrackWave);
      
      eleBancoTracks.appendChild(eleTrack);

/*      
      let eleToneOscilloscope = document.createElement('tone-oscilloscope');
      eleTrackWave.appendChild(eleToneOscilloscope);
      eleToneOscilloscope.bind(channel.player);
*/      
      let eleToneFft = document.createElement('tone-fft');
      eleTrackWave.appendChild(eleToneFft);
      eleTrackWave.addEventListener('click', (e) => {
        console.log('[mute]', e.target);
        eleTrackWave.classList.toggle('mute');
        banco.toggleChannel(i)
      });
      //eleToneFft.bind(channel.player);
      
      let eleTrackLabel = document.createElement('div');
      eleTrackLabel.classList.add('track_label');
      eleTrackLabel.innerText = channel.data.name;
      eleTrackWave.appendChild(eleTrackLabel);
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
    if (eleToneFft) {
      eleToneFft.bind(channel.player);
    }

    /*
    let eleToneOscilloscope = eleTrackWave.querySelector('tone-oscilloscope');
    if (eleToneOscilloscope) {
      eleToneOscilloscope.bind(channel.player);
    }
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

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

let mixer;

class Mixer {
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

function printMixerTracks(channels) {
  const eleTracks = document.getElementById("tracks");
  if (eleTracks && channels) {
    channels.forEach(channel => {
      console.log('[createMixer] channel', channel);
      let toneChannel = document.createElement('tone-channel');
      toneChannel.label = channel.name;
      toneChannel.id = `channel_${channel.id}`;
      eleTracks.appendChild(toneChannel);
    });
  } else {
    console.error('[printMixerTracks] eleTracks, channels', eleTracks, channels);
  }
}

function createMixer() {
  let obj = new Mixer();
  let eleTracks = document.getElementById("tracks");
  if(eleTracks) {
    empty(eleTracks);
    if (Store.channels) {
      obj.addChannels(Store.channels);
      printMixerTracks(Store.channels);
    }
  } else {
    console.error('[createMixer] eleTracks is', eleTracks);
  }
  return obj;
}

function setupGrid(){
  const metronome = new Tone.Sequence( (time, step) => {
    Tone.Draw.schedule( () => {
      let prevStep = (step === 0) ? 15 : (step - 1);
      document.getElementById(`grid_${prevStep}`).classList.remove('active');
      document.getElementById(`grid_${prevStep}`).classList.remove('quarter');
      document.getElementById(`grid_${step}`).classList.add('active');
      if (step % 4 === 0){
        document.getElementById(`grid_${step}`).classList.add('quarter');
      }
    }, time);
  }, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], "16n").start(0);
}

//let mixer;

ready( () => {
  const eleTonePlayToggle = document.querySelector("tone-play-toggle")
  if (eleTonePlayToggle) {
    eleTonePlayToggle.bind(Tone.Transport);
    setupGrid();
  }
});

class Mixer {
  channels = [];

  addChannel(channel) {
    let ch = this.makeChannel(channel);
    this.channels.push(ch);
    return ch;
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

function createMixer() {
  let obj = new Mixer();
  let tracks = document.getElementById("tracks");

  if (Store.channels) {
    Store.channels.forEach(channel => {
      let toneChannel = document.createElement('tone-channel');
      toneChannel.label = channel.name;
      toneChannel.id = `channel_${channel.id}`;
      tracks.appendChild(toneChannel);

      let ch = obj.addChannel(channel);
      //toneChannel.bind(ch);
    });
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

let mixer;

ready( () => {
  document.querySelector("tone-play-toggle").bind(Tone.Transport);
  setupGrid();
  
  ws.emit('getChannels', {});
  //mixer = createMixer();

  function init(){
    //Ui.bindChannels();
  }

  //wait 1 sec
  async function onetwothreefour() {
    await new Promise(resolve => {
      setTimeout(init, 1000);//millisec
    });
  }

  onetwothreefour();
});

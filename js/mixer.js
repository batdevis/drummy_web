class Mixer {
  channels = [];

  addChannel(channelRef) {
    console.log('[Mixer] addChannel', channelRef);
    let channel = this.makeChannel(channelRef);
    this.channels.push(channel);
    return this;
  }
  
  makeChannel(channelRef) {
    var channel = new Tone.Channel().toMaster();
    let url = `${CFG.audio_folder}/${channelRef}.wav`;
    console.log('[makeChannel] url', url);
    var player = new Tone.Player({
      url : url,
      loop : true
    }).sync().start(0);
    player.chain(channel);

    //bind the UI
    //document.querySelector(`#${channelRef}`).bind(channel);
    /*
    let toneChannel = document.getElementById(channelRef);
    toneChannel.bind(channel);
    */
    return channel;
  }
}

function createMixer() {
  let obj = new Mixer();
  let tracks = document.getElementById("tracks");

  for(let i=0; i < CFG.channel_number; i++){
    let channelRef = "A" + (i + 1);

    let toneChannel = document.createElement('tone-channel');
    toneChannel.label = `CH ${channelRef}`;
    toneChannel.id = channelRef;
    //console.log('[createMixer()] appendChild', toneChannel);
    tracks.appendChild(toneChannel);

    obj.addChannel(channelRef);
  }
  return obj;
}

function bindChannels(){
  for(let i=0; i < CFG.channel_number; i++){
    let channelRef = "A" + (i + 1);
    let toneChannel = document.getElementById(channelRef);
    toneChannel.bind(mixer.channels[i]);
  }
}

function setupGrid(){
/*
  Tone.Transport.scheduleRepeat( time => {
    Tone.Draw.schedule( () => {
      console.log('Tone.Draw', time);
    }, time);
  }, "16n");
*/
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
  console.log('ready.');
  mixer = createMixer();
  document.querySelector("tone-play-toggle").bind(Tone.Transport);
  //document.querySelector("tone-transport").bind(Tone.Transport);

  function init(){
    bindChannels();
    setupGrid();
  }

  //wait 1 sec
  async function onetwothreefour() {
    await new Promise(resolve => {
      setTimeout(init, 1000);//millisec
    });
  }

  onetwothreefour();
});

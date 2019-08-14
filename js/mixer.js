class Mixer {
  channels = [];

  addChannel(channelRef) {
    console.log('[Mixer] addChannel', channelRef);
    let channel = this.makeChannel(channelRef);
    this.channels.push(channel);
    return this;
  }
  
  makeChannel(channelRef) {
    console.log('[Mixer] makeChannel', channelRef);
    var channel = new Tone.Channel().toMaster();
    var player = new Tone.Player({
      url : `./audio/my/A/${channelRef}.[wav|ogg|mp3]`,
      loop : true
    }).sync().start(0);
    player.chain(channel);

    //bind the UI
    //document.querySelector(`#${channelRef}`).bind(channel);
    /*
    let toneChannel = document.getElementById(channelRef);
    console.log('[Mixer] makeChannel toneChannel', toneChannel);
    toneChannel.bind(channel);
    */
    return channel;
  }
}

function createMixer() {
  console.log('createMixer()');
  let obj = new Mixer();
  let tracks = document.getElementById("tracks");

  for(let i=0; i < CFG.channel_number; i++){
    let channelRef = "A" + (i + 1);

    let toneChannel = document.createElement('tone-channel');
    toneChannel.label = `CH ${channelRef}`;
    toneChannel.id = channelRef;
    console.log('[createMixer()] appendChild', toneChannel);
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

let mixer;

ready( () => {
  console.log('ready.');
  mixer = createMixer();
  document.querySelector("tone-play-toggle").bind(Tone.Transport);

  async function bc() {
    await new Promise(resolve => setTimeout(bindChannels, 1000)); // millisec
  }

  bc();
});

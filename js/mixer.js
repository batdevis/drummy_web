class Mixer {
  channels = [];

  addChannel(channelRef) {
    let channel = this.makeChannel(channelRef);
    this.channels.push(channel);
  }
  
  makeChannel(channelRef) {
    var channel = new Tone.Channel().toMaster();
    var player = new Tone.Player({
      url : `./audio/my/A/${channelRef}.[wav|ogg|mp3]`,
      loop : true
    }).sync().start(0);
    player.chain(channel);

    //bind the UI
    document.querySelector(`#${name}`).bind(channel);

    return channel;
  }
}

function createMixer() {
  const mixer = new Mixer();
  let i = 0;
  for(let i; i < CFG.channel_number.length; i++){
    let channelRef = "A" + (i + 1);
    mixer.addChannel(channelRef);
  }
  return mixer;
}
const mixer = createMixer();


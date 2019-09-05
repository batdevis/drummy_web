class Console {
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


function setupConsole(){
}

//let mixer;

ready( () => {
  const eleConsole = document.querySelector("console")
  if (eleConsole) {
    setupConsole();
  }
});

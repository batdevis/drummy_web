const ws = io('http://localhost:8002');

ws.on('midiInputList', function (data) {
  console.log('[ws] midiInputList', data);
  Store.midiInputs = data;

  printMidiInputs();
  printMidiInput();
  printPedalboard();
});

ws.on('midiCc', function (data) {
  console.log('[ws] midiCc', data);

  const channelMap = {
    96: 0,//play/pause
    97: 1,
    98: 2,
    99: 3,
    100: 4
  };

  if (
    (data.channel == 0) &&
    (data.value == 127)
  ){
    if (data.controller == 0) {
      Tone.Transport.toggle();
    } else {
      var channelId = channelMap[data.controller];
      console.log(`toggle(${channelId})`);
      if(mixer.channels.indexOf(channelId) > -1) {
        mixer.channels[channelId].mute = !mixer.channels[channelId].mute;
      }
    }
  }
});

function printMidiInputs(){
  if(typeof(Store.midiInputs) == 'undefined'){
    return;
  }
  const midiInputs = document.getElementById("midi_inputs");

  while (midiInputs.hasChildNodes()) {
    midiInputs.removeChild(midiInputs.firstChild);
  }
  Store.midiInputs.inputs.forEach(input => {
    let li = document.createElement('li');
    let a = document.createElement('a');
    a.href = '#';
    a.innerText = input;
    a.setAttribute('data-device', input);
    a.addEventListener('click', activateMidiInput, false);
    li.appendChild(a);
    midiInputs.appendChild(li);
  });
}

function printMidiInput(){
  const midiInputActive = document.getElementById("midi_input_active");
  const name = (
    Store.midiInputs && 
    Store.midiInputs.active && 
    Store.midiInputs.active.name
  ) || '';
  midiInputActive.innerText = name;
}

function activateMidiInput(e){
  const device = e.target.getAttribute('data-device');
  ws.emit('setMidiInput', {device: device});
}

function printPedalboard(){
  Store.cfg.pedalboard_buttons.forEach(button => {
    let mapping = Store.midiInputs.active.pedalboard.mappings[button.name];
    
    let li = document.createElement('li');
    li.class = 'midi_mapping';
    li.id = `midi_mapping_${button.name}`;
    
    let ee = []
    ee[0] = document.createElement('h5');
    ee[0].innerText = button.title

    ee[1] = document.createElement('p');
    ee[1].innerText = button.description;
    
     
    ee[2] = document.createElement('div');
    ee[2].class = 'midi_mapping_message_type';
    ee[2].id = `midi_mapping_message_type_${button.name}`;
    ee[2].innerText = mapping.message_type;
    
    ee[3] = document.createElement('div');
    ee[3].class = 'midi_mapping_channel';
    ee[3].id = `midi_mapping_channel_${button.name}`;
    ee[3].innerText = mapping.channel;
    
    ee[4] = document.createElement('div');
    ee[4].class = 'midi_mapping_value';
    ee[4].id = `midi_mapping_value_${button.name}`;
    ee[4].innerText = mapping.value;

    ee.forEach(e => li.appendChild(e));
    const midiMapping = document.getElementById("midi_mapping");
    midiMapping.appendChild(li);
  });
}


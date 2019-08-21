const ws = io('http://localhost:8002');

ws.on('midiInputList', function (data) {
  console.log('[ws] midiInputList', data);
  Store.midiInputs = data;

  printMidiInputs();
  printMidiInput();
  printPedalboard();
});

ws.on('fileTree', function (data) {
  console.log('[ws] fileTree', data);
  Store.fileTree = data;

  printFileTree();
});

ws.on('channels', function (data) {
  console.log('[ws] channels', data);
  Store.channels = data.channels;

  printChannels();
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
  if(typeof(Store.midiInputs) === 'undefined'){
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
    console.log('button', button);
    let ee = []
    let tr = document.createElement('tr');

    ee[0] = document.createElement('td');
    ee[0].class = 'midi_mapping_title';
    ee[0].id = `midi_mapping_${button.name}`;
    ee[0].innerText = button.title

    ee[1] = document.createElement('td');
    ee[1].class = 'midi_mapping_description';
    ee[1].id = `midi_mapping_${button.name}`;
    ee[1].innerText = button.description;
     
    ee[2] = document.createElement('td');
    ee[2].class = 'midi_mapping_message_type';
    ee[2].id = `midi_mapping_message_type_${button.name}`;
    ee[2].innerText = mapping.message_type;
    
    ee[3] = document.createElement('td');
    ee[3].class = 'midi_mapping_channel';
    ee[3].id = `midi_mapping_channel_${button.name}`;
    ee[3].innerText = mapping.channel;
    
    ee[4] = document.createElement('td');
    ee[4].class = 'midi_mapping_value';
    ee[4].id = `midi_mapping_value_${button.name}`;
    ee[4].innerText = mapping.value;

    ee.forEach(e => tr.appendChild(e));
    const midiMapping = document.getElementById("midi_mapping");
    midiMapping.appendChild(tr);
  });
}

function printFileTree(){
  if(typeof(Store.fileTree) === 'undefined'){
    return;
  }
  const fileTree = document.getElementById("file_tree");

  while (fileTree.hasChildNodes()) {
    fileTree.removeChild(fileTree.firstChild);
  }

  /*
   *  <ul id="file_tree">
   *    <li>
   *      <h4>a</h4>
   *      <ul>
   *        <li>a1.wav</li>
   *        <li>a2.wav</li>
   *      </ul>
   *    </li>
   *
   *    <li>
   *      <h4>b</h4>
   *      <ul>
   *        <li>b1.wav</li>
   *        <li>b2.wav</li>
   *      </ul>
   *    </li>
   *  </ul>
  */

  Store.fileTree.tree.forEach(dir => {
    let li_0 = document.createElement('li');
    let h4_0 = document.createElement('h4');
    h4_0.innerText = dir.name;
    let ul_0 = document.createElement('ul');

    dir.files.forEach(file => {
      let pathName = `${dir.name}_${file}`;
      console.log('pathName', pathName);
      let li_1 = document.createElement('li');
      li_1.id = `tree_${pathName}`;
      li_1.innerText = file;
      ul_0.appendChild(li_1);
    })

    li_0.appendChild(h4_0);
    li_0.appendChild(ul_0);

    fileTree.appendChild(li_0);
  });
}

function printChannels(){
  if(typeof(Store.channels) === 'undefined'){
    return;
  }
  const channels = document.getElementById("channels");

  while (channels.hasChildNodes()) {
    channels.removeChild(channels.firstChild);
  }
  Store.channels.forEach(channel => {
    let li = document.createElement('li');
    li.innerText = `${channel.name}: ${channel.file}`;
    channels.appendChild(li);
  });
}

const Ui = {
  //setup.html
  printMidiInputs() {
    if(typeof(Store.midiInputs) === 'undefined'){
      return;
    }
    const eleMidiInputs = document.getElementById("midi_inputs");
    if(eleMidiInputs) {
      empty(eleMidiInputs);
      Store.midiInputs.inputs.forEach(input => {
        let li = document.createElement('li');
        let a = document.createElement('a');
        a.href = '#';
        a.innerText = input;
        a.setAttribute('data-device', input);
        a.addEventListener('click', this.activateMidiInput, false);
        li.appendChild(a);
        eleMidiInputs.appendChild(li);
      });
    }
  },

  //setup.html
  printMidiInput() {
    const eleMidiInputActive = document.getElementById("midi_input_active");
    if(eleMidiInputActive) {
      const name = (
        Store.midiInputs && 
        Store.midiInputs.active && 
        Store.midiInputs.active.name
      ) || '';
      eleMidiInputActive.innerText = name;
    }
  },

  //setup.html
  activateMidiInput(e) {
    const device = e.target.getAttribute('data-device');
    wsSend({
      area: 'setMidiInput', 
      content: {device: device}
    });
  },

  //setup.html
  printPedalboard() {
    const eleTbody = document.querySelector("#midi_mapping tbody");
    if(eleTbody) {
      empty(eleTbody);
    } else {
      return;
    }

    let active = Store.midiInputs.active;
    if (typeof(active) === 'undefined') {
      console.error('no active pedalboard');
      return;
    }
    let activePedalboard = active.pedalboard;
      
    Store.cfg.pedalboard_buttons.forEach(button => {
      let mapping = (activePedalboard) ? activePedalboard.mappings[button.name] : null;
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
      ee[2].innerText = mapping ? mapping.message_type : '';
      
      ee[3] = document.createElement('td');
      ee[3].class = 'midi_mapping_channel';
      ee[3].id = `midi_mapping_channel_${button.name}`;
      ee[3].innerText = mapping ? mapping.channel : '';
      
      ee[4] = document.createElement('td');
      ee[4].class = 'midi_mapping_controller';
      ee[4].id = `midi_mapping_controller_${button.name}`;
      ee[4].innerText = mapping ? mapping.controller : '';
      
      ee[5] = document.createElement('td');
      ee[5].class = 'midi_mapping_value';
      ee[5].id = `midi_mapping_value_${button.name}`;
      ee[5].innerText = mapping ? mapping.value : '';

      ee.forEach(e => tr.appendChild(e));
      
      eleTbody.appendChild(tr);
    });
  },

  //filebank.html
  printFileTree() {
    if(typeof(Store.fileTree) === 'undefined'){
      return;
    }
    const eleFileTree = document.getElementById("file_tree");
    if(eleFileTree === null){
      return;
    }
    const eleFileTreeWrapper = document.getElementById("file_tree_wrapper");

    empty(eleFileTree);

    /*
     *  <ul id="file_tree">
     *    <li>
     *      <h4>a</h4>
     *      <ul>
     *        <li id="tree_a_a1.wav">a1.wav</li>
     *        <li id="tree_a_a2.wav>a2.wav</li>
     *      </ul>
     *    </li>
     *
     *    <li>
     *      <h4>b</h4>
     *      <ul>
     *        <li id="tree_b_b1.wav>b1.wav</li>
     *        <li id="tree_b_b2.wav>b2.wav</li>
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
        let filePath = `${dir.name}/${file}`;

        let a = document.createElement('a');
        a.innerText = file;
        a.setAttribute('data-filepath', filePath);
        a.href = '#';
        a.addEventListener('click', (e) => {
          e.preventDefault();
          let channelId = document.querySelector('#file_tree').getAttribute('data-channel-id');
          this.saveChannel(channelId, filePath);
          eleFileTreeWrapper.style.display = 'none';
        });
        
        let li_1 = document.createElement('li');
        li_1.id = `tree_${pathName}`;
        li_1.appendChild(a);
        
        ul_0.appendChild(li_1);
      })

      li_0.appendChild(h4_0);
      li_0.appendChild(ul_0);

      eleFileTree.appendChild(li_0);
    });
  },

  //filebank.html
  saveChannel(channelId, filePath) {
    const data = {
      channelId: channelId,
      filePath: filePath
    };
    console.log('[saveChannel]', data);
    wsSend({
      area: 'setChannelFile', 
      content: data
    });
  },
/*
  //filebank.html
  printChannels() {
    if(typeof(Store.channels) === 'undefined'){
      return;
    }
    const eleChannelsList = document.getElementById("channels");
    if (eleChannelsList) {
      empty(eleChannelsList);

      Store.channels.forEach(channel => {
        let li = document.createElement('li');
        li.id = `channelFile_${channel.id}`;
        
        let a = document.createElement('a');
        a.href = '#';
        a.innerText = channel.name;
        a.addEventListener('click', (e) => {
          e.preventDefault();
          this.selectChannel(channel);
        });

        let span = document.createElement('span');
        let file = channel.file || '--';
        span.innerText = `: ${file}`;

        li.appendChild(a);
        li.appendChild(span);

        eleChannelsList.appendChild(li);
      });
    }
  },
*/
  //filebank.html
  printChannelList() {
    if(typeof(Store.channels) === 'undefined'){
      return;
    }
    
    const eleChannelList = document.getElementById("channel_list");
    if (eleChannelList) { 
      empty(eleChannelList);
      for(let i = 0; i < Store.channels.length; i++) {
        let channel = Store.channels[i];
        
        let eleTrack = document.createElement('div');
        let eleTrackId = `track_${channel.id}`;
        eleTrack.id = eleTrackId;
        eleTrack.classList.add('track');

        let eleTrackWave = document.createElement('div');
        eleTrackWave.id = `channelFile_${channel.id}`;
        eleTrackWave.classList.add('track_control');
        
        let a = document.createElement('a');
        a.href = '#';
        let file = channel.file || '--';
        a.innerText = `${channel.name}: ${file}`;
        a.addEventListener('click', (e) => {
          e.preventDefault();
          this.selectChannel(channel);
          let eleSelected = document.querySelector('.track_control.selected');
          if (eleSelected) {
            eleSelected.classList.remove('selected');
          }
          eleTrackWave.classList.add('selected');
        });

        eleTrackWave.appendChild(a);

        eleTrack.appendChild(eleTrackWave);
        
        eleChannelList.appendChild(eleTrack);
      }
    }
  },

  //filebank.html
  selectChannel(channel) {
    const eleChannels = document.getElementById("channels");
    const children = eleChannels.children;
    const activeLis = document.querySelector('#channels .active');
    if (activeLis) {
      activeLis.classList.remove('active');
    }
    if (typeof(channel) !== 'undefined') {
      const eleChannelLink = document.getElementById(`channelFile_${channel.id}`);
      eleChannelLink.classList.add('active');
      this.showFileTree(channel);
    } else {
      this.showFileTree();
    }
  },

  //filebank.html
  showFileTree(channel) {
    console.log('showFileTree', channel);
    console.log('typeof(channel)', typeof(channel));
    const eleFileTreeWrapper = document.getElementById('file_tree_wrapper');
    const eleFileTree = document.getElementById('file_tree');
    if (typeof(channel) !== 'undefined') {
      const eleChannelName = document.querySelector('#file_tree_wrapper h3 span');
      eleFileTree.setAttribute('data-channel-id', channel.id);
      eleChannelName.innerText = channel.name;
      eleFileTreeWrapper.style.display = 'block';
    } else {
      eleFileTreeWrapper.style.display = 'none';
    }
  },

  //mixer.html
  bindChannels(mixer) {
    console.log('[printMixer] bindChannels(mixer)', mixer);
    if (mixer.channels.length) {
      let i = 0;
      Store.channels.forEach(channel => {
        let channelRef = `channel_${channel.id}`;
        let eleToneChannel = document.getElementById(channelRef);
        eleToneChannel.bind(mixer.channels[i]);
        i++;
      });
    }
  },
  
  //mixer.html
  printMixer() {
    if (document.getElementById('mixer')) {
      const mixer = createMixer();
       
      function bindChannelsMixer() {
        Ui.bindChannels(mixer);
      } 
      //wait 1 sec
      async function onetwothreefour() {
        await new Promise(resolve => {
          setTimeout(bindChannelsMixer, 1000);//millisec
        });
      }
      onetwothreefour();
    }
  },
  
  //banco.html
  printBanco() {
    if (document.getElementById('banco')) {
      mixer = createBanco();
    }
  },

  setupGrid() {
    console.log('[setupGrid] ------------------------------');
    const metronome = new Tone.Sequence( (time, step) => {
      step = (step === 0) ? 15 : (step - 1);
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

};

function empty(ele) {
  while (ele.hasChildNodes()) {
    ele.removeChild(ele.firstChild);
  }
}

const Ui = {
  printMidiInputs() {
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
      a.addEventListener('click', this.activateMidiInput, false);
      li.appendChild(a);
      midiInputs.appendChild(li);
    });
  },

  printMidiInput() {
    const midiInputActive = document.getElementById("midi_input_active");
    const name = (
      Store.midiInputs && 
      Store.midiInputs.active && 
      Store.midiInputs.active.name
    ) || '';
    midiInputActive.innerText = name;
  },

  activateMidiInput(e) {
    const device = e.target.getAttribute('data-device');
    wsSend({
      area: 'setMidiInput', 
      content: {device: device}
    });
  },

  printPedalboard() {
    const tbody = document.querySelector("#midi_mapping tbody");
    while (tbody.hasChildNodes()) {
      tbody.removeChild(tbody.firstChild);
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
      tbody.appendChild(tr);
    });
  },

  printFileTree() {
    if(typeof(Store.fileTree) === 'undefined'){
      return;
    }
    const fileTree = document.getElementById("file_tree");
    if(fileTree === null){
      return;
    }
    const fileTreeWrapper = document.getElementById("file_tree_wrapper");

    while (fileTree.hasChildNodes()) {
      fileTree.removeChild(fileTree.firstChild);
    }

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
          fileTreeWrapper.style.display = 'none';
        });
        
        let li_1 = document.createElement('li');
        li_1.id = `tree_${pathName}`;
        li_1.appendChild(a);
        
        ul_0.appendChild(li_1);
      })

      li_0.appendChild(h4_0);
      li_0.appendChild(ul_0);

      fileTree.appendChild(li_0);
    });
  },

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

  printChannels() {
    if(typeof(Store.channels) === 'undefined'){
      return;
    }
    const channelsList = document.getElementById("channels");
    if (channelsList) {
      while (channelsList.hasChildNodes()) {
        channelsList.removeChild(channelsList.firstChild);
      }
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

        channels.appendChild(li);
      });
    }
  },

  selectChannel(channel) {
    const channels = document.getElementById("channels");
    const children = channels.children;
    const activeLis = document.querySelector('#channels .active');
    if (activeLis) {
      activeLis.classList.remove('active');
    }
    if (typeof(channel) !== 'undefined') {
      const channelLink = document.getElementById(`channelFile_${channel.id}`);
      channelLink.classList.add('active');
      this.showFileTree(channel);
    } else {
      this.showFileTree();
    }
  },

  showFileTree(channel) {
    console.log('showFileTree', channel);
    console.log('typeof(channel)', typeof(channel));
    const fileTreeWrapper = document.getElementById('file_tree_wrapper');
    const fileTree = document.getElementById('file_tree');
    if (typeof(channel) !== 'undefined') {
      const channelName = document.querySelector('#file_tree_wrapper h3 span');
      const fileTree = document.getElementById('file_tree');
      fileTree.setAttribute('data-channel-id', channel.id);
      channelName.innerText = channel.name;
      fileTreeWrapper.style.display = 'block';
    } else {
      fileTreeWrapper.style.display = 'none';
    }
  },

  bindChannels() {
    if (mixer.channels.length) {
      let i = 0;
      Store.channels.forEach(channel => {
        let channelRef = `channel_${channel.id}`;
        let toneChannel = document.getElementById(channelRef);
        toneChannel.bind(mixer.channels[i]);
        i++;
      });
    }
  },
  
  createMixer() {
    if (document.getElementById('mixer')) {
      mixer = createMixer();
      
      //wait 1 sec
      async function onetwothreefour() {
        await new Promise(resolve => {
          setTimeout(Ui.bindChannels, 1000);//millisec
        });
      }
      onetwothreefour();
    }
  }

};


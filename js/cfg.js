const CFG = {
  channel_number: 4,
  audio_folder: 'audio/hydrogen';
  pedalboard_buttons: [
    {
      name: "track01",
      title: '01',
      description: 'mute / unmute track 01'
    },
    {
      name: "track02",
      title: '02',
      description: 'mute / unmute track 02'
    },
    {
      name: "track03",
      title: '03',
      description: 'mute / unmute track 03'
    },
    {
      name: "track04",
      title: '04',
      description: 'mute / unmute track 04'
    },
    {
      name: "play_pause_all",
      title: 'play/pause all',
      description: 'play/pause all'
    },
    {
      name: "layer_mode",
      title: 'extra',
      description: 'not used'
    }
  ]
};

Store.cfg = CFG;

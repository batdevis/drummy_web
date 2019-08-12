document.getElementById("midi_input_refresh").onClick = midiInputList;

function midiInputList(){
  ws.emit('midiInputList', {});
}

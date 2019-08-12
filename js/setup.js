const btn = document.getElementById("midi_input_refresh");
btn.addEventListener('click', getMidiInputList);

function getMidiInputList(){
  console.log('getMidiInputList()');
  ws.emit('getMidiInputList', {});
}

ready(getMidiInputList);

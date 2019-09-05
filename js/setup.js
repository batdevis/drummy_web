const eleBtn = document.getElementById("midi_input_refresh");
eleBtn.addEventListener('click', getMidiInputList);

function getMidiInputList(){
  console.log('getMidiInputList()');
  wsSend({area: 'getMidiInputList'});
}

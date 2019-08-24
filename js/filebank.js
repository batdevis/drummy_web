function getFileTree(){
  console.log('getFileTree()');
  ws.emit('getFileTree', {});
}

function getChannels(){
  console.log('getChannels()');
  ws.emit('getChannels', {});
}

ready(getFileTree);
ready(getChannels);

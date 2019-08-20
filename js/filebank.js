const btn = document.getElementById("file_tree_refresh");
btn.addEventListener('click', getFileTree);

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

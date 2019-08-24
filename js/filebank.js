ready( () => {
  ws.emit('getFileTree', {});
  ws.emit('getChannels', {});
})

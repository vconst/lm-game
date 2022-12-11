var socket = io('https://lm-game-server.vconst.repl.co');

socket.on('connect', function() {
  socket.emit('addPlayer', {
    playerName: 'test'
  });
});

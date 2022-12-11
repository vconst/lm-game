var socket = io('https://lm-game-server.vconst.repl.co');

const playerIndex = Math.floor(Math.random() * 10000);

socket.on('connect', function() {
  socket.emit('addPlayer', {
    playerName: playerIndex.toString()
  });
});

socket.on('addPlayer', function(player) {
   console.log('addPlayer', player.playerName);
});



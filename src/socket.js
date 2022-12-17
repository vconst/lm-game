const socket = io('https://lm-game-server.vconst.repl.co');

const playerName = Math.floor(Math.random() * 10000).toString();

socket.on('connect', function() {
  socket.emit('addPlayer', {
    playerName
  });
});

socket.on('addPlayer', function(player) {
   console.log('addPlayer', player.playerName);
});

export default {
  on: socket.on.bind(socket),
  emit: socket.emit.bind(socket),
  playerName
}

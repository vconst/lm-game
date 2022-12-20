const socket = io('https://lm-game-server.vconst.repl.co');

export default {
  on: socket.on.bind(socket),
  off: socket.off.bind(socket),
  emit: socket.emit.bind(socket)
}

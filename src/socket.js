// const socket = io('https://lm-game-server.vconst.repl.co');
const socket = io('http://91.210.171.100:4444');

export default {
  on: socket.on.bind(socket),
  off: socket.off.bind(socket),
  emit: socket.emit.bind(socket)
}

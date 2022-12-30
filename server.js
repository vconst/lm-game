const http = require('http');
const sockets = require('socket.io')

const server = http.createServer();
const io = sockets(server, {
  cors: {
    // origin: "https://vconst.github.io",
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', function(connection) {
  console.log('connect');
  connection.onAny((eventName, params) => {
    //console.log(eventName);
    connection.broadcast.emit(eventName, params);
  });
});

server.listen(4444, function() {
  console.log('listening on 4444');
});

var fs, http, httpHandler, socketio, start;

http = require('http');

socketio = require('socket.io');

fs = require('fs');

start = function() {
  var app, io;
  app = http.createServer(httpHandler);
  app.listen(8080);
  io = socketio.listen(app);
  return io.sockets.on('connection', function(_socket) {
    console.log('new connection');
    _socket.emit('hello', 'hello');
    return _socket.on('echo', function(data) {
      console.log('echo', data);
      return _socket.emit('echo', data);
    });
  });
};

httpHandler = function(_req, _res) {
  console.log("http request", _req.url);
  return fs.readFile(__dirname + _req.url, function(_err, _data) {
    if (_err) {
      _res.writeHead(500);
      return _res.end('error loading');
    }
    _res.writeHead(200);
    return _res.end(_data);
  });
};

start();

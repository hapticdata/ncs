(function() {
  var fs, http, httpHandler, io, path, socketHandler, socketio, start, startsWith;

  http = require('http');

  fs = require('fs');

  path = require('path');

  socketio = require('socket.io');

  io = null;

  start = function() {
    var app;
    app = http.createServer(httpHandler);
    app.listen(8080);
    io = socketio.listen(app);
    return io.sockets.on('connection', socketHandler);
  };

  /*
  This is the NCS server.
  */

  socketHandler = function(_socket) {
    console.log('new connection');
    _socket.emit('hello', 'hello');
    _socket.on('message', function(_data) {
      console.log('message', _data);
      return io.sockets.send(_data);
    });
    return _socket.on('echo', function(_data) {
      console.log('echo', _data);
      return _socket.emit('echo', _data);
    });
  };

  /*
  Very basic http server, simply attempts to send the file in the _req.url
  Intended only for serving tests and examples
  Does check if the file exists, and if the file is in the /test subdirectory
  maybe this should be replaced with express?
  */

  httpHandler = function(_req, _res) {
    var filePath;
    console.log("http request:", _req.url);
    filePath = __dirname + _req.url;
    if (!path.existsSync(filePath)) {
      console.log('not found');
      _res.writeHead(404);
      return _res.end('not found');
    }
    console.log("file:", filePath);
    filePath = fs.realpathSync(filePath);
    if (!startsWith(__dirname + '/test/', filePath)) {
      console.log('forbidden');
      _res.writeHead(500);
      return _res.end('forbidden');
    }
    return fs.readFile(filePath, function(_err, _data) {
      if (_err) {
        console.log("error");
        _res.writeHead(500);
        return _res.end('error');
      }
      console.log('success');
      _res.writeHead(200);
      return _res.end(_data);
    });
  };

  startsWith = function(_needle, _haystack) {
    return _haystack.substr(0, _needle.length) === _needle;
  };

  start();

}).call(this);

(function() {
  var count, every, socket;

  every = function(_ms, _func) {
    return setInterval(_func, _ms);
  };

  count = 0;

  socket = io.connect('http://localhost:8080');

  socket.on('hello', function(_data) {
    return console.log('got hello from server:', _data);
  });

  socket.on('echo', function(_data) {
    return console.log('receive echo:', _data);
  });

  every(1000, function() {
    console.log('sending echo:', count);
    return socket.emit('echo', count++);
  });

}).call(this);

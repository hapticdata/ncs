(function() {
  var count, echoStart, every, screenLog;

  count = 0;

  echoStart = null;

  $(function() {
    var socket;
    socket = io.connect('http://localhost:8080');
    socket.on('hello', function(_data) {
      return screenLog('received hello: ' + _data);
    });
    socket.on('echo', function(_data) {
      var time;
      time = Date.now() - echoStart;
      screenLog('received echo: ' + _data);
      return screenLog("took: " + time + "ms");
    });
    return $("#send").click(function(event) {
      screenLog('sending echo: ' + count);
      echoStart = Date.now();
      return socket.emit('echo', count++);
    });
  });

  screenLog = function(_value) {
    return $("#console").append($("<div>" + (_value.toString()) + "</div>"));
  };

  every = function(_ms, _func) {
    return setInterval(_func, _ms);
  };

}).call(this);

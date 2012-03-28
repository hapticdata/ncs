(function() {
  var screenLog;

  $(function() {
    console.log("start");
    ncs.connect('localhost:8080', "ncs_test");
    ncs.onreceive(function(_key, _value) {
      var time;
      if (_key === 'hello') screenLog('received hello: ' + _value);
      if (_key === 'echo') {
        time = Date.now() - _value;
        return screenLog("received echo(" + _value + ") in " + time + "ms");
      }
    });
    return $("#send").click(function(event) {
      screenLog('sending echo: testing');
      return ncs.send('echo', Date.now());
    });
  });

  screenLog = function(_value) {
    return $("#console").append($("<div>" + (_value.toString()) + "</div>"));
  };

}).call(this);

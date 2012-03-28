(function() {
  var NCS, loadJS;

  NCS = (function() {

    function NCS() {}

    NCS.onreceive = null;

    NCS.prototype.connect = function(host, name) {
      var _this = this;
      this.host = host;
      this.name = name;
      return loadJS("http://" + this.host + "/socket.io/socket.io.js", function() {
        _this.socket = io.connect("http://" + _this.host);
        return _this.socket.on('message', function(_data) {
          return _this.onmessage(_data);
        });
      });
    };

    NCS.prototype.send = function(_key, _value) {
      if (!this.socket) return;
      return this.socket.send(JSON.stringify({
        name: this.name,
        key: _key,
        value: _value
      }));
    };

    NCS.prototype.onmessage = function(_data) {
      _data = JSON.parse(_data);
      if (typeof this.onreceiveCallback === "function") {
        return this.onreceiveCallback(_data.key, _data.value);
      }
    };

    NCS.prototype.onreceive = function(onreceiveCallback) {
      this.onreceiveCallback = onreceiveCallback;
    };

    return NCS;

  })();

  window.ncs = new NCS;

  loadJS = function(_src, _callback) {
    var script;
    script = document.createElement('script');
    script.onload = function() {
      if (typeof _callback === "function") return _callback();
    };
    script.src = _src;
    return document.getElementsByTagName('head')[0].appendChild(script);
  };

}).call(this);

(function() {
  var LocalSender, NCSMonitor, Widget, WidgetBoolean, WidgetColor, WidgetFloat, WidgetString, after, clamp, every, isNumber, isTrue, mapRange, messageCount, random, round, socket,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  socket = null;

  messageCount = 0;

  $(function() {
    var dashboard;
    console.log("Hello, NCSMonitor.");
    dashboard = new NCSMonitor($(".NCSMonitor")[0]);
    dashboard.addWidgetClass(WidgetColor);
    dashboard.addWidgetClass(WidgetFloat);
    dashboard.addWidgetClass(WidgetBoolean);
    dashboard.addWidgetClass(WidgetString);
    dashboard.addWidgetClass(Widget);
    ncs.connect(location.host, 'ncs_monitor');
    ncs.onreceive(function(_key, _value) {
      return dashboard.receive(_key, _value);
    });
    return $('#send-mouse').click(function(_e) {
      return $('html').mousemove(function(_e) {
        ncs.send("mouseX", _e.pageX);
        return ncs.send("mouseY", _e.pageY);
      });
    });
  });

  LocalSender = (function() {

    function LocalSender(dashboard) {
      var _this = this;
      this.dashboard = dashboard;
      this.startTime = Date.now();
      this.temperature = 20;
      every(1000, function() {
        var names;
        names = ["Amy", "Beth", "Cathy"];
        return _this.dashboard.receive("name", names[Math.floor(random(0, 3))]);
      });
      every(800, function() {
        return _this.dashboard.receive("isOn", Boolean((Date.now() - _this.startTime) % 2));
      });
      every(150, function() {
        return _this.dashboard.receive("color", '#' + (Math.random() * 0xFFFFFF << 0).toString(16));
      });
      every(150, function() {
        return _this.dashboard.receive("temperature", _this.temperature += random(-1, 1));
      });
      every(33, function() {
        return _this.dashboard.receive("mouseX", Math.sin((Date.now() - _this.startTime) / 1000.0) * 512 + 512);
      });
      every(33, function() {
        return _this.dashboard.receive("mouseY", Math.cos((Date.now() - _this.startTime) / 1000.0) * 384 + 384);
      });
    }

    return LocalSender;

  })();

  NCSMonitor = (function() {

    function NCSMonitor(_elem) {
      this.elem = $(_elem);
      this.elem.empty();
      this.elem.append("<div class=\"column\" />");
      this.elem.append("<div class=\"column\" />");
      this.elem.append("<div class=\"column\" />");
      this.widgetClasses = [];
      this.widgets = {};
    }

    NCSMonitor.prototype.receive = function(_key, _value) {
      if (!this.widgets[_key]) this.widgets[_key] = this.widgetForValue(_value);
      return this.widgets[_key].update(_key, _value);
    };

    NCSMonitor.prototype.widgetForValue = function(_value) {
      var widgetClass, _i, _len, _ref;
      _ref = this.widgetClasses;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        widgetClass = _ref[_i];
        if (widgetClass.matches(_value)) {
          return new widgetClass($($(".column")[0]));
        }
      }
    };

    NCSMonitor.prototype.addWidgetClass = function(_widget) {
      return this.widgetClasses.push(_widget);
    };

    return NCSMonitor;

  })();

  Widget = (function() {

    function Widget(_parentElem) {
      var list,
        _this = this;
      this.count = 0;
      this.freq = 0;
      this._freqCount = 0;
      this.elem = $("<div class = \"widget\">");
      this.elem.append(list = $("<ul class = \"common\">"));
      list.append(this.keyElem = $("<li class = \"key\">"));
      list.append(this.countElem = $("<li class = \"count\">"));
      list.append(this.freqElem = $("<li class = \"freq\">"));
      _parentElem.append(this.elem);
      every(1000, function() {
        _this.freq = _this._freqCount;
        _this.freqElem.html(_this.freq);
        return _this._freqCount = 0;
      });
    }

    Widget.prototype.update = function(_key, _value) {
      this.count++;
      this._freqCount++;
      this.keyElem.html(_key);
      this.countElem.html(this.count);
      return this.freqElem.html(this.freq);
    };

    Widget.matches = function(_value) {
      return true;
    };

    return Widget;

  })();

  WidgetFloat = (function(_super) {

    __extends(WidgetFloat, _super);

    function WidgetFloat(_parentElem) {
      var bar, div;
      console.log("Construct Widget Float");
      WidgetFloat.__super__.constructor.call(this, _parentElem);
      this.min = 0;
      this.max = 1;
      div = $("<div class = \"custom float\">");
      div.append(this.valueElem = $("<span class = \"value\">"));
      div.append(bar = $("<div class = \"indicator bar\">"));
      bar.append(this.minElem = $("<div class = \"min\">"));
      bar.append(this.maxElem = $("<div class = \"max\">"));
      bar.append(this.thumbElem = $("<div class = \"thumb\">"));
      this.elem.append(div);
    }

    WidgetFloat.prototype.update = function(_key, _value) {
      WidgetFloat.__super__.update.call(this, _key, _value);
      this.max = Math.max(_value, this.max);
      this.min = Math.min(_value, this.min);
      this.valueElem.html(round(_value, 2));
      this.minElem.html(round(this.min, 2));
      this.maxElem.html(round(this.max, 2));
      return this.thumbElem.css("left", mapRange(_value, this.min, this.max, 0, 100, true) + "%");
    };

    WidgetFloat.matches = function(_value) {
      return typeof _value === "number" || isNumber(_value);
    };

    return WidgetFloat;

  })(Widget);

  WidgetBoolean = (function(_super) {

    __extends(WidgetBoolean, _super);

    function WidgetBoolean(_parentElem) {
      var div;
      console.log("Construct Widget Boolean");
      WidgetBoolean.__super__.constructor.call(this, _parentElem);
      div = $("<div class = \"custom boolean\">");
      div.append(this.valueElem = $("<span class = \"value\">"));
      div.append(this.indicatorElem = $("<div class = \"indicator light\">"));
      this.elem.append(div);
    }

    WidgetBoolean.prototype.update = function(_key, _value) {
      WidgetBoolean.__super__.update.call(this, _key, _value);
      this.valueElem.html(isTrue(_value) ? "true" : "false");
      if (isTrue(_value)) {
        return this.indicatorElem.addClass("on");
      } else {
        return this.indicatorElem.removeClass("on");
      }
    };

    WidgetBoolean.matches = function(_value) {
      return typeof _value === "boolean" || _value === "true" || _value === "false";
    };

    return WidgetBoolean;

  })(Widget);

  WidgetString = (function(_super) {

    __extends(WidgetString, _super);

    function WidgetString(_parentElem) {
      var div;
      console.log("Construct Widget String");
      WidgetString.__super__.constructor.call(this, _parentElem);
      div = $("<div class = \"custom string\">");
      div.append(this.valueElem = $("<span class = \"value\">"));
      this.elem.append(div);
    }

    WidgetString.prototype.update = function(_key, _value) {
      WidgetString.__super__.update.call(this, _key, _value);
      return this.valueElem.html(_value);
    };

    WidgetString.matches = function(_value) {
      return typeof _value === "string";
    };

    return WidgetString;

  })(Widget);

  WidgetColor = (function(_super) {

    __extends(WidgetColor, _super);

    function WidgetColor(_parentElem) {
      var div;
      console.log("Construct Widget Color");
      WidgetColor.__super__.constructor.call(this, _parentElem);
      div = $("<div class = \"custom color\">");
      div.append(this.valueElem = $("<span class = \"value\">"));
      div.append(this.indicatorElem = $("<div class = \"indicator light\">"));
      this.elem.append(div);
    }

    WidgetColor.prototype.update = function(_key, _value) {
      WidgetColor.__super__.update.call(this, _key, _value);
      this.valueElem.html(_value);
      return this.indicatorElem.css("background-color", _value);
    };

    WidgetColor.matches = function(_value) {
      var pattern;
      pattern = new RegExp("^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$");
      return typeof _value === "string" && pattern.test(_value);
    };

    return WidgetColor;

  })(Widget);

  after = function(_ms, _callback) {
    return setTimeout(_callback, _ms);
  };

  every = function(_ms, _callback) {
    return setInterval(_callback, _ms);
  };

  random = function(_min, _max) {
    return Math.random() * (_max - _min) + _min;
  };

  round = function(_value, _places) {
    var mult;
    if (_places == null) _places = 0;
    mult = Math.pow(10, _places);
    return Math.round(_value * mult) / mult;
  };

  mapRange = function(_value, _min, _max, _newMin, _newMax, _clamp) {
    var temp;
    if (_clamp == null) _clamp = false;
    temp = (_value - _min) / (_max - _min);
    temp = temp * (_newMax - _newMin) + _newMin;
    if (_clamp) return clamp(temp, _newMin, _newMax);
    return temp;
  };

  clamp = function(_value, _min, _max) {
    return Math.max(_min, Math.min(_max, _value));
  };

  isNumber = function(_n) {
    return !isNaN(parseFloat(_n)) && isFinite(_n);
  };

  isTrue = function(_n) {
    if (typeof _n === "boolean") return _n;
    if (typeof _n === "string") return _n === "true";
    return Boolean(_n);
  };

}).call(this);

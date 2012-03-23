# NCSDashboard

$ ()->
	console.log "Hello, NCSDashboard."
	dashboard = new NCSDashboard($(".NCSDashboard")[0])
	dashboard.addWidgetClass WidgetColor
	dashboard.addWidgetClass WidgetFloat
	dashboard.addWidgetClass WidgetBoolean
	dashboard.addWidgetClass WidgetString
	dashboard.addWidgetClass Widget
	new Sender(dashboard)

class Sender
	constructor: (@dashboard) ->
		@startTime = Date.now()
		@temperature = 20
		every 1000, () =>
			names = ["Amy", "Beth", "Cathy"]
			@dashboard.receive "name", names[Math.floor(random(0,3))]
		every 800, () =>
			@dashboard.receive "isOn", Boolean((Date.now() - @startTime) % 2)
		every 150, () =>
			@dashboard.receive "color", '#'+(Math.random()*0xFFFFFF<<0).toString(16);
		every 150, () =>
			@dashboard.receive "temperature", @temperature += random(-1, 1)
		every 33, () =>
			@dashboard.receive "mouseX", Math.sin((Date.now() - @startTime)/1000.0) * 512 + 512
		every 33, () =>
			@dashboard.receive "mouseY", Math.cos((Date.now() - @startTime)/1000.0) * 384 + 384

class NCSDashboard
	constructor: (_elem) ->
		@elem = $(_elem)
		@elem.empty()
		@elem.append("""<div class="column" />""")
		@elem.append("""<div class="column" />""")
		@elem.append("""<div class="column" />""")

		@widgetClasses = []
		@widgets = {}

	receive: (_key, _value) ->
		# console.log "dash-receive", _key, _value
		if !@widgets[_key]
			@widgets[_key] = @widgetForValue _value
		
		@widgets[_key].update _key, _value

	widgetForValue: (_value) ->
		for widgetClass in @widgetClasses
			if widgetClass.matches _value
				return new widgetClass $($(".column")[0])
		# @todo this function will need to find the best Widget Subclass for the given value type
		# return new WidgetFloat($($(".column")[0]))

	addWidgetClass: (_widget) ->
		@widgetClasses.push(_widget)
		


class Widget
	constructor: (_parentElem) ->
		#init state
		@count = 0
		@freq = 0
		@_freqCount = 0

		#build view
		@elem = $("""<div class = "widget">""")
		@elem.append list = $("""<ul class = "common">""")
		list.append @keyElem = $("""<li class = "key">""")
		list.append @countElem = $("""<li class = "count">""")
		list.append @freqElem = $("""<li class = "freq">""")
		_parentElem.append(@elem)
		
		#periodic maintenance
		every 1000, ()=>
			@freq = @_freqCount
			@freqElem.html @freq
			@_freqCount = 0


	update: (_key, _value) ->
		#update state
		@count++
		@_freqCount++

		#update view
		@keyElem.html _key
		@countElem.html @count
		@freqElem.html @freq

	@matches: (_value) ->
		return true;

class WidgetFloat extends Widget
	constructor: (_parentElem) ->
		console.log "Construct Widget Float"
		super _parentElem

		#init state
		@min = 0
		@max = 1

		#build view
		div = $("""<div class = "custom float">""")
		div.append @valueElem = $("""<span class = "value">""")
		div.append bar = $("""<div class = "indicator bar">""")
		bar.append @minElem = $("""<div class = "min">""")
		bar.append @maxElem = $("""<div class = "max">""")
		bar.append @thumbElem = $("""<div class = "thumb">""")
		@elem.append div

	update: (_key, _value) ->
		super _key, _value

		#update state
		@max = Math.max _value, @max
		@min = Math.min _value, @min

		#updte view
		@valueElem.html round(_value, 2)
		@minElem.html round(@min, 2)
		@maxElem.html round(@max, 2)
		@thumbElem.css "left", mapRange(_value, @min, @max, 0, 100, true) + "%"
	
	@matches: (_value) ->
		return typeof _value == "number" || isNumber _value

class WidgetBoolean extends Widget
	constructor: (_parentElem) ->
		console.log "Construct Widget Boolean"

		super _parentElem

		#build view
		div = $("""<div class = "custom boolean">""")
		div.append @valueElem = $("""<span class = "value">""")
		div.append @indicatorElem = $("""<div class = "indicator light">""")
		@elem.append div

	update: (_key, _value) ->
		super _key, _value

		#updte view
		@valueElem.html if isTrue(_value) then "true" else "false"
		if isTrue(_value)
			@indicatorElem.addClass "on"
		else
			@indicatorElem.removeClass "on"
	

	@matches: (_value) ->
		return typeof _value == "boolean" || _value == "true" || _value == "false"

class WidgetString extends Widget
	constructor: (_parentElem) ->
		console.log "Construct Widget String"

		super _parentElem

		#build view
		div = $("""<div class = "custom string">""")
		div.append @valueElem = $("""<span class = "value">""")
		@elem.append div

	update: (_key, _value) ->
		super _key, _value

		#updte view
		@valueElem.html _value

	@matches: (_value) ->
		return typeof _value == "string"

class WidgetColor extends Widget
	constructor: (_parentElem) ->
		console.log "Construct Widget Color"

		super _parentElem

		#build view
		div = $("""<div class = "custom color">""")
		div.append @valueElem = $("""<span class = "value">""")
		div.append @indicatorElem = $("""<div class = "indicator light">""")
		@elem.append div

	update: (_key, _value) ->
		super _key, _value

		#updte view
		@valueElem.html _value
		@indicatorElem.css "background-color", _value

	@matches: (_value) ->
		pattern = new RegExp "^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$"
		return (typeof _value == "string" && pattern.test _value)


			
#####################################################
## Util


after = (_ms, _callback) -> 
	setTimeout _callback, _ms

every = (_ms, _callback) -> 
	setInterval _callback, _ms

random = (_min, _max) ->
	return Math.random() * (_max - _min) + _min;  

round = (_value, _places = 0) ->
	mult = Math.pow(10, _places)
	return Math.round(_value*mult)/mult

mapRange = (_value, _min, _max, _newMin, _newMax, _clamp = false) ->
	temp = (_value - _min) / (_max - _min)
	temp = temp*(_newMax - _newMin) + _newMin
	if _clamp then return clamp temp, _newMin, _newMax
	return temp

clamp = (_value, _min, _max) ->
	return Math.max(_min, Math.min(_max, _value))


isNumber = (_n)->
	return !isNaN(parseFloat(_n)) && isFinite(_n)

isTrue = (_n) ->
	if typeof _n == "boolean" then return _n
	if typeof _n == "string" then return _n == "true"
	return Boolean(_n)

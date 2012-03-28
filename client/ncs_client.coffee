class NCS
	@onreceive = null
	connect: (@host, @name)->
		loadJS """http://#{@host}/socket.io/socket.io.js""", ()=>
			@socket = io.connect """http://#{@host}"""
			@socket.on 'message', (_data)=>
				@onmessage(_data)
		
	send: (_key, _value)->
		if !@socket then return
		@socket.send JSON.stringify {name: @name, key: _key, value: _value}

	onmessage: (_data) ->
		_data = JSON.parse _data
		if typeof @onreceiveCallback == "function"
		 	@onreceiveCallback _data.key, _data.value

	onreceive: (@onreceiveCallback) ->


#export (polute) NCS to the global namespace
window.ncs = new NCS



#util
loadJS = (_src, _callback)->
	script = document.createElement('script');
	script.onload = ()->
		if typeof _callback == "function"
			_callback()
	script.src = _src
	document.getElementsByTagName('head')[0].appendChild script

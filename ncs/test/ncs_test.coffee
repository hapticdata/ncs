count = 0
echoStart = null

#start
$ ()->
	socket = io.connect 'http://localhost:8080'
	
	socket.on 'hello', (_data)->
		screenLog 'received hello: ' + _data
	
	socket.on 'echo', (_data)->
		time = Date.now() - echoStart
		screenLog 'received echo: ' + _data
		screenLog """took: #{time}ms"""

	$("#send").click (event)->
		screenLog 'sending echo: ' + count
		echoStart = Date.now()
		socket.emit 'echo', count++

	


#utils

screenLog = (_value)->
	$("#console").append $ """<div>#{_value.toString()}</div>"""

every = (_ms, _func)->
	return setInterval _func, _ms


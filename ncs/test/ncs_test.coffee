echoStart = null

#start
$ ()->
	socket = io.connect 'http://localhost:8080'
	
	socket.on 'hello', (_data)->
		screenLog 'received hello: ' + _data
	
	socket.on 'echo', (_data)->
		time = Date.now() - echoStart
		screenLog """received echo(#{_data}) in #{time}ms"""

	$("#send").click (event)->
		screenLog 'sending echo: ' + count
		echoStart = Date.now()
		socket.emit 'echo', count++

#util
screenLog = (_value)->
	$("#console").append $ """<div>#{_value.toString()}</div>"""



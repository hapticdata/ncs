every = (_ms, _func)->
	return setInterval _func, _ms

#start

count = 0
socket = io.connect 'http://localhost:8080'
socket.on 'hello', (_data)->
	console.log 'got hello from server:', _data
socket.on 'echo', (_data)->
	console.log 'receive echo:', _data


every 1000, ()->
	console.log 'sending echo:', count
	socket.emit 'echo', count++

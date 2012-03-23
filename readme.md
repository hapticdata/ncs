NDS
===

Growing into a node.js/socket.io based server + client lib for connecting interactive applications.

```coffeescript
http = require 'http'
socketio = require 'socket.io'
fs = require 'fs'



start = ()->
	app = http.createServer(httpHandler)
	app.listen 8080
	io = socketio.listen app
	# io.set('origins', "*.*"); 
	io.sockets.on 'connection', (_socket)->
		console.log 'new connection'
		_socket.emit 'hello', 'hello'
		_socket.on 'echo', (data)->
			console.log 'echo', data
			_socket.emit 'echo', data

httpHandler = (_req, _res)->
	console.log "http request", _req.url
	fs.readFile __dirname + _req.url, (_err, _data)->
		if _err
			_res.writeHead 500
			return _res.end 'error loading'
		_res.writeHead 200
		_res.end _data


start();
```
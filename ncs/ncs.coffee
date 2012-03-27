http = require 'http'
fs = require 'fs'
path = require 'path'
socketio = require 'socket.io'
io = null

# Main entry point of the program. Called at end of file so that all the funcitons will be available when this runs.
start = ()->
	app = http.createServer(httpHandler)
	app.listen 8080
	io = socketio.listen app
	# io.set('origins', "*.*"); 
	io.sockets.on 'connection', socketHandler



###
This is the NCS server.
###
socketHandler = (_socket)->
	console.log 'new connection', _socket
	_socket.send JSON.stringify {name: 'ncs', key: 'hello', value: 'hello'}
	
	_socket.on 'message', (_data)->
		console.log 'message', _data
		io.sockets.send _data



###
Very basic http server, simply attempts to send the file in the _req.url
Intended only for serving tests and examples
Does check if the file exists, and if the file is in the /test subdirectory
maybe this should be replaced with express?
###
httpHandler = (_req, _res)->
	console.log "http request:", _req.url
	filePath = __dirname + _req.url

	if !path.existsSync(filePath)
		console.log 'not found'
		_res.writeHead 404
		return _res.end 'not found'

	console.log "file:", filePath

	filePath = fs.realpathSync(filePath)
	if (!startsWith __dirname + '/test/', filePath) && (!startsWith __dirname + '/client/', filePath)
		console.log 'forbidden'
		_res.writeHead 403
		return _res.end 'forbidden'

	fs.readFile filePath, (_err, _data)->
		if _err
			console.log "error"
			_res.writeHead 500
			return _res.end 'error'
		
		console.log 'success'
		_res.writeHead 200
		_res.end _data


# Util
startsWith = (_needle, _haystack)->
	return _haystack.substr(0, _needle.length) == _needle


start()




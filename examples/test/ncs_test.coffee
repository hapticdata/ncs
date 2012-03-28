#start
$ ()->
	console.log "start"
	ncs.connect 'localhost:8080', "ncs_test"
	
	ncs.onreceive (_key, _value)->
		if _key == 'hello'
			screenLog 'received hello: ' + _value

		if _key == 'echo'
			time = Date.now() - _value
			screenLog """received echo(#{_value}) in #{time}ms"""

	$("#send").click (event)->
		screenLog 'sending echo: testing'
		ncs.send 'echo', Date.now()

#util
screenLog = (_value)->
	$("#console").append $ """<div>#{_value.toString()}</div>"""



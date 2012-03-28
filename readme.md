NDS
===

Growing into a node.js/socket.io based server + client lib for connecting interactive applications.

Launching NCS
===

in terminal:

		cd path/to/ncs/ncs
		node ncs.js

in browser:

		http://localhost:8080/test/ncs_test.html


The files for ncs_test can be served from the ncs node application. This makes it easy to quickly check if ncs is running.

The other examples can be open directly in a browser from your filesystem (file://) in some browsers (Firefox), but not in others (Chrome). See this [issue at github](https://github.com/LearnBoost/socket.io/issues/801)

Opening the other examples from a webserver (such as MAMP) on localhost or on a non-local webserver should work.


Requires
---
You need to have node installed and the socket.io module

		cd path/to/ncs/ncs
		npm install socket.io

This creates a node_modules folder in you working directory (if needed) and installs socketio

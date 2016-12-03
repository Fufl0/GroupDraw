module.exports = function(httpServer) {
	const io = require('socket.io').listen(httpServer);

	function joinRoom(socket, id) {
	  console.log(`User joined room: ${id}`)
	  socket.join(id);
	}

	}

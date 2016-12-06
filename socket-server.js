module.exports = function(httpServer) {

    const io = require('socket.io').listen(httpServer);

    function joinRoom(socket, id) {
        console.log(`A user joined room ${id}`)
        socket.join(id);
    }

    let roomHistories = {}

    io.on("connection", function(socket) {
        let id;
        socket.on("join", function(roomId) {
            id = roomId;

            joinRoom(socket, id);

            if (!roomHistories[id])
                roomHistories[id] = [];
            socket.emit("load-history", {
                history: roomHistories[id]
            });
        });
        socket.on("clear", function() {
            roomHistories[id] = [];
            socket.broadcast.to(id).emit("clear");
        });
        socket.on("draw", function(message) {
            roomHistories[id].push(message.stroke);
            socket.broadcast.to(id).emit("draw", message);
        });
    });
}

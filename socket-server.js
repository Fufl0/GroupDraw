module.exports = function(httpServer) {

    const io = require('socket.io').listen(httpServer);

    function joinRoom(socket, id) {
        console.log(`A user joined room ${id}`);
        console.log("ip address: ", socket.request.connection.remoteAddress);
        socket.join(id);
    }

    let roomHistories = {};
    let roomUndoHistories = {};

    io.on("connection", function(socket) {
        let id;
        socket.on("join", function(roomId) {
            id = roomId;

            joinRoom(socket, id);

            if (!roomHistories[id])
                roomHistories[id] = [];
            if (!roomUndoHistories[id])
                roomUndoHistories[id] = [];
            socket.emit("load", {
                history: roomHistories[id],
                undohistory: roomUndoHistories[id]
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

        socket.on("undo", function(message) {
            roomHistories[id] = message.history;
            roomUndoHistories[id] = message.undohistory;
            socket.broadcast.to(id).emit("undo", message);
        });

        socket.on("redo", function(message) {
            roomHistories[id] = message.history;
            roomUndoHistories[id] = message.undohistory;
            socket.broadcast.to(id).emit("undo", message);
        })
    });
}

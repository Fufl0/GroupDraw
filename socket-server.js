module.exports = function(httpServer) {
  const io = require('socket.io').listen(httpServer);
	const mongoose = require('mongoose');
	require('./models/User');
	const Contact = mongoose.model('User');
  const session = require('express-session');

    function joinRoom(socket, id) {
        console.log(`A user joined room ${id}`);
        console.log("ip address: ", socket.request.connection.remoteAddress);
        socket.join(id);
    }

    let roomHistories = {};
    let roomUndoHistories = {};
    let canvasColor = {};
    let roomSizes = {};

    io.on("connection", function(socket) {
        let id;

        //USER
        socket.on('reload', function(){
          console.log('reload');
          setTimeout(function() {io.emit('reload')}, 500);
        });


        // ROOM
        socket.on("join", function(roomId) {
            id = roomId;

            joinRoom(socket, id);

            if (!roomHistories[id])
                roomHistories[id] = [];
            if (!roomUndoHistories[id])
                roomUndoHistories[id] = [];
            if (!canvasColor[id])
                canvasColor[id] = "rgb(255, 255, 255)";
            if (!roomSizes[id])
                roomSizes[id] = "1240x680";

            socket.emit("load", {
                history: roomHistories[id],
                undohistory: roomUndoHistories[id],
                canvasColor : canvasColor[id],
                size : roomSizes[id]
            });
        });
        socket.on("clear", function() {
            roomHistories[id] = [];
            roomUndoHistories[id] = [];
            canvasColor[id] = "rgb(255, 255, 255)";
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
        });

        socket.on("fill", function(message) {
            roomHistories[id] = [];
            roomUndoHistories[id] = message.undohistory;
            canvasColor[id] = message.strokeStyle;
            socket.broadcast.to(id).emit("fill", message);
        });

        socket.on("size", function (message) {
            roomSizes[id] = message.size;
            socket.broadcast.to(id).emit('size', message);
        })
    });
};

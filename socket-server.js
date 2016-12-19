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

    let users = {};

    let roomHistories = {};
    let roomUndoHistories = {};
    let canvasColor = {};
    let roomSizes = {};

    io.on("connection", function(socket) {
        let id;

        // ROOMS
        socket.on("room", function() {
            socket.broadcast.emit("room");
            //io.sockets.emit("create", ...);
        });

        //USER

        // socket.join('/rooms');

        // socket.on("join", function(userId) {
        //   id = userId;
        //
        //   console.log('A user logged in.');
        //   login(socket, '/rooms');
        // });

        // socket.on('reload', function(){
        //   console.log('reload');
        //   setTimeout(function() {io.emit('reload')}, 500);
        // });

        // socket.leave('/rooms');

        // socket.on('disconnect', function () {
        //   console.log('A user disconnected.');
        //   //io.sockets.emit();
        // });


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

        socket.on("undo", function() {
            roomUndoHistories[id].push(roomHistories[id].pop());
            socket.broadcast.to(id).emit("undo");
        });

        socket.on("redo", function() {
            roomHistories[id].push(roomUndoHistories[id].pop());
            socket.broadcast.to(id).emit("redo");
        });

        socket.on("fill", function(message) {
            canvasColor[id] = message.canvasColor;
            socket.broadcast.to(id).emit("fill", message);
        });

        socket.on("size", function (message) {
            roomSizes[id] = message.size;
            socket.broadcast.to(id).emit('size', message);
        })
    });

};

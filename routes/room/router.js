/** @module room/router */
'use strict';

const express = require('express');
const router = express.Router();
const middleware = require('../middleware');
const config = require("../../config");
const mongoose = require('mongoose');
const Room = mongoose.model('Room');

//supported methods
router.all('/', middleware.supportedMethods('GET, POST, DELETE, OPTIONS'));


//list users
router.get('/', function(req, res, next) {
    res.status(200);

    Room.find(function(err, room) {
        if (err) return console.error(err);
        res.render('room', {
            room: room
        });

    })
});



/** router for /users */
module.exports = router;

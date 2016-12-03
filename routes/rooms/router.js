/** @module users/router */
'use strict';

const express = require('express');
const router = express.Router();
const middleware = require('../middleware');
const config = require("../../config");
const mongoose = require('mongoose');
const Rooms = mongoose.model('Rooms');

//supported methods
router.all('/', middleware.supportedMethods('GET, POST, DELETE, OPTIONS'));


//list users
router.get('/', function(req, res, next) {
    res.status(200);

    Rooms.find(function(err, rooms) {
        if (err) return console.error(err);
        res.render('rooms', {
            rooms: rooms
        });

    })
});



/** router for /users */
module.exports = router;

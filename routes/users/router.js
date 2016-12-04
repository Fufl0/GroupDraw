/** @module users/router */
'use strict';

const express = require('express');
const router = express.Router();
const middleware = require('../middleware');
const config = require("../../config");
const mongoose = require('mongoose');
const User = mongoose.model('User');

//supported methods
router.all('/', middleware.supportedMethods('GET, POST, DELETE, OPTIONS'));


//list users
router.get('/', function(req, res, next) {
    res.status(200);

    User.find(function(err, users) {
        if (err) return console.error(err);
        res.render('users', {
            users: users
        });

    })
});



/** router for /users */
module.exports = router;

/** @module welcome/router */
'use strict';

const express = require('express');
const router = express.Router();
const middleware = require('../middleware');
const config = require("../../config");
const mongoose = require('mongoose');
const Rooms = mongoose.model('User');

//supported methods
router.all('/', middleware.supportedMethods('GET, POST, DELETE, OPTIONS'));

router.get('/', function(req, res, next) {
    res.status(200)
    res.write('Prego, Lorenzo :)')
    res.end()
});

//register user
//TODO
module.exports.postUser = function postUser(req, res) {
  models.User.create(req.body, (err, users) => {
    if (err) res.status(500).end();
    else res.status(201).json(users).end();
  });
}



/** router for /users */
module.exports = router;

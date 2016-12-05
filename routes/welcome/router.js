/** @module welcome/router */
'use strict';

const express = require('express');
const router = express.Router();
const middleware = require('../middleware');
const config = require("../../config");
const mongoose = require('mongoose');
const User = mongoose.model('User');

//supported methods
router.all('/', middleware.supportedMethods('GET, POST, DELETE, OPTIONS'));

router.get('/', function(req, res, next) {
    res.status(200)
    res.render('welcome')
});

//login user
router.loginUser = function loginUser(req, res) {
  User.findOne({username: req.params.username, password: req.params.password}, (err, user) => {
    if (err) res.status(500).end();
    else if (!user) res.status(403).end();
    else res.status(204).end();
  });
}

/** router for /users */
module.exports = router;

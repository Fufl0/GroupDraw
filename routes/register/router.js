/** @module register/router */
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
  if (!req.session.user) {
    res.status(200);
    res.render('register')
  } else {
    res.status(302);
    res.redirect('/rooms');
  }
});

//register user
router.postUser = function postUser(req, res) {
  User.create(req.body, (err, users) => {
    if (err) res.status(500).end();
    else res.status(201).json(users).end();
  });
}

/** router for /users */
module.exports = router;

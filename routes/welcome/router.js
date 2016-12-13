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
  if (!req.session.user) {
    res.status(200);
    res.render('welcome')
  } else {
    res.status(302);
    res.redirect('/rooms');
  }
});

//login user
router.loginUser = function loginUser(req, res) {
  User.findOneAndUpdate({username: req.body.username, password: req.body.password}, {status: 'online'}, (err, user) => {
    if (err) {
      res.status(500).end();
    } else if (!user) {
      res.status(404).end();
    } else {
      req.session.user = user;
      res.status(200).send();
    }
  });
};

/** router for /users */
module.exports = router;

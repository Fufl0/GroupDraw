/** @module users/router */
'use strict';

const express = require('express');
const router = express.Router();
const middleware = require('../middleware');
const config = require("../../config");
const mongoose = require('mongoose');
const User = mongoose.model('User');
const session = require('express-session');

//supported methods
router.all('/', middleware.supportedMethods('GET, POST, DELETE, OPTIONS'));

//list users

router.get('/list', function(req, res, next) {
  console.log("REC");
  /*if (!req.session.user) {
    res.status(401);
    res.redirect('/welcome');
	} else {*/

    User.find(function(err, users) {
      if (err) return console.error(err);
      res.status(200).json(users);
    })
//	}
})

router.get('/', function(req, res, next) {
  if (!req.session.user) {
    res.status(302);
    res.redirect('/welcome');
	} else {
    res.status(200);
    User.find(function(err, users) {
      if (err) return console.error(err);
      res.render('users', {users: users, user: req.session.user.username});
    })
	}
});



/** router for /users */
module.exports = router;

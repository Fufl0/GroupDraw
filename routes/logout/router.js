/** @module logout/router */
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

router.get('/', function(req, res, next) {
  if(!req.session.user) {
    res.status(301).send();
    res.redirect('/welcome');
  } else {
    if (!(req.session.user.username.toLowerCase().indexOf("guest") >= 0)) {
      User.update({ username: req.session.user.username }, { status: 'offline' }, function(err, updated) {
        if (err){
        res.status(404).send();
        } else {
        req.session.destroy();
        res.status(302);
        res.redirect('/welcome');
        }
      });
    } else {
      User.find({ username: req.session.user.username }).remove().exec();
      req.session.destroy();
      res.status(302);
      res.redirect('/welcome');
    }
  }
});

/** router for /users */
module.exports = router;

/** @module profile/router */
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
    return res.status(401).send();
  } else {
    res.status(200)
    res.render('profile',{user: req.session.user.username});
  }
});

/** router for /users */
module.exports = router;

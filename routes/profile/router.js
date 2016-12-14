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
    res.status(302);
    res.redirect('/welcome');
  } else {
    if (req.session.user.password === "") {
      //res.status(401);
      //res.redirect(req.get('referer'));
    } else {
      res.status(200)
      res.render('profile',{user: req.session.user});
    }
  }
});

router.modifyUser = function modifyUser(req, res) {
  if(!req.session.user) {
    return res.status(401).send();
  } else {
    req.session.user.mood = req.body.mood;
    req.session.user.status = req.body.status;
    req.session.user.picture = req.body.picture;
    // TODO image ^
    User.update({username: req.body.username},
                {mood: req.body.mood,
                  status: req.body.status,
                  picture: req.body.picture
                },
                function(err, updated) {
      if (err){
        res.sendStatus(404);
      } else {
        console.log(req.body);
        res.sendStatus(201);
      }
    });
  }
};

router.deleteUser = function modifyUser(req, res) {
  if(!req.session.user) {
    return res.status(401).send();
  } else {
    req.session.destroy();
    User.find({ username: req.body.username }).remove().exec();
    res.sendStatus(200);
  }
};

/** router for /users */
module.exports = router;

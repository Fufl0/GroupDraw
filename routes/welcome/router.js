/** @module welcome/router */
'use strict';

const express = require('express');
const router = express.Router();
const middleware = require('../middleware');
const config = require("../../config");
const mongoose = require('mongoose');
const Rooms = mongoose.model('Contact');

//supported methods
router.all('/', middleware.supportedMethods('GET, POST, DELETE, OPTIONS'));


//register user
//TODO
module.exports.postContact = function postContact(req, res) {
  models.Contact.create(req.body, (err, contacts) => {
    if (err) res.status(500).end();
    else res.status(201).json(contacts).end();
  });
}



/** router for /users */
module.exports = router;

'use strict';

const express = require('express');
const router = express.Router();
const middleware =  require('../middleware');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
require ('../../models/GalleryImage');
const GalleryImage = mongoose.model('GalleryImage');
const Rooms = mongoose.model('Rooms')
const config = require('../../config');
const session = require('express-session');

const fieldsFilter = { '__v': 0 };

router.all('/', middleware.supportedMethods('GET, POST, DELETE, OPTIONS'));

router.get('/', function(req, res, next) {
	if (!req.session.user) {
		return res.status(401).send();
	} else {
		res.status(200);

		const filter = {};

		if (req.query.my) {
			filter.author = {};
			filter.author.name = req.session.user.username;
			filter.author.id = mongoose.Types.ObjectId(req.session.user._id);
		}

		if (req.query.room) {
			filter.createdInRoom = req.query.room;
		}
		if (req.query.authorName) {
			filter.author = {};
			filter.author.name = req.query.authorName;
		}
		if(req.query.title) {
			filter.title = req.query.title;
		}

	  GalleryImage.find(filter, function(err, gallery) {
      if (err) return console.error(err);
      res.render('gallery', {gallery: gallery, user: req.session.user.username});
	  })
	}
});


router.post('/', function(req, res, next) {
	if (!req.session.user) {
		return res.status(401).send();
	} else {

		Rooms.findOne({ _id: mongoose.Types.ObjectId(req.body.roomId) }, function(err, room) {

			var createdInRoom;

			if (err) return console.error(err);

			const newGalleryImage = new GalleryImage({
				img: req.body.img,
				title: req.body.title,
				author: { name: req.session.user.username, id: req.session.user._id },
				createdInRoom: room.name
			});

			newGalleryImage.save(onModelSave(res, 201, true));
		});


	}
});

function onModelSave(res, status, sendItAsResponse){
  const statusCode = status || 204;
  let sendItAsResponseCheck = sendItAsResponse || false;
  return function(err, saved){
    if (err) {
      if (err.name === 'ValidationError' || err.name === 'TypeError' ) {
        res.status(400)
        return res.json({
          statusCode: 400,
          message: 'Bad Request'
        });
      } else {
        return next (err);
      }
    }

    if(sendItAsResponseCheck) {
      const obj = saved.toObject();
      delete obj.password;
      delete obj.__v;
      addLinks(obj);
      return res.status(statusCode).json(obj);
    } else {
      return res.status(statusCode).end();
    }
  }
}

function addLinks(galleryImage){
  galleryImage.links = [{
      'rel' : 'self',
      'href' : `${config.url}/gallery/${galleryImage._id}`
    }];
}

module.exports = router;

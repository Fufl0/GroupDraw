'use strict';

const express = require('express');
const router = express.Router();
const middleware =  require('../middleware');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
require ('../../models/GalleryImage');
const GalleryImage = mongoose.model('GalleryImage');
const config = require('../../config');

const fieldsFilter = { '__v': 0 };

router.all('/', middleware.supportedMethods('GET, POST, DELETE, OPTIONS'));

router.get('/', function(req, res, next) {
	GalleryImage.find({}, function(err, found) {
		if(err) {
			res.sendStatus(404);
		}
		else {
			let array = []
			for (let element of found){
				let galleryImage = element.toObject();
				array.push(galleryImage);
			}
			let t = { galleryitems: array };
			res.render("galleryitems", t);
		}
	})
});


router.post('/', function(req, res, next) {
  const newGalleryImage = new GalleryImage(req.body);
  newGalleryImage.save(onModelSave(res, 201, true));
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

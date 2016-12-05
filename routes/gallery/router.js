'use strict';

const express = require('express');
const router = express.Router();
const middleware =  require('../middleware');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
require ('../../models/GalleryImage');
const GalleryImage = mongoose.model('GalleryImage');

const fieldsFilter = { '__v': 0 };

router.all('/', middleware.supportedMethods('GET, POST, DELETE, OPTIONS'));

router.get('/', function(req, res, next) {

  GalleryImage.find({}, fieldsFilter).lean().exec(function(err, galleryImages) {
    if (err) return next (err);
    if(req.accepts('html')){
      res.render('gallery', { galleryImages });
    } else {
      res.json(galleryImages);
    }
  });
});


router.post('/', function(req, res, next) {
    const newGalleryImage = new GalleryImage(req.body);
    newGalleryImage.save(onModelSave(res, 201, true));
});

router.delete('/:galleryImageid', function(req, res, next) {
  GalleryImage.findById(req.params.galleryImageid, fieldsFilter , function(err, galleryImage){
    if (err) return next (err);
    if (!galleryImage) {
      res.status(404);
      res.json({
        statusCode: 404,
        message: 'Not Found'
      });
      return;
    }

    galleryImage.remove(function(err, removed){
      if (err) return next (err);
      res.status(204).end();
    })
  });
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

module.exports = router;

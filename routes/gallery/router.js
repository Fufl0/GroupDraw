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

  GalleryImage.find({}, fieldsFilter).lean().exec(function(err, galleryImages){
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

module.exports = router;

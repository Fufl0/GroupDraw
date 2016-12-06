/** @module models/index.js
 * Loads all models
 */
'use strict';

const mongoose = require('mongoose');

require('./Rooms');
require('./User');
require('./GalleryImage');
//require('./Room');

module.exports = {
  'Rooms': mongoose.model('Rooms'),
  'User' : mongoose.model('User'),
  'GalleryImage' : mongoose.model('GalleryImage'),
  //'Room': mongoose.model('Room'),
}

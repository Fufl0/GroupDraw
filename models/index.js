/** @module models/index.js
 * Loads all models
 */
'use strict';

const mongoose = require('mongoose');

require('./Rooms');
require('./Contact');

module.exports = {
    'Rooms': mongoose.model('Rooms')
}

module.exports = {
  'Contact' : mongoose.model('Contact'),
}

/** @module models/index.js
 * Loads all models
 */
'use strict';

const mongoose = require('mongoose');

require('./Rooms');
require('./User');

module.exports = {
    'Rooms': mongoose.model('Rooms')
}

module.exports = {
  'User' : mongoose.model('User'),
}

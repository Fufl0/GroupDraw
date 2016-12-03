/** @module models/index.js
 * Loads all models
 */
'use strict';

const mongoose = require('mongoose');

require('./Rooms');

module.exports = {
    'Rooms': mongoose.model('Rooms')
}

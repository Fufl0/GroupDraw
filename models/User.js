/** @module models/User
* The User Model
* Schema:
* _id            ObjectId           Unique identifier of the user
* username       String             Full name of the user ('Guest + random number' if it is a guest)
* password       String             User's password (if the password is an empty string, the user is a guest)
* picture        String             Image in base 64
* mood           String             User's mood
* status         String             User's status: can vary between offline(default), online, away, busy.
*/

'use strict';

const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

/** @constructor
* @param {Object} definition
*/
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  picture:  { type: String, required: true, default: 'data:image/jpeg;base64,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' },
  mood:     { type: String, required: false, default: ''},
  status:   { type: String, required: true, enum: ['offline', 'online', 'away', 'busy', 'ready to draw'], default: 'offline' },
});

//register model
mongoose.model('User', UserSchema);

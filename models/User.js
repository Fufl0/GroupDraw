/** @module models/User
* The User Model
* Schema:
* _id            ObjectId           Unique identifier of the user
* username       String             Full name of the user ('Guest + random number' if it is a guest)
* password       String             User's password (if the password is an empty string, the user is a guest)
* //picture        buffer in string   User's image
* picture        String             Path to user's image
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
  //picture: { data: Buffer, contentType: String, required: true },
  picture:  { type: String, required: true, default: '/img/blank-user.jpg' },
  mood:     { type: String, required: false, default: ''},
  status:   { type: String, required: true, enum: ['offline', 'online', 'away', 'busy', 'ready to draw'], default: 'offline' },
});

//register model
mongoose.model('User', UserSchema);

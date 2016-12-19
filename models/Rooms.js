/** @module models/Room(s)
* The Room Model
* Schema:
* _id            ObjectId           Unique identifier of the room
* name           String             Full name of the room
* creator        String             Full name of room's creator
* password       String             Room's password (if the password is an empty string, the room is public)
* links          String             ? (please fill this)
*/

'use strict';

const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;


/** @constructor
* @param {Object} definition
*/
const RoomsSchema = exports.RoomsSchema = new mongoose.Schema({
    name: { type: String, default: '' },
   	creator: { type: String },
    password: { type: String, default: '' },
    links: { type: [{ href: String }], default: [] }
});

RoomsSchema.pre("save", function(next) {
    this.links.push({ href: '/rooms/' + this._id });
    next();
});

mongoose.model("Rooms", RoomsSchema);

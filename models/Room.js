/** @module models/Room
 * This is Model for Rooms.
 */
'use strict';
const mongoose = require('mongoose');
// const UserId = mongoose.Schema.Types.UserId;


const RoomSchema = new mongoose.Schema({
    name : { type: String, required: true },
    // id : { type: String, required: true },
    drawings: { type: [], default: [] },
    dateCreated : { type: Date, default: Date.now }
});


//register model
mongoose.model('Room', RoomSchema);


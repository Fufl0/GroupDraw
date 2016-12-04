'use strict';


const mongoose = require('mongoose');

//id auto added by mongoose
const RoomsSchema = exports.RoomsSchema = new mongoose.Schema({
		name : {type: String},
		secret: {type: String},
		history: {type: Array, default: []}
});

//register model for schema
mongoose.model('Rooms', RoomsSchema);
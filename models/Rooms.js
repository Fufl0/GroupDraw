'use strict';

const mongoose = require('mongoose');
const RoomsSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        secret: {
            type: String,
            default: "default"
        }
    }

);


//register model
mongoose.model('Rooms', RoomsSchema);

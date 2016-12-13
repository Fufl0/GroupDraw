'use strict';

const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const RoomsSchema = exports.RoomsSchema = new mongoose.Schema({
    name: { type: String, default: "" },
   	creator: {type: String},
    links: { type: [{ href: String }], default: []}
    //history: {type: Array, default: []}
});

RoomsSchema.pre("save", function(next) {
    this.links.push({ href: '/rooms/' + this._id });
    next();
});

mongoose.model("Rooms", RoomsSchema);
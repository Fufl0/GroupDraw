/** @module users/router */
'use strict';


const express = require('express');
const router = express.Router();
const middleware = require('../middleware');
const config = require("../../config");
const mongoose = require('mongoose');
require ('../../models/Rooms');
const model = mongoose.model('Rooms');

router.all('/', middleware.supportedMethods('GET, POST, DELETE, OPTIONS'));


router.get("/:id", function(req, res, next){
	model.findById(req.params.id, function(err, found){
		if(err){
			res.sendStatus(400);
		}
		else if (!found){
			res.sendStatus(404);
		}
		else {
			let t = {rooms: found};
			res.render("room", t);
		}
	})
});

router.get("/", function(req, res, next){
	model.find({}, function(err, found){
		if(err){
			res.sendStatus(404);
		}
		else{
			let array = []
			for (let element of found){
				let room = element.toObject();
				room.links = [{href : "/rooms/"+element._id}]
				array.push(room);
			}
			let t = {rooms: array};
			res.render("rooms", t);
		}
	})
});

router.delete("/:id/:token", function(req, res, next){
	console.log("id here");
	console.log(req.params.id);
	model.findById(req.params.id, function(err, found){
		if (err){
			res.sendStatus(400);
		}
		else if (!found){
			res.sendStatus(404);
		}
		else {
			if (!(req.params.token==found.secret)) {
				res.sendStatus(403);
				return;
			}
			found.remove(function(err){
				if(err){
					res.sendStatus(400);
				}
				else{
					res.status(204).render("rooms", {});
				}
			});
		}
	})
})

router.post("/", function (req, res, next){
	let t = new model({
		name: req.body.name,
		description: req.body.description,
		mood: req.body.mood,
		secret: req.body.secret
	});

	t.save(function(err, saved){
		if(err){
			return;
		}
		res.status(201).json(saved);
	})
});

module.exports = router;

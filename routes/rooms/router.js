/** @module users/router */
'use strict';


const express = require('express');
const router = express.Router();
const middleware = require('../middleware');
const config = require("../../config");
const mongoose = require('mongoose');
require ('../../models/Rooms');
const model = mongoose.model('Rooms');
const session = require('express-session');

router.all('/', middleware.supportedMethods('GET, POST, DELETE, OPTIONS'));


router.get("/:id", function(req, res, next){
	if (!req.session.user) {
		return res.status(401).send();
	} else {
		model.findById(req.params.id, function(err, found){
			if(err){
				res.sendStatus(400);
			}
			else if (!found){
				res.sendStatus(404);
			}
			else {
				res.render("room", {rooms: found});
			}
		})
	}
});

router.get("/", function(req, res, next){
	if (!req.session.user) {
		res.status(302);
    res.redirect('/welcome');
	} else {
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
				res.render("rooms", {rooms: array, user: req.session.user.username});
			}
		})
	}
});

router.delete("/:id/:creator", function(req, res, next){
	console.log("id here");
	console.log(req.params.id);
	if (!req.session.user) {
		return res.status(401).send();
	} else {
		model.findById(req.params.id, function(err, found){
			if (err){
				res.sendStatus(400);
			}
			else if (!found){
				res.sendStatus(404);
			}
			else {
				console.log(found.creator);
				console.log(req.session.user.username);
				if (!(found.creator == req.session.user.username)) {
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
	}
})

router.post("/", function (req, res, next){
	if (!req.session.user) {
		return res.status(401).send();
	} else {
		let t = new model({
			name: req.body.name,
			creator: req.session.user.username
		});

		t.save(function(err, saved){
			if(err){
				return;
			}
			res.status(201).json(saved);
		})
	}
});

module.exports = router;

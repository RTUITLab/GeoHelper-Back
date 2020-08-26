//
//
//	File:	entity.js
//
//	By:		Ivan Laptev <ivlaptev13@ya.ru>
//
//	Created:	2020-06-10 12:04:29
//	Updated:	2020-08-16 21:31:31
//
//

/*
 * Description:
 * Functions that are working with Objects.
 *
 * Functions:
 * getFile: uploads file to the server.
 * getObjects: returns list of all Objects that are stored by database.
 * createObject: creates new Object and pushes it into database.
 *  Function also adds additional lines that are necessary to detect if user is
 *  inside Object's field of visibility.
 * updateObject: changes different fields of the Object that has the same id
 *  inside database. It creates new additional lines.
 * deleteObject: delete Object that has the same id from database.
 */

const mongoose = require('mongoose');

const api = {};

const modes = {
	F_AUDIO: 1,
	F_MODEL: 2
};

// Checks if Object from request is valid
validEntity = (entity) => {
	if (entity.type)
		if (entity.areas && entity.position) {
			if (entity.type == "text" && entity.description)
				return true;
			if (entity.type == "audio" && entity.url)
				return true;
			// Checks of validity for other types of Objects
		}
	return false;
}

api.loadFile = (mode, Token) => (req, res) => {
	console.log(req.headers['content-length']);
	return res.status(201).send({ success: true, message: 'File uploaded' });
}
api.getObjects = (Entity, Token) => (req, res) => {
	if (Token) {
		Entity.find({}, (error, entities) => {
			if (error) res.status(400).json({ success: false, message: 'Bad request' });
			else res.status(200).json(entities);
		});
	} else return res.status(401).send({ success: false, message: 'Unauthorized' });
}

api.createObject = (Entity, Token) => (req, res) => {
	if (Token) {
		if (validEntity(req.body))
		{
			var additionalLines = [];

			// Connect every area with area[0]
			req.body.areas.forEach((area, i, areas) => {
				if (i) additionalLines.push({
					start: {
						lat: area.points[0].lat,
						lng: area.points[0].lng
					},
					end: {
						lat: areas[0].points[0].lat,
						lng: areas[0].points[0].lng
					}
				});
			});

			const entity = new Entity(req.body);
			if (additionalLines.length) entity.additionalLines = additionalLines;
			else entity.additionalLines = undefined; // Areas contains only one area

			entity.save(error => {
				if (error) res.status(400).json({ success: false, message: 'Bad request' });
				else res.status(200).json({ success: true, message: 'Object added successfully' });
			})
		} else return res.status(400).json({ success: false, message: 'Bad request' });
	} else return res.status(401).send({ success: false, message: 'Unauthorized' });
}

api.updateObject = (Entity, Token) => (req, res) => {
	if (Token) {
		if (req.body._id && validEntity(req.body)) {
			var additionalLines = [];

			req.body.areas.forEach((area, i, areas) => {
				if (!!i) additionalLines.push({
					start: {
						lat: area.points[0].lat,
						y: area.points[0].y
					},
					end: {
						lat: areas[0].points[0].lat,
						lng: areas[0].points[0].lng
					}
				});
			});

			const entity = req.body;
			if (additionalLines.length) entity.additionalLines = additionalLines;
			else entity.additionalLines = undefined;

			Entity.findByIdAndUpdate(entity._id, entity, (error) => {
				if (error) res.status(400).json({ success: false, message: 'Bad request' });
				else res.status(200).json({ success: true, message: 'Object updated successfully' });
			})
		} else return res.status(400).json({ success: false, message: 'Bad request' });
	} else return res.status(401).send({ success: false, message: 'Unauthorized' });
}

api.deleteObject = (Entity, Token) => (req, res) => {
	if (Token) {
		Entity.findByIdAndDelete(req.body._id, (error) => {
			if (error) res.status(400).json({ success: false, message: 'Bad request' });
			else res.status(200).json({ success: true, message: 'Object deleted successfully' });
		})
	} else return res.status(401).send({ success: false, message: 'Unauthorized' });
}

module.exports = api;

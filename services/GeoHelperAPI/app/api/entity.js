const mongoose = require('mongoose');

const api = {};

api.getObjects = (Entity, Token) => (req, res) => {
	if (Token) {
		Entity.find({}, (error, entities) => {
			if (error) res.status(400).json({ success: false, message: 'Bad request' });
			else res.status(200).json(entities);
		});
	} else return res.status(401).send({ success: false, message: 'Unauthorized' });
}

api.createObject = (Entity, Token) => (req, res) => {
	if(Token) {
		var additionalLines = [];

		req.body.areas.forEach((area, i, areas) => {
			if (i) additionalLines.push({
				start: {
					x: area.points[0].x,
					y: area.points[0].y
				},
				end: {
					x: areas[0].points[0].x,
					y: areas[0].points[0].y
				}
			});
		});

		const entity = new Entity(req.body);
		if (additionalLines.length) entity.additionalLines = additionalLines;
		else entity.additionalLines = undefined;

		entity.save(error => {
			if (error) res.status(400).json({ success: false, message: 'Bad request' });
			else res.status(200).json({ success: true, message: 'Object added successfully' });
		})
	} else return res.status(401).send({ success: false, message: 'Unauthorized' });
}

api.updateObject = (Entity, Token) => (req, res) => {
	if (Token) {
		var additionalLines = [];

		req.body.areas.forEach((area, i, areas) => {
			if (!!i) additionalLines.push({
				start: {
					x: area.points[0].x,
					y: area.points[0].y
				},
				end: {
					x: areas[0].points[0].x,
					y: areas[0].points[0].y
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

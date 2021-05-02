const mongoose = require('mongoose');
const EntityDto = require('@GeoHelperDtos/entity.js');

const api = {};

// Checks if Object from request is valid
validEntity = (entity) => {
	if (entity.type)
		if (entity.areas && entity.position) {
			if (entity.type == "text" && entity.description)
				return true;
			if (entity.type == "audio" && entity.url)
				return true;
			if (entity.type == "object" && entity.url)
				return true;
			console.log(entity.type, entity.files.length, entity.description, entity.files);
			if (entity.type == "excursion" && entity.files.length === 2 && entity.description) {
				let result = true;

				entity.files.forEach((file) => {
					if (!file.fileName || !file.type || !file.url) {
						result = false;
					}
				});

				return result;
			}
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
			else {
				res.status(200).json(entities.map((entity) => EntityDto.setObjectToResponse(entity)));
			}
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

			const entity = new Entity(EntityDto.getObjectFromRequest(req.body));
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

			const entity = EntityDto.getObjectFromRequest(req.body);
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
		try {
      		fs.unlink(process.env.UPLOAD_DIR + '/' + req.body.url, () => {
        	console.log(`File ${req.body.url} removed`);
      	});
    } catch (error) {
    	console.log(error);
    }

		Entity.findByIdAndDelete(req.body._id, (error) => {
			if (error) res.status(400).json({ success: false, message: 'Bad request' });
			else res.status(200).json({ success: true, message: 'Object deleted successfully' });
		})
	} else return res.status(401).send({ success: false, message: 'Unauthorized' });
}

module.exports = api;

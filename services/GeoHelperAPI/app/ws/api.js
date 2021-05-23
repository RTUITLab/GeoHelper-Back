const mongoose = require('mongoose');
const EntityDto = require('@GeoHelperDtos/entity.js');

checkInclusion = (latLng, lines) => {
	var inside = false;

	if (!latLng)
		return inside;
	lines.forEach((line, i, lines) => {
		const lat = line.lat[0] + (latLng.lng -line.lng[0]) / (line.lng[1] - line.lng[0]) * (line.lat[1] - line.lat[0]);

		if (latLng.lat < line.lat[0] || latLng.lat < line.lat[1]) {
			if ((line.lng[0] - latLng.lng) * (line.lng[1] - latLng.lng) < 0) {
				if (lat > latLng.lat) {
					inside = !inside;
				}
			}
		}
	})

	return inside;
}

const api = {};

api.getObjects = (Entity, latLng, ws) => {
	var res = { success: true };

	Entity.find({}, (error, data) => {
		if (error) ws.send(JSON.stringify({ success: false, message: 'Internal error' }))
		else {
			res.poiObjectModels = [];
			res.geoAudioObjectModels = [];
			res.geo3dObjectModels = [];

			data.forEach((entity, i, data) => {
				var lines = [];
				entity.areas.forEach((area, j, areas) => {
					area.points.forEach((point, k, points) => {
						if (k > 0) {
							lines.push({ lat: [points[k-1].lat, point.lat], lng: [points[k-1].lng, point.lng]})
						} else {
							lines.push({ lat: [points[points.length-1].lat, point.lat], lng: [points[points.length-1].lng, point.lng]});
						}
					})
				})

				const inside = checkInclusion(latLng, lines);

				if (inside) {
					entity = EntityDto.setObjectToResponse(entity);
					if (entity.type === 'text') {
						res.poiObjectModels.push({
							id: entity._id,
							name: entity.name,
							type: entity.type,
							description: entity.description,
							position: entity.position,
						});
					} else if (entity.type === 'audio') {
						res.geoAudioObjectModels.push({
							id: entity._id,
							name: entity.name,
							type: entity.type,
							position: entity.position,
							url: entity.url
						});
					} else if (entity.type === 'object') {
						res.geo3dObjectModels.push({
							id: entity._id,
							name: entity.name,
							type: entity.type,
							position: entity.position,
							url: entity.url
						});
					}
				}
			})
			ws.send(JSON.stringify(res));
		}
	})
}

module.exports = api;

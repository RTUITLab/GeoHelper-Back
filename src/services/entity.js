const Entity = require('../models/entity');
const entityHelpers = require('./entityHelpers');

module.exports = {
  getObjects: () => {
    return new Promise(async (resolve, reject) => {
      const entities = await Entity.find({});

      resolve(entities);
    });
  },

  createObject: (reqEntity) => {
    return new Promise(async (resolve, reject) => {
      let additionalLines = [];

      // Connect every area with area[0]
			reqEntity.areas.forEach((area, i, areas) => {
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

      const entity = new Entity(entityHelpers.convertFilesFromRequest(reqEntity));
      if (additionalLines.length) entity.additionalLines = additionalLines;
      else entity.additionalLines = undefined;

      if (await entity.save())
        return resolve(reqEntity);
      return reject({ message: `Can't save`});
    })
  }
}
const Entity = require('../models/entity');

const checkInclusion = (latLng, lines) => {
  let inside = false;

  if (!latLng)
    return inside;
  lines.forEach((line) => {
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

module.exports = {
  getAllObjects: () => {
    return new Promise(async (resolve, reject) => {
      Entity.find({}, (error, result) => {
        if (error) {
          console.log(error);
          reject({ message: `Can't get data from DB`});
        } else {
          resolve(result || []);
        }
      });
    });
  },

  addEntity: (reqEntity) => {
    return new Promise(async (resolve, reject) => {
      const entity = new Entity(reqEntity);

      if (await entity.save()) {
        resolve(entity);
      } else {
        reject({ message: `Can't create entity` });
      }
    });
  },

  deleteEntity: (id) => {
    return new Promise(async (resolve, reject) => {
      Entity.findByIdAndRemove(id, (error) => {
        if (error) {
          console.error(error);
          reject({ message: `Can't delete object` });
        } else {
          resolve();
        }
      });
    });
  },

  getObjectsForPoint: (point) => {
    return new Promise(async (resolve, reject) => {
      const entities = await Entity.find({});
      if (!entities) {
        return resolve({ message: `Can't get entities`});
      }

      const poiObjectModels = [];
      const geoAudioObjectModels = [];
      const geo3dObjectModels = [];
      const geoExcursionObjectModels = [];

      entities.forEach((entity) => {
        let lines = [];
        entity.areas.forEach((area) => {
          area.points.forEach((point, k, points) => {
            if (k > 0) {
              lines.push({ lat: [points[k-1].lat, point.lat], lng: [points[k-1].lng, point.lng]});
            } else {
              lines.push({ lat: [points[points.length-1].lat, point.lat], lng: [points[points.length-1].lng, point.lng]});
            }
          });
        });

        const inside = checkInclusion(point, lines);
        if (inside) {
          if (entity.type === 'text') {
            poiObjectModels.push(entity);
          } else if (entity.type === 'audio') {
            geoAudioObjectModels.push(entity);
          } else if (entity.type === 'object') {
            geo3dObjectModels.push(entity);
          } else if (entity.type === 'excursion') {
            geoExcursionObjectModels.push(entity);
          }
        }
      });

      resolve({
        poiObjectModels,
        geoAudioObjectModels,
        geo3dObjectModels,
        geoExcursionObjectModels
      });
    });
  }
}
const Entity = require('../models/entity');
const mgFile = require('../models/file');
const fileService = require('./fileService');

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
      Entity.find({}, async (error, result) => {
        if (error) {
          console.log(error);
          reject({ message: `Can't get data from DB`});
        } else {
          const readyFiles = await mgFile.find({bundled: true});

          result = result.map((R) => {
            // Status
            // 0 - ready
            // 1 - processing
            // 2 - in queue
            // 3 - can't create AB
            // 4 - has no files
            let status = 0;

            if (R.type === 'object') {
              const filename = R.files[0].url.split('/').pop().split('.')[0];
              if (readyFiles.find((file) => file.name === filename)) {
                R.files[0].assetBundle = R.files[0].url.split('.zip')[0];
              } else {
                status = 1;
              }
            } else if (R.type === 'excursion') {
              const filename = R.files.find((file) => file.type === 'model').url.split('/').pop().split('.')[0];
              if (readyFiles.find((file) => file.name === filename)) {
                R.files = R.files.map((file) => {
                  const newFile = JSON.parse(JSON.stringify(file));

                  if (newFile.type === 'model') {
                    newFile.assetBundle = newFile.url.split('.zip')[0];
                  }

                  return newFile;
                });
              } else {
                status = 1;
              }
            }

            return {...R._doc, status: status};
          });
          resolve(result || []);
        }
      });
    });
  },

  addEntity: (reqEntity) => {
    return new Promise(async (resolve, reject) => {
      if (reqEntity.files) {
        reqEntity.files.filter((item) => item.type === 'model').forEach(async (item) => {
          if (item.fileId) {
            fileService.createAssetBundle(item.fileId);
          } else {
            // Old FE support
            const dirName = item.url.split('/').pop().split('.').shift();
            const dbFile = await mgFile.findOne({ name: dirName });

            fileService.createAssetBundle(dbFile._id);
          }
        });
      }

      const entity = new Entity(reqEntity);

      if (await entity.save()) {
        resolve(entity);
      } else {
        reject({ message: `Can't create entity` });
      }
    });
  },

  updateEntity: (reqEntity) => {
    return new Promise(async (resolve, reject) => {
      if (await Entity.updateOne({ _id: reqEntity._id }, reqEntity)) {
        resolve(reqEntity);
      } else {
        reject({ message: `Can't update entity` });
      }
    });
  },

  deleteEntity: (id) => {
    return new Promise(async (resolve, reject) => {
      const entity = await Entity.findById(id);
      Entity.findByIdAndRemove(id, (error) => {
        if (error) {
          console.error(error);
          reject({ message: `Can't delete object` });
        } else {
          if (entity.type === 'audio' || entity.type === 'excursion') {
            const filename = entity.files.find((file) => file.type === 'audio').url.split('/').pop();
            fileService.removeFile(filename);
          }
          if (entity.type === 'object' || entity.type === 'excursion') {
            const filename = entity.files.find((file) => file.type === 'model').url.split('/').pop();
            fileService.removeFile(filename);
          }
          resolve();
        }
      });
    });
  },

  getObjectsForPoint: (point) => {
    return new Promise(async (resolve, reject) => {
      const entities = await Entity.find({});
      const readyFiles = await mgFile.find({bundled: true});

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
            const filename = entity.files[0].url.split('/').pop().split('.')[0];
            if (readyFiles.find((file) => file.name === filename)) {
              entity.files[0].assetBundle = entity.files[0].url.split('.zip')[0];
              geo3dObjectModels.push(entity);
            }
          } else if (entity.type === 'excursion') {
            const filename = entity.files.find((file) => file.type === 'model').url.split('/').pop().split('.')[0];
            if (readyFiles.find((file) => file.name === filename)) {
              entity.files = entity.files.map((file) => {
                const newFile = JSON.parse(JSON.stringify(file));

                if (newFile.type === 'model') {
                  newFile.assetBundle = newFile.url.split('.zip')[0];
                }

                return newFile;
              });
              geoExcursionObjectModels.push(entity);
            }
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

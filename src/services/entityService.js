const Entity = require('../models/entity');
const {entity} = require("../middleware/validators");

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
          reject({ message: `Can't delete object` });
        } else {
          resolve();
        }
      });
    });
  }
}
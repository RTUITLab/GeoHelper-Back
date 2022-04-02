const behaviorConfig = require('../../config').behaviorConfig;
const entitiesTypes = ['text', 'object', 'audio', 'excursion'];

const checkEntity = (body) => {
  return new Promise((resolve, reject) => {
    if (!body.type || entitiesTypes.indexOf(body.type) === -1) {
      return reject({ message: 'Wrong object type' });
    }
    if (!body.name) {
      return reject({ message: 'No object name' });
    }
    if (!body.position || !body.position.lat || !body.position.lng) {
      return reject({ message: 'Wrong object position' });
    }
    if (!body.areas || !body.areas.length || body.areas.length < 1) {
      return reject({ message: 'Wrong object areas' });
    }

    let wrongArea = false;
    body.areas.forEach((area) => {
      if (!area.points || area.points.length < 3) {
        wrongArea = true;
        return wrongArea;
      }

      area.points.forEach((point) => {
        if (!point.lat || !point.lng) {
          wrongArea = true;
          return wrongArea;
        }
      });
    });
    if (wrongArea) {
      return reject({ message: 'Wrong object areas' });
    }

    const entity = {
      _id: body._id,
      name: body.name,
      type: body.type,
      position: body.position,
      areas: body.areas
    };

    // Type-based check
    if (body.type === 'text') {
      if (!body.description) {
        return reject({message: 'No object description'});
      }
      entity.description = body.description;
    }

    if (body.type === 'audio' || body.type === 'object') {
      if (!body.url) {
        return reject({ message: 'No file url' });
      }
      if (!body.fileName) {
        return reject({ message: 'No file name' });
      }

      entity.url = body.url;
      entity.fileName = body.fileName;
      entity.files = [{
        type: entity.type === 'audio' ? 'audio' : 'model',
        url: body.url,
        fileName: body.fileName
      }];
    }

    if (body.type === 'object') {
      if (body.hasOwnProperty('behaviors') && body.behaviors.length) {
        let behaviorError = '';

        body.behaviors.forEach((behavior) => {
          if (!(behavior.hasOwnProperty('conditions') && behavior.conditions.length)) {
            behaviorError = 'No conditions was found';
            return;
          }

          behavior.conditions.forEach((cond) => {
            if (!behaviorConfig.conditions.find((item) => item === cond)) {
              behaviorError = `Condition '${cond}' not found`;
            }
          });

          if (!behavior.hasOwnProperty('action')) {
            behaviorError = 'Behavior has no action';
            return;
          }

          if (!behaviorConfig.actionsTypes.find(behavior.action.type)) {
            behaviorError = `'${behavior.action.type}' is a wrong behavior type`;
            return;
          }

          // TODO: add each action validation
        });
      }
    }

    if (body.type === 'excursion') {
      if (!body.description) {
        return reject({ message: 'No object description' });
      }
      if (!body.files) {
        return reject({ message: 'No object files' });
      }
      if(!body.files.find((file) => file.type.indexOf('audio') === 0)) {
        return reject({ message: 'No audio file'});
      }
      if(!body.files.find((file) => file.type.indexOf('model') === 0)) {
        return reject({ message: 'No 3d model file'});
      }

      entity.description = body.description;
      entity.files = body.files;
    }

    resolve(entity);
  });
}

module.exports = {
  createObject: async (req, res, next) => {
    try {
      req.entity = await checkEntity(req.body);
      req.entity.creator = req.user._id;

      next();
    } catch (e) {
      console.error(e);
      res.status(400).json({ success: false, message: e.message });
    }
  },
  deleteObject: (req, res, next) => {
    if (req.body._id) {
      next();
    } else {
      res.status(400).json({ success: false, message: 'No id provided' });
    }
  }
}

const Entity = require('../models/entity');
const { Client } = require('@googlemaps/google-maps-services-js');

const config = require('../config');

const mapClient = new Client({});

module.exports = {
  getDirections: (query) => {
    return new Promise(async (resolve, reject) => {
      let entity;
      if (query.objectId) {
        entity = await Entity.findOne({ _id: query.objectId });

        if (!entity) {
          return reject({ message: `Can't get entity` });
        }

        query.destination = `${entity.position.lat},${entity.position.lng}`;
      }

      const response = await mapClient.directions({
        params: {
          origin: `${query.lat},${query.lng}`,
          destination: query.destination,
          optimize: false,
          mode: 'walking',
          key: config.googleApiKey
        }
      });

      if (response.data.status !== 'OK') {
        return reject({ message: 'No way' });
      }

      if (!query.objectId && !query.compact) {
        return resolve(response.data);
      }

      const resp = {};
      if (query.objectId) {
        resp.end_location = {
          entity: {
            _id: entity._id,
            position: entity.position,
            type: entity.type
          }
        };
      } else {
        resp.start_location = {
          address: response.data.routes[0].legs[0].start_address,
            position: response.data.routes[0].legs[0].start_location
        };
        resp.end_location = {
          address: response.data.routes[0].legs[0].end_address,
          position: response.data.routes[0].legs[0].end_location
        };
      }

      resp.steps = [];
      let last = response.data.routes[0].legs[0].start_location;
      let steps = response.data.routes[0].legs[0].steps;

      while (steps.length > 0) {
        const currentStep = steps.find((S) => S.start_location.lat === last.lat && S.start_location.lng === last.lng);

        resp.steps.push(currentStep.start_location);
        resp.steps[resp.steps.length - 1].id = resp.steps.length;
        steps = steps.filter((S) => !(S.start_location.lat === last.lat && S.start_location.lng === last.lng));
        last = currentStep.end_location;
      }

      resolve(resp);
    });
  }
}
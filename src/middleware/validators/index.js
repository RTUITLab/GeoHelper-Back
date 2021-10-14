const authValidators = require('./authValidators');
const entityValidators = require('./entityValidators');
const fileValidators = require('./fileValidators');
const directionsValidators = require('./directionsValidators');

module.exports = {
  auth: authValidators,
  entity: entityValidators,
  file: fileValidators,
  directions: directionsValidators
}

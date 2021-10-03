const authValidators = require('./authValidators');
const entityValidators = require('./entityValidators');
const fileValidators = require('./fileValidators');

module.exports = {
  auth: authValidators,
  entity: entityValidators,
  file: fileValidators
}

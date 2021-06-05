const expressLoader = require('./express');
const mongooseLoader = require('./mongoose');

module.exports = async (expressApp) => {
  console.log('Start loading application...');

  await mongooseLoader();
  console.log('  + Mongoose loaded');

  await expressLoader(expressApp);
  console.log('  + Express loaded');
  
  console.log('Application loaded');
}
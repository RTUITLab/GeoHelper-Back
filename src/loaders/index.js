const express = require('express');
const expressLoader = require('./express');
const mongooseLoader = require('./mongoose');
const wsLoader = require('./ws');

/**
 *
 * @param { express.Application } expressApp
 */
module.exports = async (expressApp) => {
  console.log('Loading application...');

  await mongooseLoader();
  await expressLoader(expressApp);
  await wsLoader(expressApp);

  console.log('Application loaded.');
}
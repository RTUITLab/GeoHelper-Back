const express = require('express');
const expressLoader = require('./express');
const mongooseLoader = require('./mongoose');

/**
 *
 * @param { express.Application } expressApp
 */
module.exports = async (expressApp) => {
  console.log('Loading application...');

  await mongooseLoader();
  await expressLoader(expressApp);

  console.log('Application loaded.');
}
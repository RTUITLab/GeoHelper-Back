const express = require('express');

const authApi = require('./auth');
const entityApi = require('./entity');
const fileApi = require('./file');
const directionsApi = require('./directions');
const unityLicenseApi = require('./unityLicense');

/**
 *
 * @returns {Router}
 */
module.exports = () => {
  const app = new express.Router();

  app.get('/', (req, res) => {
    res.redirect(301,'https://documenter.getpostman.com/view/8340120/T1LQfQfY');
  });

  authApi(app);
  entityApi(app);
  fileApi(app);
  directionsApi(app);
  unityLicenseApi(app);

  return app;
}

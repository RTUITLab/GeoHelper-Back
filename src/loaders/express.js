const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const security = require('../middleware/security');
const upload = require('../middleware/upload');

const config = require('../config');
const routes = require('@/api');
const path = require("path");

/**
 *
 * @param { express.Application } app
 * @returns {Promise<void>}
 */
module.exports = async (app) => {
  app.use(morgan('common'));

  app.get(config.apiPrefix + '/status', (req, res) => {
    res.send({ status: 'Working'}).status(200);
  });

  app.enable('trust proxy');
  app.use(cors());

  console.log(`${config.uploadDir}`);
  app.use(`/${path.basename(config.uploadDir)}`, express.static(config.uploadDir));

  app.use(security(config.secret, [
    { route: '/objects', role: 'user', methods: ['GET'] },
    { route: '/object', role: 'admin', methods: ['*'] },
    { route: '/direction', role: 'admin', methods: ['*'] },
    { route: '/delete_file', role: 'admin', methods: ['DELETE']},
    { route: '/uploads', role: '*', methods: ['*']},
    { route: '/upload', role: 'admin', methods: ['*']},
  ], config.apiPrefix));

  app.use(upload());

  app.use(bodyParser.json());
  app.use(config.apiPrefix, routes());  // Adds routing

  app.use((req, res, next) => {
    const err = new Error('Not found');
    err['status'] = 404;
    next(err);
  });

  app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500);
    res.json({
      success: false,
      message: err.message
    });
  });

  console.log('+ Express loaded');
}

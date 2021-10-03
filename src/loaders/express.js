const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const config = require('../config');
const routes = require('@/api');

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

  app.use(bodyParser.json());
  app.use(config.apiPrefix, routes());  // Adds routing

  app.use((req, res, next) => {
    const err = new Error('Not found');
    err['status'] = 404;
    next(err);
  });

  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      success: false,
      message: err.message
    });
  });

  console.log('+ Express loaded');
}

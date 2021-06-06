const express = require('express');
const cors = require('cors');
const confing = require('../config');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const routes = require('../api');

/**
 * @param { express.Application } app
 */
module.exports = async (app) => {
  app.use(morgan('common'));
  
  app.get(confing.apiPrefix + '/status', (req, res) => {
    res.status(200).end();
  })
  app.enable('trust proxy');
  app.use(cors());

  app.use(bodyParser.json());
  app.use(confing.apiPrefix, routes());

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
}
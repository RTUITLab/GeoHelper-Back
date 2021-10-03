const express = require('express');

/**
 *
 * @returns {Router}
 */
module.exports = () => {
  const app = new express.Router();

  app.get('/', (req, res) => {
    res.redirect(301,'https://documenter.getpostman.com/view/8340120/T1LQfQfY');
  });

  return app;
}
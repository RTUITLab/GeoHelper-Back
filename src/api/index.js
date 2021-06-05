const Router = require('express').Router;
const authenticateJwt = require('./middleware/authenticateJwt');

module.exports = () => {
  const app = new Router();

  app.get('/me', authenticateJwt, (req, res) => res.status(200).end());

  return app;
}
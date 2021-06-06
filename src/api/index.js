const Router = require('express').Router;
const authenticateJwt = require('./middleware/authenticateJwt');
const auth = require('./auth');

module.exports = () => {
  const app = new Router();

  // app.get('/me', authenticateJwt, (req, res) => res.status(200).end());
  app.get('/', (req, res) => res.redirect(301, "https://documenter.getpostman.com/view/8340120/T1LQfQfY"));

  auth(app);

  return app;
}
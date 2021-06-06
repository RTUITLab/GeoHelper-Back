const { Router } = require('express');
const { Login } = require('./middleware/validators');
const authService = require('../services/auth');

const route = Router();

/**
 * 
 * @param { Router } app 
 */
module.exports = (app) => {
  app.use('/auth', route);

  route.post('/', Login, async (req, res) => {
    try {
      const credentials = await authService.login({
        username: req.body.username,
        password: req.body.password
      });

      res.json({ success: true, message: 'Token granted', ...credentials });
    } catch (e) {
      console.error(e);
      res.status(400).json({ success: false, message: e.message });
    }
  });

  route.post('/setup', async (req, res) => {
    try {
      res.json(await authService.setup());
    } catch (e) {
      console.error(e);
      res.status(400).json({ success: false, message: e.message });
    }
  });
}
const { Router } = require('express');
const Validators = require('../middleware/validators').auth;
const authService = require('../services/authService');

const router = new Router();

// Login
router.post('/', Validators.login, async (req, res) => {
  try {
    const credentials = await authService.login({
      username: req.body.username,
      password: req.body.password,
    });

    res.json({ success: true, message: 'Access granted', ...credentials});
  } catch (e) {
    console.error(e);
    res.status(401).json({ success: false, message: e.message});
  }
});

// Setup default users
router.post('/setup', async (req, res) => {
  try {
    await authService.setup();

    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(400).json({ success: false, message: e.message});
  }
});

/**
 *
 * @param app
 */
module.exports = (app) => {
  app.use('/auth', router);

  console.log('+ + Auth API');
}
const { Router } = require('express');
const Login = require('./middleware/authenticateJwt');
const { CreateEntity } = require('./middleware/validators');
const entityService = require('../services/entity');

const route = Router();

/**
 * 
 * @param { Router } app 
 */
 module.exports = (app) => {
  app.use('/object', route);

  route.get('/', Login, async (req, res) => {
    try {
      const entities = await entityService.getObjects();

      res.json(entities);
    } catch (e) {
      console.error(e);
      res.status(400).json({ success: false, message: e.message });
    }
  });

  route.post('/', Login, CreateEntity, async (req, res) => {
    try {
      res.json({ success: true, object: await entityService.createObject(req.body) });
    } catch (e) {
      console.error(e);
      res.status(400).json({ success: false, message: e.message });
    }
  });
}
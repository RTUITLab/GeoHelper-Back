const { Router } = require('express');
const entityService = require('../services/entityService');
const encryptionService = require('../services/encryptionService');
const {entity} = require("../middleware/validators");
const Validators = require('../middleware/validators').entity;

const router = new Router();

router.post('/', Validators.createObject, async (req, res) => {
  try {
    await entityService.addEntity(req.entity);

    res.status(200).json(req.entity);
  } catch (e) {
    console.error(e);
    res.status(400).json({ success: false, message: e.message });
  }
});

router.put('/', Validators.createObject, async (req, res) => {
  try {
    await entityService.updateEntity(req.entity);

    res.status(200).json(req.entity);
  } catch (e) {
    console.error(e);
    res.status(400).json({ success: false, message: e.message });
  }
});

router.delete('/', Validators.deleteObject, async (req, res) => {
  try {
    await entityService.deleteEntity(req.body._id);

    res.status(200).json({ success: true, message: 'Successfully deleted' });
  } catch (e) {
    console.error(e);
    res.status(400).json({ success: false, message: e.message });
  }
});

router.get('/:id/key', async (req, res) => {
  try {
    const key = encryptionService.encrypt(req.params.id);

    res.status(200).json({ success: true, id: req.params.id, key });
  } catch (e) {
    console.error(e);
    res.status(400).json({ success: false, message: e.message });
  }
})

module.exports = (app) => {
  app.use('/object', router);

  // Get all objects
  app.get('/objects', async (req, res) => {
    try {
      const entities = await entityService.getAllObjects();

      res.status(200).json(entities);
    } catch (e) {
      console.error(e);
      res.status(400).json({ success: false, message: e.message});
    }
  });

  console.log('+ + Entity API');
}

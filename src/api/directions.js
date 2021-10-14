const Validators = require('../middleware/validators').directions;
const directionsService = require('../services/directionsService');

module.exports = (app) => {
  app.get('/direction', Validators.getWay, async (req, res) => {
    try {
      const resp = await directionsService.getDirections(req.data);

      res.status(200).json({ success: true, message: resp });
    } catch (e) {
      res.status(400).json({ success: false, message: e.message });
    }
  });

  console.log('+ + Directions API');
}
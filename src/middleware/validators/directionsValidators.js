module.exports = {
  getWay: (req, res, next) => {
    const query = {};

    if (!req.query.lat) {
      return res.status(400).json({ success: false, message: 'Latitude is required'});
    } else {
      query.lat = req.query.lat;
    }
    if (!req.query.lng) {
      return res.status(400).json({ success: false, message: 'Longitude is required'});
    } else {
      query.lng = req.query.lng;
    }
    if (req.query.compact) {
      query.compact = req.query.compact;
    }

    if (!req.query.objectId && !req.query.destination) {
      return res.status(400).json({ success: false, message: 'ObjectId or destination is required'});
    }

    if(req.query.destination) {
      if (req.query.destination.split(',').length !== 2) {
        return res.status(400).json({ success: false, message: 'Destination is invalid'});
      }

      query.destination = req.query.destination;
    }
    if(req.query.objectId) {
      query.objectId = req.query.objectId;
    }

    req.data = query;
    next();
  }
}
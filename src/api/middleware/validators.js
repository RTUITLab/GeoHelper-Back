const types = ['text', 'audio', 'object', 'excursion'];

module.exports = {
  Login: (req, res, next) => {
    const user = {
      username: req.body.username,
      password: req.body.password
    };

    if (!user.username || !user.password) {
      return res.status(400).json({ success: false, message: 'Bad request'});
    }
    
    return next();
  },

  CreateEntity: (req, res, next) => {
    const entity = req.body;

    if (types.indexOf(entity.type) === -1)
      return res.status(400).json({ success: false, message: 'Wrong type field'});
    
    if (!(entity.position && entity.position.lat && entity.position.lng))
      return res.status(400).json({ success: false, message: 'Wrong position field'});
    
    if (!entity.areas || !entity.areas.length || entity.areas.length < 1)
      return res.status(400).json({ success: false, message: 'Wrong areas field'});

    let wrongArea = false;
    entity.areas.forEach((area) => {
      if (!area.points || area.points.length < 3) {
        wrongArea = true;
        return wrongArea;
      }

      area.points.forEach((point) => {
        if (!point.lat || !point.lng) {
          wrongArea = true;
          return wrongArea;
        }
      });
    });
    if (wrongArea)
      return res.status(400).json({ success: false, message: 'Wrong areas field'});

    if (entity.type === 'text' && !entity.description)
      return res.status(400).json({ success: false, message: 'Wrong description field'});
    if (entity.type === 'audio' && !entity.url)
      return res.status(400).json({ success: false, message: 'Wrong url field'});
    if (entity.type === 'object' && !entity.url)
      return res.status(400).json({ success: false, message: 'Wrong url field'});
    if (entity.type == "excursion") {
      if (!entity.description)
        return res.status(400).json({ success: false, message: 'Wrong description field'});
      if (!entity.files)
        return res.status(400).json({ success: false, message: 'Wrong files field'});
      if(!entity.files.find((file) => file.type.indexOf('audio') === 0))
        return res.status(400).json({ success: false, message: 'No audio file'});
      if(!entity.files.find((file) => file.type.indexOf('model') === 0))
        return res.status(400).json({ success: false, message: 'No model file'});
    }

    return next();
  }
}
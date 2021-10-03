const response = { success: false, message: 'Bad request'};

module.exports = {
  login: (req, res, next) => {
    const body = req.body;

    if (!body.username) {
      response.message = 'No username provided';
      console.log(response);
      return res.status(401).json(response);
    }
    if (!body.password) {
      response.message = 'No password provided';
      console.log(response);
      return res.status(401).json(response);
    }

    next();
  }
}
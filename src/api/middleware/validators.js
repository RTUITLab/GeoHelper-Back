module.exports = {
  Login: (req, res, next) => {
    const user = {
      username: req.body.username,
      password: req.body.password
    };

    if (!user.username || !user.password) {
      return res.status(400).json({ success: false, message: 'Bad request'});
    }
    
    next();
  }
}
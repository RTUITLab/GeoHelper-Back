const jwt = require('jsonwebtoken');

const roles = require('./roles');

module.exports = (secret, config, apiPrefix) => {
  if (apiPrefix) {
    config.map((rule) => {
      rule.route = apiPrefix + rule.route;

      return rule;
    });
  }

  return (req, res, next) => {
    const rule = config.find((R) => req.path.indexOf(R.route) === 0);
    if (!rule || rule.role === '*') {
      next();
      return;
    }

    if (rule.methods.find((M) => M === '*') || rule.methods.find((M) => M === req.method)) {
      if (roles.find((R) => R === rule.role)) {
        let token = req.headers.authorization;
        if (token) {
          token = token.split(' ').pop();
        }
        if (!token || token.split('.').length !== 3) {
          res.status(401).json({ message: 'Invalid token' });
          return;
        }

        jwt.verify(token, secret, (err, user) => {
          if (err) {
            res.status(401).json({ message: 'Invalid token' });
          } else {
            req.user = user;

            const requiredRights = roles.find((R) => R === rule.role);
            const userRights = roles.find((R) => R === user.role);

            if (requiredRights < userRights) {
              res.status(403).json({ message: 'No access to the resource' });
            } else {
              next();
            }
          }
        });
      } else {
        next();
      }
    } else {
      next();
    }
  };
}
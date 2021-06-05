const PassportJwt = require('passport-jwt');
const config = require('../../config');
const User = require('../../models/user');

module.exports = async (passport) => {
  const parameters = {
    secretOrKey: config.secret,
    jwtFromRequest: PassportJwt.ExtractJwt.fromAuthHeaderAsBearerToken
  };

  passport.use(new PassportJwt.Strategy({jwtFromRequest}), (payload, done) => {
    User.findOne({ id: payload.id }, (error, user) => {
      if (error) return done(error);
      if (user) return done(null, user);
      return done(null, false);
    });
  });
}

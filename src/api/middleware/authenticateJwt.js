const config = require('../../config');
const User = require('../../models/user');
const express = require('express');
const jwt = require('jsonwebtoken');


/**
 * 
 * @param { express.Request } req 
 * @param { express.Response } res 
 * @param {*} next 
 */
module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, config.secret, (err, user) => {
      if (err) {
        res.status(401).json({ success: false, message: 'Bad token'});
      }

      User.findOne({ id: user._id }, (error, user) => {
        if (error) res.status(401).json({ success: false, message: 'Unknown user'});
        if (user) next();
        return res.status(401).json({ success: false, message: 'Unknown user'});
      });
    });
  } else {
    res.sendStatus(401);
  }
}

// module.exports = async (passport) => {
//   const parameters = {
//     secretOrKey: config.secret,
//     jwtFromRequest: PassportJwt.ExtractJwt.fromAuthHeaderAsBearerToken
//   };

//   passport.use(new PassportJwt.Strategy({jwtFromRequest}), (payload, done) => {
//     User.findOne({ id: payload.id }, (error, user) => {
//       if (error) return done(error);
//       if (user) return done(null, user);
//       return done(null, false);
//     });
//   });
// }

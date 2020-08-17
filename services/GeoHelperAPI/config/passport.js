//
//
//	File:	passport.js
//
//	By:		Ivan Laptev <ivlaptev13@ya.ru>
//
//	Created:	2020-06-06 20:19:23
//	Updated:	2020-08-16 22:38:47
//
//

/*
 * Description:
 * Configuration of JWT auth
 */

const PassportJWT = require('passport-jwt'),
			ExtractJWT = PassportJWT.ExtractJwt,
			Strategy = PassportJWT.Strategy,
			config = require('./index.js');
			models = require('@GeoHelper/app/setup');

module.exports = (passport) => {
	const User = models.User;
	const parameters = {
		secretOrKey: config.secret,
		jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
	};
	passport.use(new Strategy(parameters, (payload, done) => {
		User.findOne({ id: payload.id }, (error, user) => {
			if (error) return done(error);
			if (user) return done(null, user)
			else return done(null, false);
		});
	}));
}

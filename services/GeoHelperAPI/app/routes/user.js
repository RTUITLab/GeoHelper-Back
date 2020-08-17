//
//
//	File:	user.js
//
//	By:		Ivan Laptev <ivlaptev13@ya.ru>
//
//	Created:	2020-06-07 00:54:02
//	Updated:	2020-08-16 22:19:04
//
//

/*
 * Description:
 * Controls paths working with users.
 */

const passport = require('passport'),
			config = require('@config'),
			models = require('@GeoHelper/app/setup');

module.exports = (app) => {
	const api = app.GeoHelperAPI.app.api.user;

	app.route('/api/v1/setup')
		.post(api.setup(models.User));

	app.route('/api/v1/users')
		.get(passport.authenticate('jwt', config.session), api.index(models.User, app.get('geohelpersecret')));
}

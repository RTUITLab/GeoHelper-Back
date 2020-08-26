//
//
//	File:	file.js
//
//	By:		Ivan Laptev <ivlaptev13@ya.ru>
//
//	Created:	2020-08-24 01:04:57
//	Updated:	2020-08-16 22:17:48
//
//

/*
 * Description:
 * Controls paths connected with files uploading
 */

const passport = require('passport'),
			config = require('@config');

const auth = passport.authenticate('jwt', config.session);

module.exports = (app) => {
	const api = app.GeoHelperAPI.app.api.file;

	app.route('/api/v1/upload')
		.post(auth, api.upload(app.get('geohelpersecret')));
}

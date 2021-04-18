const passport = require('passport'),
			config = require('@config');

const auth = passport.authenticate('jwt', config.session);

module.exports = (app) => {
	const api = app.GeoHelperAPI.app.api.file;

	app.route('/api/v1/upload')
		.post(auth, api.upload(app.get('geohelpersecret')));

	app.route('/api/v1/delete_file')
		.delete(auth, api.delete(app.get('geohelpersecret')));
}

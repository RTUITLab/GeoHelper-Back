const passport = require('passport'),
			config = require('@config'),
			models = require('@GeoHelper/app/setup');

const auth = passport.authenticate('jwt', config.session);

module. exports = (app) => {
	const api = app.GeoHelperAPI.app.api.entity;

	app.route('/api/v1/objects')
		.get(auth, api.getObjects(models.Entity, app.get('geohelpersecret')));

	app.route('/api/v1/object')
		.post(auth, api.createObject(models.Entity, app.get('geohelpersecret')));

	app.route('/api/v1/object')
		.put(auth, api.updateObject(models.Entity, app.get('geohelpersecret')));

	app.route('/api/v1/object')
		.delete(auth, api.deleteObject(models.Entity, app.get('geohelpersecret')));
}
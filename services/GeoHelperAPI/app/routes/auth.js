const models = require('@GeoHelper/app/setup');

module.exports = (app) => {
	const api = app.GeoHelperAPI.app.api.auth;

	app.route('/')
		.get((req, res) => res.send('GeoHelper API'));

	app.route('/api/v1/auth')
		.post(api.login(models.User));
}
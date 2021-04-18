const models = require('@GeoHelper/app/setup');

module.exports = (app) => {
	const api = app.GeoHelperAPI.app.api.auth;

	app.route('/api/v1')
		.get((req, res) => res.redirect(301, "https://documenter.getpostman.com/view/8340120/T1LQfQfY"));

	app.route('/api/v1/auth')
		.post(api.login(models.User));
}

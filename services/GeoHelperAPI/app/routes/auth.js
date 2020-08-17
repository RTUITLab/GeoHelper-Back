//
//
//	File:	auth.js
//
//	By:		Ivan Laptev <ivlaptev13@ya.ru>
//
//	Created:	2020-06-07 00:33:01
//	Updated:	2020-08-16 22:15:58
//
//

/*
 * Description:
 * Controls auth paths and API documentation
 */

const models = require('@GeoHelper/app/setup');

module.exports = (app) => {
	const api = app.GeoHelperAPI.app.api.auth;

	app.route('/api/v1')
		.get((req, res) => res.redirect(301, "https://documenter.getpostman.com/view/8340120/T1LQfQfY"));

	app.route('/api/v1/auth')
		.post(api.login(models.User));
}

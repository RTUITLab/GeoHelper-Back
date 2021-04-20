const passport = require('passport');
const config = require('@config');
const models = require('@GeoHelper/app/setup');

const auth = passport.authenticate('jwt', config.session);

module.exports = (app) => {
	const api = app.GeoHelperAPI.app.api.directions;

    app.route('/api/v1/direction')
        .get(auth, api.getDirection(models.Entity, app.get('geohelpersecret')));
}

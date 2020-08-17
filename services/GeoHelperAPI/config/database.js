//
//
//	File:	database.js
//
//	By:		Ivan Laptev <ivlaptev13@ya.ru>
//
//	Created:	2020-06-06 18:34:17
//	Updated:	2020-08-16 22:35:51
//
//

/*
 * Description:
 * Connects to database/
 *
 * TODO: cath exceptions.
 */

module.exports = (mongoose, config) => {
	const database = mongoose.connection;
	mongoose.Promise = Promise;
	mongoose.connect(config.database, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
		useFindAndModify: false
	});
	database.on('error', error => console.log(`Connection to GeoHelper database failed: ${error}`));
	database.on('connected', () => console.log('Connected to GeoHelper database'));
	database.on('disconnected', () => console.log('Disconnected from GeoHelper database'));
	process.on('SIGINT', () => {
		database.close(() => {
			console.log('GeoHelper terminated, connection closed');
			process.exit(0);
		})
	})
}

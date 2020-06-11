module.exports = (mongoose, config) => {
	const database = mongoose.connection;
	mongoose.Promise = Promise;
	mongoose.connect(config.database, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true
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
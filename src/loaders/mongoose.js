const mongoose = require('mongoose');
const config = require('../config');

module.exports = async () => {
  const database = mongoose.connection;
  mongoose.Promise = Promise;
  mongoose.connect(config.db.link, {
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
  });

  return database;
}

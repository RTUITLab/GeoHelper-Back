const mongoose = require('mongoose');
const config = require('../config');

/**
 *
 * @returns {Promise<unknown>}
 */
module.exports = () => {
  return new Promise((resolve, reject) => {
    console.log(`Connecting to ${config.dbLink}`);

    const database = mongoose.connection;
    mongoose.Promise = Promise;
    mongoose.connect(config.dbLink, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    database.on('error', (error) => {
      console.log(`Connection to GeoHelper database failed: ${error}`);
      reject(error);
    });
    database.on('connected', () => {
      console.log('Connected to GeoHelper database');
      resolve(database);
    });
    database.on('disconnected', () => console.log('Disconnected from GeoHelper database'));

    process.on('SIGINT', () => {
      database.close(() => {
        console.log('GeoHelper terminated, connection closed');
        process.exit(0);
      });
    });

    console.log('+ Mongoose loaded');
  });
}

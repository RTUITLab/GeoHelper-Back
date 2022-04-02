require('dotenv').config();
const path = require('path');

const adminUser = {
  username: process.env.A_USER,
  password: process.env.A_PASS
};

const uploadDir = path.resolve('./' + process.env.UPLOAD_DIR);

const serverPort = process.env.PORT;

const googleApiKey = process.env.GOOGLE_API_KEY;

const M_DB = process.env.M_DB;
const M_USER = process.env.M_USER;
const M_HOST = process.env.M_HOST;
const M_PASS = process.env.M_PASS;
const M_PORT = process.env.M_PORT;
const dbLink = process.env.M_URL || `mongodb://${M_USER}:${M_PASS}@${M_HOST}:${M_PORT}/${M_DB}?authSource=admin`;

const secret = process.env.M_SECRET;

module.exports = {
  adminUser,
  uploadDir,
  serverPort,
  googleApiKey,
  dbLink,
  secret,
  apiPrefix: '/api/v1',
  behaviorConfig: require('./behavior')
}

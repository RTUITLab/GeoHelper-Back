const dotenv = require('dotenv');

dotenv.config();

const M_USER = process.env.M_USER;
const M_PASS = process.env.M_PASS;
const M_HOST = process.env.M_HOST;
const M_PORT = process.env.M_PORT;
const M_DB = process.env.M_DB;

module.exports = {
  db: {
    link: process.env.M_URL || `mongodb://${M_USER}:${M_PASS}@${M_HOST}:${M_PORT}/${M_DB}?authSource=admin`,
    user: {
      username: process.env.A_USER,
      password: process.env.A_PASS
    }
  },
  secret: process.env.M_SECRET,
  port: process.env.PORT,
  uploadDir: process.env.UPLOAD_DIR,
  googleApiKey: process.env.GOOGLE_API_KEY,
  apiPrefix: '/api/v1'
}

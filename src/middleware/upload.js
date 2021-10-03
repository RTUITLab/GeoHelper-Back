const multer = require('multer');
const { v4: uuidV4 } = require('uuid');

const config = require('../config');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, config.uploadDir);
  },
  filename: (req, file, callback) => {
    callback(null, uuidV4() + '.' + file.originalname.split('.').pop());
  }
});

module.exports = () => {
  return multer({ storage: storage }).single('file');
}

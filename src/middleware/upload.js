const multer = require('multer');
const { v4: uuidV4 } = require('uuid');
const path = require('path');

const config = require('../config');
const awsService = require('../services/awsService');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, config.uploadDir);
  },
  filename: (req, file, callback) => {
    callback(null, uuidV4() + '.' + file.originalname.split('.').pop());
  }
});

module.exports = {
  multerUpload: () => {
    return multer({ storage: storage }).single('file');
  },

  staticFiles: (req, res, next) => {
    if (req.baseUrl.indexOf(path.basename(config.uploadDir)) === 1) {
      res.redirect(awsService.getFromS3(req.path.slice(1, req.path.length)));
    } else {
      next();
    }
  }
}

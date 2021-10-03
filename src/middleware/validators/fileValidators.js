module.exports = {
  uploadFile: (req, res, next) => {
    if (req.file && req.file.filename) {
      next();
    } else {
      res.status(400).json({ success: false, message: 'No file provided' });
    }
  },

  deleteFile: (req, res, next) => {
    if (!req.body.url) {
      res.status(400).json({ success: false, message: 'No file url' });
    } else {
      next();
    }
  }
}
const Validators = require('../middleware/validators').file;
const fileService = require('../services/fileService');
const awsService = require('../services/awsService');

module.exports = (app) => {
  app.post('/upload', Validators.uploadFile, async (req, res) => {
    try {
      awsService.uploadFileToS3(req.file);
      const fileId = await fileService.processFile(req.file.filename, req.user);

      res.status(201).json({ success: true, message: 'File created', name: req.file.filename, _id: fileId });
    } catch (e) {
      res.status(400).json({ success: false, message: e.message });
    }
  });

  app.get('/upload', async (req, res) => {
    try {
      const files = await fileService.getAllFiles();

      res.status(200).json(files);
    } catch (e) {
      res.status(400).json({ success: false, message: e.message });
    }
  });

  app.get('/uploads/:filename', async (req, res) => {
    try {
      res.redirect(awsService.getFromS3(req.params.filename));
    } catch (e) {
      res.status(400).json({ success: false, message: e.message });
    }
  });

  app.delete('/upload', async (req, res) => {
    try {
      const files = await fileService.deleteAllFilesData();

      res.status(200).json(files);
    } catch (e) {
      res.status(400).json({ success: false, message: e.message });
    }
  });

  app.delete('/delete_file', Validators.deleteFile, async (req, res) => {
    try {
      await fileService.removeFile(req.body.url);

      res.status(200).json({ success: true, message: 'Files deleted' });
    } catch (e) {
      res.status(400).json({ success: false, message: e.message });
    }
  });

  console.log('+ + File API');
}

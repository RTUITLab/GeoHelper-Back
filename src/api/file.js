const Validators = require('../middleware/validators').file;
const fileService = require('../services/fileService');

module.exports = (app) => {
  app.post('/upload', Validators.uploadFile, async (req, res) => {
    try {
      await fileService.processFile(req.file.filename);

      res.status(201).json({ success: true, message: 'File created', name: req.file.filename });
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

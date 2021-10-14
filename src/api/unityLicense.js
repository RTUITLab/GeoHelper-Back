const { Router } = require('express');
const path = require('path');

const exec = require('child_process').exec;

const config = require('../config');

const router = new Router();

router.get('/unity.alf', (req, res) => {
  res.sendFile(process.env.UNITY_ALF);
});

router.post('/ulf', async (req, res) => {
  const filename = req.file.filename;

  exec(`"${process.env.UNITY_PATH}"` +
    ` -batchmode -nographics -manualLicenseFile "${path.resolve(config.uploadDir, filename)}" -quit`, (c, e) => {
    console.log(c);
    console.log(e);

    res.status(200).send();
  });
});

module.exports = (app) => {
  app.use('/license', router);
  console.log('+ + Unity License API');
}

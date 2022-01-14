const { Router } = require('express');
const path = require('path');

const exec = require('child_process').exec;

const config = require('../config');

const router = new Router();

router.get('/', (req, res) => {
  res.sendFile('/usr/src/app/log');
})

router.get('/unity.alf', (req, res) => {
  res.sendFile(process.env.UNITY_ALF);
});

router.post('/ulf', async (req, res) => {
  const filename = req.file.filename;

  exec(`"${process.env.UNITY_PATH}"` +
    ` -batchmode -nographics -manualLicenseFile "${path.resolve(config.uploadDir, filename)}" -quit -logFile ./log`, (c, e) => {
    console.log(c);
    console.log(e);

    res.status(200).send();
  });
});

// Setting up licence from secret encoded file
exec(`openssl aes-256-cbc -d -iter 1000 -in /run/secrets/unity_file -out ./Unity_v2019.x.ulf -k $UNITY_KEY`, (c, e) => {
  console.log(c);
  console.log(e);
});

exec(`"${process.env.UNITY_PATH}"` +
    ` -batchmode -nographics -manualLicenseFile ./Unity_v2019.x.ulf -quit -logFile ./log`, (c, e) => {
  console.log(c);
  console.log(e);
});

module.exports = (app) => {
  app.use('/license', router);
  console.log('+ + Unity License API');
}

const fs = require('fs');

const aws = require('aws-sdk');
const stream = require("stream");

let s3;

aws.config.getCredentials((err) => {
  if (err) {
    console.log(err);
  } else {
    s3 = new aws.S3({
      credentials: aws.config.credentials,
      endpoint: 'https://storage.yandexcloud.net',
      region: 'ru-central1',
    });

    console.log('Connected to AWS S3');
  }
});

module.exports = {
  uploadToS3: (file, type) => {
    let readStream = fs.createReadStream(file.path);
    let key = type + '/' + file.filename;

    const upload = () => {
      const pass = new stream.PassThrough();

      const params = {
        Bucket: 'geohelper',
        Key: key,
        Body: pass
      };
      s3.upload(params, (err, d) => {
        console.log(err);
      });

      return pass;
    }

    readStream.pipe(upload());
  },
  getFromS3: (key) => {
    const params = {
      Bucket: 'geohelper',
      Key: key,
    }

    return s3.getSignedUrl('getObject', params);
  }
}

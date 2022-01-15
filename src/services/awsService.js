const fs = require('fs');
const stream = require('stream');
const mime = require('mime-types');

const aws = require('aws-sdk');

let s3;

aws.config.getCredentials((err) => {
  if (err) {
    console.log(err);
    throw err;
  } else {
    s3 = new aws.S3({
      credentials: aws.config.credentials,
      endpoint: 'https://storage.yandexcloud.net',
      region: 'ru-central1',
    });

    console.log('Connected to AWS S3');
  }
});


/**
 *
 * @param {String} filename
 */
const getPath = (filename) => {
  const ext = filename.split('.').pop();
  if (ext === 'ios' || ext === 'android') {
    return 'AssetBundles';
  } else if (mime.lookup(filename).indexOf('audio') > -1) {
    return 'Audio';
  } else {
    return 'Models';
  }
}

module.exports = {
  uploadContentToS3: (filename, content) => {
    const params = {
      Bucket: 'geohelper',
      Key: getPath(filename) + '/' + filename,
      Body: content
    };
    s3.upload(params, (err, d) => {
      if (err) {
        console.log(err);
        throw err;
      }
    });
  },

  uploadFileToS3: ({ path, filename}) => {
    let readStream = fs.createReadStream(path);
    let key = getPath(filename) + '/' + filename;

    const upload = () => {
      const pass = new stream.PassThrough();

      const params = {
        Bucket: 'geohelper',
        Key: key,
        Body: pass
      };
      s3.upload(params, (err, d) => {
        if (err) {
          console.log(err);
          throw err;
        }
      });

      return pass;
    }

    readStream.pipe(upload());
  },

  getFromS3: (key) => {
    const params = {
      Bucket: 'geohelper',
      Key: getPath(key) + '/' + key,
    }

    return s3.getSignedUrl('getObject', params);
  }
}

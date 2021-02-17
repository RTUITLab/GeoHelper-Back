//
//
//	File:	file.js
//
//	By:		Ivan Laptev <ivlaptev13@ya.ru>
//
//	Created:	2020-08-24 01:09:02
//	Updated:	2020-08-27 18:12:07
//
//

/*
 * Description:
 * Functions that are uploading files.
 */

const fs = require('fs');
const JSZip = require('jszip');

const api = {};

api.upload = (Token) => (req, res) => {
	if (Token) {
    console.log(process.env.UPLOAD_DIR + '/' + req.file.filename);

    let dirName = req.file.filename.split('.')[0];

    fs.readFile(process.env.UPLOAD_DIR + '/' + req.file.filename, (err, data) => {
      JSZip.loadAsync(data)
        .then(async(zip) => {
          fs.mkdirSync(process.env.UPLOAD_DIR + '/' + dirName);

          Object.keys(zip.files).forEach(function(filename) {
            zip.file(filename).async('nodebuffer').then(function(content) {
              var dest = process.env.UPLOAD_DIR + '/' + dirName + '/' + filename;
              console.log(dest)
              fs.writeFileSync(dest, content);
            });
          });

    fs.readdir(process.env.UPLOAD_DIR + '/' + req.file.filename, (err, data) => {
      console.log(data);
    })


        });
    });
    
		return res.status(201).send({
			success: true,
			message: 'Success',
			name: `${req.file.filename}`
		});
	} else return res.status(401).send({ success: false, message: 'Unauthorized' });
}

api.delete = (Token) => (req, res) => {
  if (Token) {
    try {
      fs.unlink(process.env.UPLOAD_DIR + '/' + req.body.url, () => {
        console.log(`File ${req.body.url} removed`);
      });
    } catch (error) {
      console.log(error);
    }
    res.status(200).send({ success: true });
  } else return res.status(401).send({ success: false, message: 'Unauthorized' });
}

module.exports = api;

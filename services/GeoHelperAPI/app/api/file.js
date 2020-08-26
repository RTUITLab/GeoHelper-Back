//
//
//	File:	file.js
//
//	By:		Ivan Laptev <ivlaptev13@ya.ru>
//
//	Created:	2020-08-24 01:09:02
//	Updated:	2020-08-16 21:31:31
//
//

/*
 * Description:
 * Functions that are uploading files.
 *
 * Functions:
 *
 */

const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const api = {};

const uploadDir = process.env.UPLOAD_DIR;

typeCorrect = (type, ext) => {
	const audio = ['mp3', 'ogg', 'flac', 'wav'];

	if (type.indexOf('audio') != -1)
		return audio.indexOf(ext) != -1;
}

api.upload = (Token) => (req, res) => {
	if (Token) {
		return res.status(201).send({
			success: true,
			message: 'Success',
			name: `${req.file.filename}`
		});
	} else return res.status(401).send({ success: false, message: 'Unauthorized' });
}

api.createFile = (Token) => (req, res) => {
	if (Token) {
		if (typeCorrect(req.body.type, req.body.name.split('.').pop())) {
			const fileName = uuidv4();
			const filePath = `${uploadDir}/${fileName}`
			if (!fs.existsSync(filePath)) {
				fs.mkdirSync(filePath);
				fs.writeFileSync(`${filePath}/.tmp`, JSON.stringify(req.body));
				fs.writeFileSync(`${filePath}/${fileName}.${req.body.name.split('.').pop()}`, '');
				return res.status(201).send({
					success: true,
					message: 'Success',
					name: `${fileName}.${req.body.name.split('.').pop()}`
				});
			} else return res.status(500).send({ success: false, message: 'Server error' });
		} else return res.status(404).send({ success: false, message: 'Wrong type' });
	} else return res.status(401).send({ success: false, message: 'Unauthorized' });
}

api.uploadChunk = (Token) => (req, res) => {
	//console.log(req);
	const filePath = `${uploadDir}/${req.body.name.split('.')[0]}`;
	const file = `${filePath}/${req.body.name}`;

	try {
		//req.body.data.arrayBuffer().then(buffer => {
			fs.appendFileSync(file, Buffer(new Uint8Array(req.body.data)));
		//});
		return res.status(200).send({ success: false, message: 'Chunk added' });
	}
	catch (error) {
		console.log(error);
		return res.status(500).send({ success: false, message: 'Server error' });
	}
}

module.exports = api;

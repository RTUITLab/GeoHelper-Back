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
 */
const api = {};

api.upload = (Token) => (req, res) => {
	if (Token) {
		return res.status(201).send({
			success: true,
			message: 'Success',
			name: `${req.file.filename}`
		});
	} else return res.status(401).send({ success: false, message: 'Unauthorized' });
}

module.exports = api;

const mongoose = require('mongoose');

const api = {};

api.setup = (User) => (req, res) => {
	const admin = new User({
		username: process.env.A_USER,
		password: process.env.A_PASS
	});
	admin.save(error => {
		console.log(error);
		if (error) res.status(400).json({ success: false, message: 'Bad request' });
		else res.json({ success: true });
	});
}

api.index = (User, Token) => (req, res) => {
	if (Token) {
		User.find({}, (error, users) => {
			if (error) res.status(400).json({ success: false, message: 'Bad request' });
			else res.status(200).json(users);
		});
	} else return res.status(401).send({ success: false, message: 'Unauthorized' });
}

module.exports = api;

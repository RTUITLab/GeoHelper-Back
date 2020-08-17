//
//
//	File:	user.js
//
//	By:		Ivan Laptev <ivlaptev13@ya.ru>
//
//	Created:	2020-06-10 18:58:31
//	Updated:	2020-08-16 22:13:19
//
//

/*
 * Description:
 * Contains the description of User collectioni.
 *
 * Note:
 * Database stores only bcrypt hashes of passwords.
 */

const mongoose = require('mongoose'),
			bcrypt = require('bcrypt');

const Schema = mongoose.Schema({
	username: {
		type: String,
		unique: true,
		required: true
	},
	password: {
		type: String,
		required: true
	}
});

// Creating password hash before saving pass
Schema.pre('save', function (next) {
	const user = this;
	if (this.isModified('password') || this.isNew) {
		bcrypt.genSalt(10, (error, salt) => {
			if (error) return next(error);
			bcrypt.hash(user.password, salt, (error, hash) => {
				if (error) return next(error);
				user.password = hash;
				next();
			});
		});
	} else {
		return next();
	}
});

Schema.methods.comparePassword = function (password, callback) {
	bcrypt.compare(password, this.password, (error, matches) => {
		if (error) return callback(error);
		callback(null, matches);
	});
};

mongoose.model('User', Schema);

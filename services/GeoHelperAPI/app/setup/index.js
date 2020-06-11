const mongoose = require('mongoose'),
			UserModel = require('@GeoHelperModels/user.js'),
			EntityModel = require('@GeoHelperModels/entity.js');

const models = {
	User: mongoose.model('User'),
	Entity: mongoose.model('Entity')
};

module.exports = models;
//
//
//	File:	index.js
//
//	By:		Ivan Laptev <ivlaptev13@ya.ru>
//
//	Created:	2020-06-06 22:51:21
//	Updated:	2020-08-16 22:21:10
//
//

/*
 * Description:
 * Collect all collections (models) and export them.
 */

const mongoose = require('mongoose'),
			UserModel = require('@GeoHelperModels/user.js'),
			EntityModel = require('@GeoHelperModels/entity.js');

const models = {
	User: mongoose.model('User'),
	Entity: mongoose.model('Entity')
};

module.exports = models;

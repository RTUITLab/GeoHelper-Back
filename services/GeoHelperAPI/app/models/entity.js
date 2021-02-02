//
//
//	File:	entity.js
//
//	By:		Ivan Laptev <ivlaptev13@ya.ru>
//
//	Created:	2020-06-10 12:04:55
//	Updated:	2020-08-17 10:56:15
//
//

/*
 * Description:
 * Contains the description of Entity collection
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	type: {
		type: String,
		required: true,
		enum: ['text', 'image', 'video', 'object', 'audio']
	},
	description: String,
	position: {
		lat: {
			type: Number,
			required: true
		},
		lng: {
			type: Number,
			required: true
		}
	},
	fileName: {
		type: String
	},
	url: {
		type: String
	},
	areas: [
		{
			points: [{
				lat: Number,
				lng: Number
			}]
		}
	],
	additionalLines: [
		{
			start: {
				lat: Number,
				lng: Number
			},
			end: {
				lat: Number,
				lng: Number
			}
		}
	]
});

mongoose.model('Entity', Schema)

const mongoose = require('mongoose');

const Schema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	type: {
		type: String,
		required: true,
		enum: ['text', 'image', 'video', 'object']
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

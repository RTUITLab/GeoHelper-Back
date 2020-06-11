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
		x: {
			type: Number,
			required: true
		},
		y: {
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
				x: Number,
				y: Number
			}]
		}
	],
	additionalLines: [
		{
			start: {
				x: Number,
				y: Number
			},
			end: {
				x: Number,
				y: Number
			}
		}
	]
});

mongoose.model('Entity', Schema)

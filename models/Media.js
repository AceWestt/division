const mongoose = require('mongoose');

const MediaSchema = new mongoose.Schema({
	img: {
		type: String,
		required: true,
	},
	link: {
		type: String,
		required: true,
	},
	title: {
		ru: {
			type: String,
			required: true,
		},
		en: {
			type: String,
			required: true,
		},
		uz: {
			type: String,
			required: true,
		},
	},
	date: {
		type: Date,
		required: true,
		default: () => {
			return Date.now();
		},
	},
	created: {
		type: Date,
		default: () => {
			return Date.now();
		},
	},
	updated: {
		type: Date,
		default: () => {
			return Date.now();
		},
	},
});

MediaSchema.pre('save', function (next) {
	this.updated = Date.now();
	next();
});

const Media = mongoose.model('Media', MediaSchema);

module.exports = Media;

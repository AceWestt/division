const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
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
	text: {
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

ServiceSchema.pre('save', function (next) {
	this.updated = Date.now();
	next();
});

const Service = mongoose.model('Service', ServiceSchema);

module.exports = Service;

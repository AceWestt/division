const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
	img: {
		type: String,
		required: true,
	},
	name: {
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

TeamSchema.pre('save', function (next) {
	this.updated = Date.now();
	next();
});

const Team = mongoose.model('Team', TeamSchema);

module.exports = Team;

const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
	logo: {
		type: String,
		required: true,
	},
	row: {
		type: Number,
		required: true,
		min: 1,
	},
	hideOnMobile: {
		type: Boolean,
		default: false,
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

ClientSchema.pre('save', function (next) {
	this.updated = Date.now();
	next();
});

const Client = mongoose.model('Client', ClientSchema);

module.exports = Client;

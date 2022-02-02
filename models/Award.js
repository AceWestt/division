const mongoose = require('mongoose');

const AwardSchema = new mongoose.Schema({
	logo: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
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

AwardSchema.pre('save', function (next) {
	this.updated = Date.now();
	next();
});

const Award = mongoose.model('Award', AwardSchema);

module.exports = Award;

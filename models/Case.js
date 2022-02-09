const mongoose = require('mongoose');

const CaseSchema = new mongoose.Schema({
	category_id: { type: String },
	preview: {
		type: String,
		required: true,
	},
	mobileWidth: {
		type: Number,
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
	subtitle: {
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
	description: {
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
	blocks: [],
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

CaseSchema.pre('save', function (next) {
	this.updated = Date.now();
	next();
});

const Case = mongoose.model('Case', CaseSchema);

module.exports = Case;

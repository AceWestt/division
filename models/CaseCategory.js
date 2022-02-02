const mongoose = require('mongoose');

const CaseCategorySchema = new mongoose.Schema({
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

CaseCategorySchema.pre('save', function (next) {
	this.updated = Date.now();
	next();
});

const CaseCategory = mongoose.model('CaseCategory', CaseCategorySchema);

module.exports = CaseCategory;

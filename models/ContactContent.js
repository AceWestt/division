const mongoose = require('mongoose');
const { multiLangString } = require('../utils/tools');

const ContactContentSchema = new mongoose.Schema({
	id: {
		type: Number,
		required: true,
		unique: true,
	},
	email: {
		type: String,
		required: true,
		default: 'u.ergashev@dvsn.uz',
	},

	phone: { type: String, required: true, default: '+ 998 97 444 84 93' },
	facebook: {
		type: String,
		required: true,
		default: 'https://www.facebook.com/dvsn.agency',
	},
	instagram: {
		type: String,
		required: true,
		default: 'https://www.instagram.com/division.agency/',
	},
	address: {
		ru: {
			type: String,
			required: true,
			default: 'г. Ташкент улица Тадбиркор 78',
		},
		en: {
			type: String,
			required: true,
			default: 'г. Ташкент улица Тадбиркор 78',
		},
		uz: {
			type: String,
			required: true,
			default: 'г. Ташкент улица Тадбиркор 78',
		},
	},
	officeCoords: {
		long: {
			type: String,
			required: true,
			default: '41.270079',
		},
		lat: {
			type: String,
			required: true,
			default: '69.23447',
		},
	},
});

const ContactContent = mongoose.model('Contactscreen', ContactContentSchema);

module.exports = ContactContent;

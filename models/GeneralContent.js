const mongoose = require('mongoose');
const { img } = require('../utils/tools');

const GeneralContentSchema = new mongoose.Schema({
	id: {
		type: Number,
		required: true,
		unique: true,
	},
	mainLinkGif: img('/files/defaults/menuGifs/main.gif'),
	aboutLinkGif: img('/files/defaults/menuGifs/about-us.gif'),
	casesLinkGif: img('/files/defaults/menuGifs/cases.gif'),
	servicesLinkGif: img('/files/defaults/menuGifs/services.gif'),
	contactsLinkGif: img('/files/defaults/menuGifs/contacts.gif'),
});

const GeneralContent = mongoose.model('GeneralContent', GeneralContentSchema);

module.exports = GeneralContent;

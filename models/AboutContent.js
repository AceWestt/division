const mongoose = require('mongoose');
const { img } = require('../utils/tools');
const AboutContentSchema = new mongoose.Schema({
	id: {
		type: Number,
		required: true,
		unique: true,
	},
	slogan: {
		ru: {
			type: String,
			required: true,
			default:
				'<b>Division Marketing Agency </b> — мы превратили свою работу в настоящую страсть. Наша история началась летом 2018 года. Тогда наша команда состояла только из трех человек, а сегодня нас уже больше 25-ти.',
		},
		en: {
			type: String,
			required: true,
			default:
				'<b>Division Marketing Agency </b> — мы превратили свою работу в настоящую страсть. Наша история началась летом 2018 года. Тогда наша команда состояла только из трех человек, а сегодня нас уже больше 25-ти.',
		},
		uz: {
			type: String,
			required: true,
			default:
				'<b>Division Marketing Agency </b> — мы превратили свою работу в настоящую страсть. Наша история началась летом 2018 года. Тогда наша команда состояла только из трех человек, а сегодня нас уже больше 25-ти.',
		},
	},
	teamPhoto1: img('/files/defaults/aboutContent/hero-1-about.png'),
	teamPhoto2: img('/files/defaults/aboutContent/hero-2-about.png'),
	teamPhoto3: img('/files/defaults/aboutContent/hero-3-about.png'),
	teamPhoto4: img('/files/defaults/aboutContent/hero-4-about.png'),
	advantageText: {
		ru: {
			type: String,
			required: true,
			default:
				'Наше главное преимущество — нестандартное решение задач любой сложности.',
		},
		en: {
			type: String,
			required: true,
			default:
				'Наше главное преимущество — нестандартное решение задач любой сложности.',
		},
		uz: {
			type: String,
			required: true,
			default:
				'Наше главное преимущество — нестандартное решение задач любой сложности.',
		},
	},
	energyText: {
		ru: {
			type: String,
			required: true,
			default: 'Мы полны энергии и всегда готовы к новым вызовам!',
		},
		en: {
			type: String,
			required: true,
			default: 'Мы полны энергии и всегда готовы к новым вызовам!',
		},
		uz: {
			type: String,
			required: true,
			default: 'Мы полны энергии и всегда готовы к новым вызовам!',
		},
	},
	energyImg: img('/files/defaults/aboutContent/slogan-img.png'),
});

const AboutContent = mongoose.model('AboutContent', AboutContentSchema);

module.exports = AboutContent;

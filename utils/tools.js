exports.multiLangString = (ruDefaultText, enDefault, uzDefaultText) => {
	return {
		ru: {
			type: String,
			requried: [true, `Введите текст! (ru)`],
			default: ruDefaultText,
		},
		en: {
			type: String,
			requried: [true, `Введите текст! (en)`],
			default: enDefault,
		},
		uz: {
			type: String,
			required: [true, 'Введите текст! (uz)'],
			default: uzDefaultText,
		},
	};
};

exports.img = (defaultPath) => {
	return {
		type: String,
		requried: [true, 'Загрузите изображение!'],
		default: defaultPath,
	};
};

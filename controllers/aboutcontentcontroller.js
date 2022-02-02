const AboutContent = require('../models/AboutContent');
const ErrorResponse = require('../utils/errorResponse');
const fs = require('fs/promises');
const crypto = require('crypto');

exports.get = async (req, res, next) => {
	try {
		let content = await AboutContent.findOne({ id: 777 });
		if (!content) {
			content = await new AboutContent({ id: 777 });
			await content.save(async (err) => {
				if (err) {
					return next(
						new ErrorResponse('Could not create general content assets', 500)
					);
				}
			});
		}
		res.status(200).json({ data: content });
	} catch (error) {
		next(error);
	}
};

exports.update = async (req, res, next) => {
	try {
		const id = req.params.id;
		const body = req.body;
		const files = req.files;

		const content = await AboutContent.findById(id);
		const uploadPath = '/files/uploads/aboutContent/';

		if (files && files.teamPhoto1) {
			content.teamPhoto1 = await fileUpload(
				files.teamPhoto1,
				content.teamPhoto1,
				'/files/defaults/aboutContent/hero-1-about.png',
				next,
				'team-photo1',
				uploadPath
			);
		}
		if (files && files.teamPhoto2) {
			content.teamPhoto2 = await fileUpload(
				files.teamPhoto2,
				content.teamPhoto2,
				'/files/defaults/aboutContent/hero-2-about.png',
				next,
				'team-photo2',
				uploadPath
			);
		}
		if (files && files.teamPhoto3) {
			content.teamPhoto3 = await fileUpload(
				files.teamPhoto3,
				content.teamPhoto3,
				'/files/defaults/aboutContent/hero-3-about.png',
				next,
				'team-photo3',
				uploadPath
			);
		}
		if (files && files.teamPhoto4) {
			content.teamPhoto4 = await fileUpload(
				files.teamPhoto4,
				content.teamPhoto4,
				'/files/defaults/aboutContent/hero-4-about.png',
				next,
				'team-photo4',
				uploadPath
			);
		}
		if (files && files.energyImg) {
			content.energyImg = await fileUpload(
				files.energyImg,
				content.energyImg,
				'/files/defaults/aboutContent/slogan-img.png',
				next,
				'energy-img',
				uploadPath
			);
		}
		content.slogan = JSON.parse(body.slogan);
		content.advantageText = JSON.parse(body.advantageText);
		content.energyText = JSON.parse(body.energyText);
		await content.save(async (err) => {
			if (err) {
				return next(new ErrorResponse('something went wrong on save'));
			}
		});
		res.status(200).json({ status: 'success' });
	} catch (error) {
		next(error);
	}
};

const fileUpload = async (
	file,
	currentFile,
	defaultFile,
	next,
	mainName,
	movePath
) => {
	const new_img = file;
	const old_img = currentFile;
	if (old_img !== defaultFile) {
		try {
			if (
				await ifFileExists(
					`${__clientdir}${old_img.replace(`${__uploadRoot}`, '')}`
				)
			) {
				fs.unlink(`${__clientdir}${old_img.replace(`${__uploadRoot}`, '')}`);
			}
		} catch (error) {
			return next(new ErrorResponse('internal error', 500));
		}
	}
	let ext = new_img.name.split('.');
	ext = ext[ext.length - 1];
	const file_name = `${crypto
		.randomBytes(10)
		.toString('hex')}-${mainName}-${new Date().getTime().toString()}.${ext}`;
	new_img.mv(`${__clientdir}${movePath}${file_name}`, (err) => {
		if (err) {
			console.error(err);
			return next(new ErrorResponse(err, 500));
		}
	});

	return `${__uploadRoot}${movePath}${file_name}`;
};

const ifFileExists = async (path) => {
	try {
		await fs.access(path);
		return true;
	} catch (error) {
		return false;
	}
};

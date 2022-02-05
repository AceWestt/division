const GeneralContent = require('../models/GeneralContent');
const ErrorResponse = require('../utils/errorResponse');
const fs = require('fs/promises');
const crypto = require('crypto');

exports.get = async (req, res, next) => {
	try {
		let screen = await GeneralContent.findOne({ id: 777 });
		if (!screen) {
			screen = await new GeneralContent({ id: 777 });
			await screen.save(async (err) => {
				if (err) {
					return next(
						new ErrorResponse('Could not create general content assets', 500)
					);
				}
			});
		}
		res.status(200).json({ data: screen });
	} catch (error) {
		next(error);
	}
};

exports.update = async (req, res, next) => {
	try {
		const id = req.params.id;
		const body = req.body;
		const files = req.files;

		const screen = await GeneralContent.findById(id);

		const uploadpath = '/files/uploads/general/';

		if (files && files.mainLinkGif) {
			screen.mainLinkGif = await fileUpload(
				files.mainLinkGif,
				screen.mainLinkGif,
				'/files/defaults/menuGifs/main.gif',
				next,
				'main-gif',
				uploadpath
			);
		}
		if (files && files.aboutLinkGif) {
			screen.aboutLinkGif = await fileUpload(
				files.aboutLinkGif,
				screen.aboutLinkGif,
				'/files/defaults/menuGifs/about-us.gif',
				next,
				'about-us-gif',
				uploadpath
			);
		}

		if (files && files.casesLinkGif) {
			screen.casesLinkGif = await fileUpload(
				files.casesLinkGif,
				screen.casesLinkGif,
				'/files/defaults/menuGifs/cases.gif',
				next,
				'casesLinkGif',
				uploadpath
			);
		}

		if (files && files.servicesLinkGif) {
			screen.servicesLinkGif = await fileUpload(
				files.servicesLinkGif,
				screen.servicesLinkGif,
				'/files/defaults/menuGifs/services.gif',
				next,
				'servicesLinkGif',
				uploadpath
			);
		}

		if (files && files.contactsLinkGif) {
			screen.contactsLinkGif = await fileUpload(
				files.contactsLinkGif,
				screen.contactsLinkGif,
				'/files/defaults/menuGifs/contacts.gif',
				next,
				'contactsLinkGif',
				uploadpath
			);
		}

		await screen.save((err) => {
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

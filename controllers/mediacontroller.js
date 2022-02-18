const Media = require('../models/Media');
const ErrorResponse = require('../utils/errorResponse');
const fs = require('fs/promises');
const crypto = require('crypto');

exports.getAll = async (req, res, next) => {
	try {
		const media = await Media.find({});
		media.sort((a, b) => b.date - a.date);
		res.status(200).json({ data: media });
	} catch (error) {
		next(error);
	}
};

exports.get = async (req, res, next) => {
	try {
		const id = req.params.id;
		const media = await Media.findById(id);
		res.status(200).json({ data: media });
	} catch (error) {
		next(error);
	}
};

exports.add = async (req, res, next) => {
	try {
		const body = req.body;
		const files = req.files;

		const media = await new Media({
			title: JSON.parse(body.title),
			link: body.link,
			date: body.date,
		});

		if (files && files.img) {
			const imgName = await fileUpload(
				files.img,
				undefined,
				undefined,
				next,
				`media_img_${media._id}`,
				'/files/uploads/media/'
			);
			media.img = imgName;
		}
		await media.save(async (err) => {
			if (err) {
				return next(new ErrorResponse('Could not create media', 500));
			}
		});
		res.status(200).json({ status: 'success' });
	} catch (error) {
		next(error);
	}
};

exports.update = async (req, res, next) => {
	try {
		const id = req.params.id;
		const body = req.body;
		const files = req.files;

		const media = await Media.findById(id);
		media.title = JSON.parse(body.title);
		media.link = body.link;
		media.date = body.date;

		if (files && files.img) {
			const imgName = await fileUpload(
				files.img,
				media.img,
				undefined,
				next,
				`media_img_${media._id}`,
				'/files/uploads/media/'
			);
			media.img = imgName;
		}
		await media.save(async (err) => {
			if (err) {
				return next(new ErrorResponse('Could not update media', 500));
			}
		});
		res.status(200).json({ status: 'success' });
	} catch (error) {
		next(error);
	}
};

exports.remove = async (req, res, next) => {
	try {
		const id = req.params.id;
		const media = await Media.findById(id);
		const img = media.img;

		try {
			if (
				await ifFileExists(`${__clientdir}${img.replace(`${__uploadRoot}`, '')}`)
			) {
				fs.unlink(`${__clientdir}${img.replace(`${__uploadRoot}`, '')}`);
			}
		} catch (error) {
			return next(new ErrorResponse('internal error', 500));
		}

		await Media.deleteOne({ _id: media._id });
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

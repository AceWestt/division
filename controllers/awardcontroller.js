const Award = require('../models/Award');
const ErrorResponse = require('../utils/errorResponse');
const fs = require('fs/promises');
const crypto = require('crypto');

exports.getAwards = async (req, res, next) => {
	try {
		const awards = await Award.find({});

		res.status(200).json({ data: awards });
	} catch (error) {
		next(error);
	}
};

exports.getAward = async (req, res, next) => {
	try {
		const id = req.params.id;
		const award = await Award.findById(id);
		res.status(200).json({ data: award });
	} catch (error) {
		next(error);
	}
};

exports.addAward = async (req, res, next) => {
	try {
		const body = req.body;
		const files = req.files;
		const award = await new Award({
			name: body.name,
		});
		if (files && files.logo) {
			const logoName = await fileUpload(
				files.logo,
				undefined,
				undefined,
				next,
				`award_logo_${award._id}`,
				'/files/uploads/awards/'
			);
			award.logo = logoName;
		}
		await award.save(async (err) => {
			if (err) {
				return next(new ErrorResponse('Could not create award', 500));
			}
		});
		res.status(200).json({ status: 'success' });
	} catch (error) {
		next(error);
	}
};

exports.updateAward = async (req, res, next) => {
	try {
		const id = req.params.id;
		const body = req.body;
		const files = req.files;

		const award = await Award.findById(id);

		if (files && files.logo) {
			const logoName = await fileUpload(
				files.logo,
				award.logo,
				undefined,
				next,
				`award_logo_${award._id}`,
				'/files/uploads/awards/'
			);
			award.logo = logoName;
		}
		award.name = body.name;

		await award.save(async (err) => {
			if (err) {
				return next(new ErrorResponse('Could not update award', 500));
			}
		});
		res.status(200).json({ status: 'success' });
	} catch (error) {
		next(error);
	}
};

exports.deleteAward = async (req, res, next) => {
	try {
		const id = req.params.id;
		const award = await Award.findById(id);
		const logo = award.logo;
		try {
			if (
				await ifFileExists(`${__clientdir}${logo.replace(`${__uploadRoot}`, '')}`)
			) {
				fs.unlink(`${__clientdir}${logo.replace(`${__uploadRoot}`, '')}`);
			}
		} catch (error) {
			return next(new ErrorResponse('internal error', 500));
		}

		await Award.deleteOne({ _id: award._id });
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

const Team = require('../models/Team');
const ErrorResponse = require('../utils/errorResponse');
const fs = require('fs/promises');
const crypto = require('crypto');

exports.getAll = async (req, res, next) => {
	try {
		const team = await Team.find({});
		res.status(200).json({ data: team });
	} catch (error) {
		next(error);
	}
};

exports.get = async (req, res, next) => {
	try {
		const id = req.params.id;
		const team = await Team.findById(id);
		res.status(200).json({ data: team });
	} catch (error) {
		next(error);
	}
};

exports.add = async (req, res, next) => {
	try {
		const body = req.body;
		const files = req.files;

		const team = await new Team({
			name: JSON.parse(body.name),
			title: JSON.parse(body.title),
		});

		if (files && files.img) {
			const imgName = await fileUpload(
				files.img,
				undefined,
				undefined,
				next,
				`team_img_${team._id}`,
				'/files/uploads/team/'
			);
			team.img = imgName;
		}
		await team.save(async (err) => {
			if (err) {
				return next(new ErrorResponse('Could not create team', 500));
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

		const team = await Team.findById(id);
		team.name = JSON.parse(body.name);
		team.title = JSON.parse(body.title);

		if (files && files.img) {
			const imgName = await fileUpload(
				files.img,
				team.img,
				undefined,
				next,
				`team_img_${team._id}`,
				'/files/uploads/team/'
			);
			team.img = imgName;
		}
		await team.save(async (err) => {
			if (err) {
				return next(new ErrorResponse('Could not update team', 500));
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
		const team = await Team.findById(id);
		const img = team.img;

		try {
			if (
				await ifFileExists(`${__clientdir}${img.replace(`${__uploadRoot}`, '')}`)
			) {
				fs.unlink(`${__clientdir}${img.replace(`${__uploadRoot}`, '')}`);
			}
		} catch (error) {
			return next(new ErrorResponse('internal error', 500));
		}

		await Team.deleteOne({ _id: team._id });
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

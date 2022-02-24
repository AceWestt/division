const Client = require('../models/Client');
const ErrorResponse = require('../utils/errorResponse');
const fs = require('fs/promises');
const crypto = require('crypto');

exports.getClients = async (req, res, next) => {
	try {
		const clients = await Client.find({});
		clients.sort((a, b) =>
			a.row > b.row ? 1 : a.row === b.row ? (a.created > b.created ? 1 : -1) : -1
		);
		const clientsGrouped = clients.reduce((group, client) => {
			const { row } = client;
			group[row] = group[row] ?? [];
			group[row].push(client);
			return group;
		}, []);
		clientsGrouped.shift();
		res.status(200).json({ data: clientsGrouped });
	} catch (error) {
		next(error);
	}
};

exports.getClient = async (req, res, next) => {
	try {
		const id = req.params.id;
		const client = await Client.findById(id);
		res.status(200).json({ data: client });
	} catch (error) {
		next(error);
	}
};

exports.addClient = async (req, res, next) => {
	try {
		const body = req.body;
		const files = req.files;

		const client = await new Client({
			row: body.row,
			hideOnMobile: body.hideOnMobile,
		});

		if (files && files.logo) {
			const logoName = await fileUpload(
				files.logo,
				undefined,
				undefined,
				next,
				`client_logo_${client._id}`,
				'/files/uploads/clients/'
			);
			client.logo = logoName;
		}
		await client.save(async (err) => {
			if (err) {
				return next(new ErrorResponse('Could not create client', 500));
			}
		});
		res.status(200).json({ status: 'success' });
	} catch (error) {
		next(error);
	}
};

exports.updateClient = async (req, res, next) => {
	try {
		const id = req.params.id;
		const body = req.body;
		const files = req.files;

		const client = await Client.findById(id);

		if (files && files.logo) {
			const logoName = await fileUpload(
				files.logo,
				client.logo,
				undefined,
				next,
				`client_logo_${client._id}`,
				'/files/uploads/clients/'
			);
			client.logo = logoName;
		}
		client.row = body.row;
		client.hideOnMobile = body.hideOnMobile;

		await client.save(async (err) => {
			if (err) {
				return next(new ErrorResponse('Could not update client', 500));
			}
		});
		res.status(200).json({ status: 'success' });
	} catch (error) {
		next(error);
	}
};

exports.deleteClient = async (req, res, next) => {
	try {
		const id = req.params.id;
		const client = await Client.findById(id);
		const logo = client.logo;
		try {
			if (
				await ifFileExists(`${__clientdir}${logo.replace(`${__uploadRoot}`, '')}`)
			) {
				fs.unlink(`${__clientdir}${logo.replace(`${__uploadRoot}`, '')}`);
			}
		} catch (error) {
			return next(new ErrorResponse('internal error', 500));
		}

		await Client.deleteOne({ _id: client._id });
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

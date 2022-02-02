const Service = require('../models/Service');
const ErrorResponse = require('../utils/errorResponse');

exports.getAll = async (req, res, next) => {
	try {
		const service = await Service.find({});
		res.status(200).json({ data: service });
	} catch (error) {
		next(error);
	}
};

exports.get = async (req, res, next) => {
	try {
		const id = req.params.id;
		const service = await Service.findById(id);
		res.status(200).json({ data: service });
	} catch (error) {
		next(error);
	}
};

exports.add = async (req, res, next) => {
	try {
		const body = req.body;

		const service = await new Service({
			text: body.text,
			title: body.title,
		});

		await service.save(async (err) => {
			if (err) {
				return next(new ErrorResponse('Could not create service', 500));
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

		const service = await Service.findById(id);
		service.title = body.title;
		service.text = body.text;

		await service.save(async (err) => {
			if (err) {
				return next(new ErrorResponse('Could not update service', 500));
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
		const service = await Service.findById(id);

		await Service.deleteOne({ _id: service._id });
		res.status(200).json({ status: 'success' });
	} catch (error) {
		next(error);
	}
};

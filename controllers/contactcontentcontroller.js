const ContactContent = require('../models/ContactContent');
const ErrorResponse = require('../utils/errorResponse');

exports.get = async (req, res, next) => {
	try {
		let content = await ContactContent.findOne({ id: 777 });
		if (!content) {
			content = await new ContactContent({ id: 777 });
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

		const content = await ContactContent.findById(id);

		content.email = body.email;
		content.phone = body.phone;
		content.facebook = body.facebook;
		content.instagram = body.instagram;
		content.address = body.address;
		content.officeCoords = body.officeCoords;
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

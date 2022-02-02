const Message = require('../models/Message');

exports.getall = async (req, res, next) => {
	try {
		const messages = await Message.find({});
		res.status(200).json({ data: messages });
	} catch (error) {
		next(error);
	}
};

exports.add = async (req, res, next) => {
	try {
		const body = req.body;
		const message = await new Message({
			name: body.name,
			phone: body.phone,
			message: body.message,
			email: body.email,
		});
		await message.save();
		res.status(200).json({ status: 'success' });
	} catch (error) {
		next(error);
	}
};

exports.deleteMessage = async (req, res, next) => {
	try {
		const id = req.params.id;
		await Message.deleteOne({ _id: id });
		res.status(200).json({ status: 'success' });
	} catch (error) {
		next(error);
	}
};

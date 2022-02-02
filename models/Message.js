const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	phone: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	message: {
		type: String,
		required: true,
	},
	created: {
		type: Date,
		default: () => {
			return Date.now();
		},
	},
});

const Message = mongoose.model('Message', MessageSchema);
module.exports = Message;

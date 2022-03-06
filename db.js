const mongoose = require('mongoose');

const username = 'doadmin';
const password = 'v41ua0TckV6I5793';
const dbName = 'admin';
const host = 'private-dbaas-db-48635-4df82001.mongo.ondigitalocean.com';

const mongodbProdUri = `mongodb+srv://${username}:${password}@${host}/${dbName}`;

const options = {
	ssl: true,
	sslValidate: true,
	sslCA: `${__dirname}/ca-certificate.crt`,
};

const connectDB = async () => {
	await mongoose.connect(process.env.MONGO_URI || mongodbProdUri, options);
	console.log('MongoDB connected.');
};

module.exports = connectDB;

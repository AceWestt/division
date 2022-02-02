require('dotenv').config({ path: './config.env' });
const errorHandler = require('./middleware/error');
const express = require('express');
const path = require('path');
const fileUpload = require('express-fileupload');
const connectDB = require('./db');
global.__basedir = __dirname;
global.__clientdir = `${__basedir}/client/public`;
global.__uploadRoot = '/api/public';

connectDB();

const app = express();
app.use(express.static(path.join(`${__dirname}/client`, 'build')));
app.get(/^\/(?!api).*$/, function (req, res) {
	res.sendFile(path.join(`${__dirname}/client`, 'build', 'index.html'));
});

app.use(express.json());
app.use(fileUpload());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/generalcontent', require('./routes/generalcontent'));
app.use('/api/cases', require('./routes/case'));
app.use('/api/clients', require('./routes/client'));
app.use('/api/award', require('./routes/award'));
app.use('/api/aboutcontent', require('./routes/aboutcontent'));
app.use('/api/media', require('./routes/media'));
app.use('/api/team', require('./routes/team'));
app.use('/api/service', require('./routes/service'));
app.use('/api/contactcontent', require('./routes/contactcontent'));
app.use('/api/message', require('./routes/message'));
app.use('/api/public', express.static('client/public'));

app.use(errorHandler);

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => console.log(`server running on port ${PORT}`));

process.on('unhandledRejection', (err, promise) => {
	console.log(`Logged Error: ${err}`);
	server.close(() => process.exit(1));
});

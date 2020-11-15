//
//
//	File:	app.js
//
//	By:		Ivan Laptev <ivlaptev13@ya.ru>
//
//	Created:	2020-06-06 22:25:47
//	Updated:	2020-08-16 22:34:07
//
//

/*
 * Description:
 * Configurate http server.
 */

const express = require('express'),
			app = express(),
			bodyParser = require('body-parser'),
			mongoose = require('mongoose'),
			morgan = require('morgan'),
			consign = require('consign'),
			cors = require('cors'),
			passport = require('passport'),
			passportConfig = require('./passport')(passport),
			jwt = require('jsonwebtoken'),
			config = require('./index.js'),
			database = require('./database.js')(mongoose, config),
			multer = require('multer');

// Connect frontend files
console.log('File storage: /usr/src/app/' + process.env.UPLOAD_DIR);
app.use('/' + process.env.UPLOAD_DIR, express.static('/usr/src/app/' + process.env.UPLOAD_DIR));
app.use(bodyParser.json({limit: '25mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '25mb' }));
app.use(multer({ dest: process.env.UPLOAD_DIR }).single("file"));
app.use(morgan('dev'));
app.use(cors());
app.use(passport.initialize());

app.set('geohelpersecret', config.secret);

// Connecting of different parts in certain order
consign({ cwd: 'services'})
	.include('GeoHelperAPI/app/setup')
	.then('GeoHelperAPI/app/api')
	.then('GeoHelperAPI/app/routes')
	.into(app);

module.exports = app;

//
//
//	File:	index.js
//
//	By:		Ivan Laptev <ivlaptev13@ya.ru>
//
//	Created:	2020-06-06 22:06:43
//	Updated:	2020-08-16 18:24:42
//
//

/*
 * Description:
 * Backend is duilding from its parts in current file.
 *
 * Variables:
 * GeoHelperWS - configuration of WebSocket part of server
 * GeoHelperAPI - express configuration of http server
 * GeoHelperServer - http server
 */

require('module-alias/register');
require('dotenv').config();
const http = require('http'),
			GeoHelperAPI = require('@GeoHelperAPI'),
			GeoHelperServer = http.Server(GeoHelperAPI),
			GeoHelperWS = require('@GeoHelperWS')(GeoHelperServer),
			GeoHelperPORT = process.env.PORT || 3002,
			LOCAL = '0.0.0.0';

GeoHelperServer.listen(GeoHelperPORT, LOCAL, () => {
	console.log(`GeoHelperAPI is running on ${GeoHelperPORT}`)
});

//
//
//	File:	ws.js
//
//	By:		Ivan Laptev <ivlaptev13@ya.ru>
//
//	Created:	2020-06-18 17:48:45
//	Updated:	2020-08-16 22:40:17
//
//

/*
 * Description:
 * WebSocket configuration and initialization.
 */

const WebSocket = require('ws'),
			wsApi = require('../app/ws/api')
			models = require('@GeoHelper/app/setup');

module.exports = (server) => {
	const wss = new WebSocket.Server({ server: server, path: '/api/test' });

	wss.on('connection', (ws) => {
		ws.on('message', (message) => {
			console.log(`LatLng: ${message}`);
			wsApi.getObjects(models.Entity, JSON.parse(message), ws);
		});

		ws.send(JSON.stringify({ success: true, message: 'Connection established'}));
	});
}

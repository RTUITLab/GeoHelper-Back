const WebSocket = require('ws'),
			wsApi = require('../app/ws/api')
			models = require('@GeoHelper/app/setup');

module.exports = (server) => {
	const wss = new WebSocket.Server({ server });

	wss.on('connection', (ws) => {
		ws.on('message', (message) => {
			console.log(`LatLng: ${message}`);
			wsApi.getObjects(models.Entity, JSON.parse(message), ws);
		});

		ws.send(JSON.stringify({ success: true, message: 'Connection established'}));
	});
}
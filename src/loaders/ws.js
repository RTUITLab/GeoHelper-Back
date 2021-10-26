const WebSocket = require('ws');
const http = require('http');

const entityService = require('../services/entityService');

module.exports = async (app) => {
  const server = http.createServer(app);

  app.listen = (...args) => {
    return server.listen(...args);
  }

  const wsServer = new WebSocket.Server({ server, path: '/api/test' });

  wsServer.on('connection', (ws) => {
    ws.on('message', async (message) => {
      console.log(`WS [${new Date()}]: ${message}`);
      const point = JSON.parse(message);

      if (!point.lat || !point.lng) {
        return ws.send(JSON.stringify({ success: false, message: 'Invalid point' }));
      }

      try {
        const data = await entityService.getObjectsForPoint(point);

        ws.send(JSON.stringify(data));
      } catch (e) {
        ws.send(JSON.stringify({ success: false, message: e.message }))
      }
    });
  });

  console.log('+ WebSockets loaded');
}

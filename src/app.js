const express = require('express');
const config = require('./config');
const loaders = require('./loaders');

const startServer = async () => {
  const app = express();

  await loaders(app);

  app.listen(config.port, () => {
    console.log(`Server started at ${config.port}`);
  }).on('error', (err) => {
    console.error(err);
    process.exit(1);
  });
}

startServer();

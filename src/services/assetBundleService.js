const fs = require('fs');
const os = require('os');
const path = require('path');
const config = require('../config');
const mgFile = require('../models/file');
const {setUnityPath, bundle} = require('../../mitm/assetbundlecompiler');

let queue = [];
let taskIsFinished = true;

const createAssetBundle = async () => {
  taskIsFinished = false;
  fileId = queue.shift();

  try {
    const dbFile = await mgFile.findById(fileId);

    // Create assetbundle
    setUnityPath(process.env.UNITY_PATH);

    console.log('\x1b[33m%s\x1b[0m', `${dbFile.name}: Start bundling bundle`);
    console.log([
      await bundle(path.resolve(config.uploadDir, dbFile.name))
        .targeting('All')
        .withLogger(message => console.log('\x1b[36m%s\x1b[0m', message))
        .withUnityLogger(message => console.log(`Unity: ${message}`))
        .to(path.resolve(config.uploadDir, dbFile.name))
    ]);

    dbFile.bundled = true;
    dbFile.inQueue = false;
    await dbFile.save();

    console.log('\x1b[33m%s\x1b[0m', `${dbFile.name}: BUNDLED`);

    Promise.all([
      fs.rm(path.join(os.tmpdir(), dbFile.name), { recursive: true, force: true}, () => {}),
    ]).then(() => {
      console.log(`${dbFile.name} unity projects have been removed.`);
    });
  } catch (e) {
    console.log(e);
    console.log('\x1b[31m%s\x1b[0m', `${dbFile.name}: Failed to bundle`);
  } finally {
    taskIsFinished = true;

    const dbFile = await mgFile.findById(fileId);
    dbFile.inQueue = false;
    dbFile.save();
  }
}

setInterval(() => {
  if (taskIsFinished && queue.length) {
    createAssetBundle();
  }
}, 1000);

module.exports = {
  addToQueue: async (dirName) => {
    queue.push(dirName);

    const dbFile = await mgFile.findById(dirName);
    dbFile.inQueue = true;
    dbFile.save();
  },
  getQueue: () => {}
}
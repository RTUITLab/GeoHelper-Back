const fs = require('fs/promises');
const { mkdirSync } = require('fs');
const path = require('path');
const JSZip = require('jszip');

const config = require('../config');
const {setUnityPath, bundle} = require("../../mitm/assetbundlecompiler");
const mgFile = require('../models/file');
const Entity = require('../models/entity');

const extractFiles = async (zip, dirName) => {
  const paths = [];

  console.log('Unzipped files:');

  try {
    for (const file of Object.keys(zip.files)) {
      console.log('- ' + file);
      if (zip.file(file) && !zip.file(file).dir) {
        paths.push(path.resolve(config.uploadDir, dirName, file));

        const content = await zip.file(file).async('nodebuffer');
        await fs.writeFile(path.resolve(config.uploadDir, dirName, file), content);
      } else {
        mkdirSync(path.resolve(config.uploadDir, dirName, file));
      }
    }
  } catch (e) {
    await Promise.reject(e);
  }
  console.log(`Extracted ${paths.length} files (${dirName})`);

  return paths;
}

module.exports = {
  processFile: function(filename, user) {
    return new Promise(async (resolve, reject) => {
      const ext = filename.split('.').pop();
      const dirName = filename.split('.')[0];

      try {
        await fs.stat(path.resolve(config.uploadDir, filename));

      } catch (e) {
        console.error(e);
        return reject({ message: `Can't save file` });
      }
      
      const dbFile = new mgFile({
        name: dirName,
        type: ext,
        creator: user._id,
        unzipped: false,
        bundled: false,
        inQueue: false
      });
      await dbFile.save();
        console.log('FILE SAVED');

      if (ext === 'zip') {
        try {
          // Read file and unzip it
          const file = await fs.readFile(path.resolve(config.uploadDir, filename));
          const zip = await JSZip.loadAsync(file);

          await fs.mkdir(path.resolve(config.uploadDir, dirName));
          const paths = await extractFiles(zip, dirName);
          if (paths.find((item) => item.indexOf('scene.gltf') !== -1)) {
            console.log(`Scene file found (${dirName})`);
          } else {
            throw new Error('Uncorrect zip');
          }

          dbFile.unzipped = true;
          await dbFile.save();
          console.log('FILE UNZIPPED');

          // TODO: Move to another method
          /*
          // Create assetbundle
          setUnityPath(process.env.UNITY_PATH);
          console.log(paths);

          console.log([
            await bundle(path.resolve(config.uploadDir, dirName))
              .targeting('All')
              .withLogger(message => console.log(message))
              .withUnityLogger(message => console.log(`Unity: ${message}`))
              .to(path.resolve(config.uploadDir, dirName))
          ]);

          dbFile.bundled = true;
          await dbFile.save();
          console.log('FILE BUNDLED');

          Promise.all([
            // fs.rm(path.join(os.tmpdir(), dirName + '.ios'), { recursive: true, force: true}),
          ]).then(() => {
            console.log(`${dirName} unity projects have been removed.`);
          });
        */
        } catch (e) {
          console.error(e);
          return reject({ message: `Can't unzip file` });
        }
      }

      resolve();

      // Delete file if not used in any entity after timeout
      setTimeout(async () => {
        let entity = (await Entity.find()).find((E) => JSON.stringify(E).indexOf(dirName) !== -1);

        if (!entity) {
         this.removeFile(filename);
        }
      }, 10000);
    });
  },

  removeFile: (filename) => {
    return new Promise(async (resolve, reject) => {
      const ext = filename.split('.').pop();
      const dirName = filename.split('.')[0];

      try {
        await fs.stat(path.resolve(config.uploadDir, filename));

        try {
          await fs.rm(path.resolve(config.uploadDir, filename), { recursive: true, force: true});
        } catch (e) {
          console.error(e);
          return reject({ message: `Can't delete file` });
        }
      } catch (e) {
        console.error(e);
      }

      if (ext === 'zip') {
        try {
          await fs.stat(path.resolve(config.uploadDir, dirName));
          const fileData = await mgFile.findOne({name: dirName});

          try {
            if (fileData.unzipped) {
              await fs.rm(path.resolve(config.uploadDir, dirName), { recursive: true, force: true});
            }
          } catch (e) {
            console.error(e);
            return reject({message: `Can't delete unzipped files`});
          }

          try {
            if (fileData.bundled) {
              await fs.rm(path.resolve(config.uploadDir, dirName + '.ios'), { recursive: true, force: true});
              await fs.rm(path.resolve(config.uploadDir, dirName + '.android'), { recursive: true, force: true});
            }
          } catch (e) {
            console.error(e);
            return reject({message: `Can't delete unzipped files`});
          }
        } catch (e) {
          console.error(e);
        }
      }

      resolve();
    });
  },

  getAllFiles: () => {
    return new Promise(async (resolve, reject) => {
      mgFile.find({}, (error, result) => {
        if (error) {
          console.log(error);
          reject({ message: `Can't get data from DB`});
        } else {
          resolve(result || []);
        }
      });
    });
  },

  deleteAllFilesData: () => {
    return new Promise(async (resolve, reject) => {
      try {
        const count = await mgFile.deleteMany({});
        resolve(count);
      } catch (e) {
        console.log(e);
        reject({ message: `Can't delete data from DB`});
      }
    });
  },
}

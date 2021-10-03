const fs = require('fs/promises');
const { mkdirSync } = require('fs');
const path = require('path');
const JSZip = require('jszip');

const config = require('../config');

module.exports = {
  processFile: (filename) => {
    return new Promise(async (resolve, reject) => {
      const ext = filename.split('.').pop();
      const dirName = filename.split('.')[0];

      try {
        await fs.stat(path.resolve(config.uploadDir, filename));
      } catch (e) {
        console.error(e);
        return reject({ message: `Can't save file` });
      }

      if (ext === 'zip') {
        try {
          // Read file and unzip it
          const file = await fs.readFile(path.resolve(config.uploadDir, filename));
          const zip = await JSZip.loadAsync(file);

          await fs.mkdir(path.resolve(config.uploadDir, dirName));
          Object.keys(zip.files).forEach((unzippedFile) => {
            if (zip.file(unzippedFile) && !zip.file(unzippedFile).dir) {
              zip.file(unzippedFile).async('nodebuffer').then((content) => {
                fs.writeFile(path.resolve(config.uploadDir, dirName, unzippedFile), content);
              });
            } else {
              mkdirSync(path.resolve(config.uploadDir, dirName, unzippedFile));
            }
          });
        } catch (e) {
          console.error(e);
          return reject({ message: `Can't unzip file` });
        }
      }

      resolve();
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

          try {
            await fs.rm(path.resolve(config.uploadDir, dirName), { recursive: true, force: true});
          } catch (e) {
            console.error(e);
            return reject({message: `Can't unzipped files`});
          }
        } catch (e) {
          console.error(e);
        }
      }

      resolve();
    });
  }
}
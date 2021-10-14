const fs = require('fs/promises');
const { mkdirSync, writeFileSync } = require('fs');
const path = require('path');
const JSZip = require('jszip');

const config = require('../config');
const {setUnityPath, bundle} = require("../../mitm/assetbundlecompiler");
const os = require("os");

const extractFiles = async (zip, dirName) => {
  const paths = [];

  console.log('1');

  try {
    for (const file of Object.keys(zip.files)) {
      console.log(file);
      if (zip.file(file) && !zip.file(file).dir) {
        let newName = '';
        if (file.split('.').pop() === 'gltf') {
          newName = file.replace(/\.gltf$/, '.json');
        } else if (file.split('.').pop() === 'bin') {
          newName = file.replace(/\.bin$/, '.xml');
        }
        paths.push(path.resolve(config.uploadDir, dirName, newName || file));

        const content = await zip.file(file).async('nodebuffer');
        await fs.writeFile(path.resolve(config.uploadDir, dirName, newName || file), content);
      } else {
        mkdirSync(path.resolve(config.uploadDir, dirName, file));
      }
    }
  } catch (e) {
    await Promise.reject(e);
  }
  console.log('finished');

  return paths;
}

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
          const paths = await extractFiles(zip, dirName);
          // Object.keys(zip.files).forEach((unzippedFile) => {
          //   if (zip.file(unzippedFile) && !zip.file(unzippedFile).dir) {
          //     paths.push(path.resolve(config.uploadDir, dirName, unzippedFile));
          //
          //     zip.file(unzippedFile).async('nodebuffer').then((content) => {
          //       fs.writeFile(path.resolve(config.uploadDir, dirName, unzippedFile), content);
          //     });
          //   } else {
          //     mkdirSync(path.resolve(config.uploadDir, dirName, unzippedFile));
          //   }
          // });

          // Create assetbundle
          setUnityPath(process.env.UNITY_PATH);
          console.log(paths);
          console.log(path.resolve(config.uploadDir, dirName) + '.android.assetbundle');

          console.log([
            await bundle(...paths)
              .targeting('Android')
              .withLogger(message => console.log(message))
              .withUnityLogger(message => console.log('UNITY: ' + message))
              .to(path.resolve(config.uploadDir, dirName) + '.android.assetbundle'),
            await bundle(...paths)
              .targeting('iOS')
              .withLogger(message => console.log(message))
              .withUnityLogger(message => console.log('UNITY: ' + message))
              .to(path.resolve(config.uploadDir, dirName) + '.ios.assetbundle')
          ]);

          Promise.all([
            fs.rm(path.join(os.tmpdir(), dirName + '.ios'), { recursive: true, force: true}),
            fs.rm(path.join(os.tmpdir(), dirName + '.android'), { recursive: true, force: true}),
          ]).then(() => {
            console.log(`${dirName} unity projects have been removed.`);
          });

          // const manifestAndroid = await bundle(...paths)
          //   .targeting('Android')
          //   .withLogger(message => console.log(message))
          //   .withUnityLogger(message => console.log('UNITY: ' + message))
          //   .to(path.resolve(config.uploadDir, dirName) + '.android.assetbundle');
          // const manifestIos = await bundle(...paths)
          //   .targeting('iOS')
          //   .withLogger(message => console.log(message))
          //   .withUnityLogger(message => console.log('UNITY: ' + message))
          //   .to(path.resolve(config.uploadDir, dirName) + '.ios.assetbundle');
          // console.log(manifestAndroid, manifestIos);
          // console.log(manifestIos);
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
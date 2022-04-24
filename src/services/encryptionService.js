const crypto = require('crypto');

const iv = require('../config').secret;

const algorithm = 'aes-256-cbc';
const key = iv + iv;


module.exports = {
  encrypt: (data) => {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('hex');
  },

  decrypt: (data) => {
    let encryptedText = Buffer.from(data, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }
}

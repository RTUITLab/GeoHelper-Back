const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('@/config');
const User = require('@/models/user');

const comparePasswords = (password, encryptedPassword) => {
 return new Promise((resolve, reject) => {
    bcrypt.compare(password, encryptedPassword).then((result) => {
      if (result) {
        resolve();
      } else {
        reject(result);
      }
    });
 });
}

module.exports = {
  /**
   *
   * @param { {username: string, password: string} } user
   * @returns {Promise<unknown>}
   */
  login: (user) => {
    return new Promise(async (resolve, reject) => {
      const foundUser = await User.findOne({ username: user.username });

      if (!foundUser) {
        reject({ message: 'User not found' });
        return;
      }

      comparePasswords(user.password, foundUser.password)
        .then(() => {
          const accessToken = jwt.sign({ _id: foundUser._id, user: foundUser.username, role: foundUser.role }, config.secret);
          resolve({ token: accessToken, foundUser });
        })
        .catch(() => {
          reject({ message: 'Wrong password' });
        });
    });
  },

  setup: () => {
    return new Promise(async (resolve, reject) => {
      let admin = await User.findOne({ username: config.adminUser.username });
      if (admin) {
        admin.username = config.adminUser.username;
        admin.password = config.adminUser.password;
        admin.role = 'admin';
        await admin.save();

        resolve();
      } else {
        admin = new User({
          role: 'admin',
          ...config.adminUser
        });

        if (await admin.save()) {
          console.log('User created');
          resolve();
        } else {
          reject({ message: `Can't create user` });
        }
      }
    });
  }
}
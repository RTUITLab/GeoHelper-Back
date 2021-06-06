const User = require('../models/user');
const config = require('../config');
const jwt = require('jsonwebtoken');

module.exports = {
  login: (user) => {
    return new Promise(async (resolve, reject) => {
      const found = await User.findOne({ username: user.username });
    
      if (!found) reject({message: 'Пользователь не найден'})
      else {
        found.comparePassword(user.password, (error, matches) => {
          if (matches && !error) {
            const token = jwt.sign({ user }, config.secret);
            resolve({ success: true, message: 'Token granted', token, found});
          } else {
            reject({ message: 'Неверный пароль' });
          }
        });
      }
    });
  },

  setup: async () => {
    const admin = new User({
      username: config.db.user.username,
      password: config.db.user.password
    });
    const success = await admin.save();
    if (!success) throw new Error('Bad request');
    else return { success: true };
  }
}
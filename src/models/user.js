const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  }
});

// Creating password hash before saving password
Schema.pre('save', function (next) {
  const user = this;
  bcrypt.genSalt(10, (error, salt) => {
    if (error) return next(error);
    bcrypt.hash(user.password, salt, (error, hash) => {
      if (error) return next(error);
      user.password = hash;
      next();
    });
  });
});

mongoose.model('User', Schema);

module.exports = mongoose.model('User');

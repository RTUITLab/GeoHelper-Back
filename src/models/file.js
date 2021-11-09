const mongoose = require('mongoose');

const Schema = mongoose.Schema({
  name: {
    type: String,
    require: true
  },
  creator: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  },
  unzipped: {
    type: Boolean,
    require: true
  },
  bundled: {
    type: Boolean,
    require: true
  },
  inQueue: {
    type: Number,
    require: false
  },
});

mongoose.model('File', Schema);

module.exports = mongoose.model('File');

const mongoose = require('mongoose');

const Schema = mongoose.Schema({
  name: {
    type: String,
    require: true
  },
  unzipped: {
    type: Boolean,
    require: true
  },
  bundled: {
    type: Boolean,
    require: true
  },
});

mongoose.model('File', Schema);

module.exports = mongoose.model('File');

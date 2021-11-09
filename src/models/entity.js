const mongoose = require('mongoose');

const Schema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['text', 'object', 'audio', 'excursion']
  },
  creator: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  },
  description: String,
  position: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  fileName: {
    type: String
  },
  url: {
    type: String
  },
  files: [
    {
      type: {
        type: String
      },
      fileName: {
        type: String
      },
      fileId: {
        type: mongoose.Types.ObjectId,
        ref: 'File'
      },
      url: {
        type: String
      },
      assetBundle: {
        type: String
      }
    }
  ],
  areas: [
    {
      points: [{
        lat: Number,
        lng: Number
      }]
    }
  ],
  additionalLines: [
    {
      start: {
        lat: Number,
        lng: Number
      },
      end: {
        lat: Number,
        lng: Number
      }
    }
  ]
});

mongoose.model('Entity', Schema);

module.exports = mongoose.model('Entity');

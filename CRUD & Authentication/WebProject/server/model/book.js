var mongoose = require('mongoose');

var bookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    author: {
      type: String,
      required: true,
      trim: true
    },
    published: {
      type: Number
    },
    description: {
      type: String,
      default: ''
    },
    price: {
      type: Number,
      min: 0
    }
  },
  {
    collection: 'books'
  }
);

module.exports = mongoose.model('Book', bookSchema);
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
    trim: true
  },
  conteudo: {
    type: String,
    required: true
  },
  autor: {
    type: String,
    required: true,
    trim: true
  },
  criadoEm: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Post', postSchema);

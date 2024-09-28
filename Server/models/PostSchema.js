const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  email: String,
  title: String,
  content: String,
  image: {
    path: { type: String, required: true },
    filename: { type: String, required: true }
  }
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;

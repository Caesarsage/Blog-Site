const mongoose = require('mongoose');
const { Schema } = mongoose

const BlogSchema = new Schema({
  title: String,
  image: String,
  content: String,
},
{
  timestamps: true
});

const Blog = mongoose.model('Blog', BlogSchema);
module.exports = Blog;
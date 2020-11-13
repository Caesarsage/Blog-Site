const mongoose = require('mongoose');
const { Schema } = mongoose

const BlogSchema = new Schema({
  title: String,
  image: String,
  content: String,
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: 'Review'
  }]
},{
  timestamps: true
});

const Blog = mongoose.model('Blog', BlogSchema);
module.exports = Blog;
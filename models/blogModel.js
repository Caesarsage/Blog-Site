const mongoose = require('mongoose');
const { Schema } = mongoose

const BlogSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  capture: {
    type: String
  },
  image: {
      path: String,
      filename: String
    }
  ,
  content: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: 'Review'
  }]
},{
  timestamps: true
});

const Blog = mongoose.model('Blog', BlogSchema);
module.exports = Blog;
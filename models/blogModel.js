const mongoose = require('mongoose');
const { Schema } = mongoose

const BlogSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  image: String,
  content: {
    type: String,
    required: true
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
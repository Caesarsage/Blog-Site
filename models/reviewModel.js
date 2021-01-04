const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReviewSchema = new Schema({
  name: {
    type: String
  },
  body:{
    type: String,
    required: true
  },
  rating:{
    type: Number,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  comments:[{
    type: Schema.Types.ObjectId,
    ref: 'Comments'
  }]
});

const Review = mongoose.model('Review', ReviewSchema);
module.exports = Review;
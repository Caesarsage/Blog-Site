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
  comments:{
    type: Schema.Types.ObjectId,
    ref: 'Comments'
  }
});

const Review = mongoose.model('Review', ReviewSchema);
module.exports = Review;
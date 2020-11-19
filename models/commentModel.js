const mongoose = require('mongoose');
const { Schema } = mongoose;

const CommentSchema = new Schema({
  body:{
    type: String
  }
});

const Comments = mongoose.model('Comments', CommentSchema);
module.exports = Comments;
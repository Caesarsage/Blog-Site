const mongoose = require('mongoose');
const { Schema } = mongoose;
const passportLocalMongoose = require('passport-local-mongoose')

const UserSchema = new Schema({
  FirstName: {
    type: String,
    required: true
  },
  LastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  resetPasswordToken: String,
  resetPasswordExpires: String,
  avatar: String,
  Headline: String,
  description: String,
  website: String,
  twitter: String,
  linkedIn: String,
  facebook: String
});
// this is going to add on a unique username to our model and some other useful methods
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
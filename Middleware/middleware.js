const Blog = require("../models/blogModel");
const Review = require("../models/reviewModel");
const Comment = require("../models/commentModel");
const User = require("../models/userModel");
const { blogSchema, reviewSchema } = require("../joiSchema");

module.exports.isLoggedin = (req, res, next) =>{
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'you must be signed in');
    return res.redirect('/user/login')
  }
  next()
}

module.exports.validateBlog = (req,res,next)=>{
  const { error } =  blogSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400)
  }else{
    next();
  }
}

module.exports.validateReview = (req,res,next)=>{
  const {error}= reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400)
  }else{
    next();
  }
}

module.exports.isAuthor = async(req,res, next)=>{
  const { id } = req.params;
  const blogs = await Blog.findById(id);
  if (!blogs.author.equals(req.user._id)) {
    req.flash('error', 'You do not have permission to do that!');
    return res.redirect(`/blogs/${id}`);
  }
  next()
}

module.exports.isUser = async(req,res, next)=>{
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user._id.equals(req.user._id)) {
    req.flash('error', 'You do not have permission to do that!!!!');
    return res.redirect(`/user/profile/${id}`);
  }
  next()
}

module.exports.isReviewAuthor = async(req,res, next)=>{
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
  req.flash('error', 'You do not have permission to do that!');
    return res.redirect(`/campgrounds/${id}`);
  }
  next()
}
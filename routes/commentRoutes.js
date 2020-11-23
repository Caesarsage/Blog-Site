const express = require('express');
const Review = require('../models/reviewModel');
const Blog = require('../models/blogModel');
const Comment = require('../models/commentModel');

const catchAsync = require('../utils/catchAsync');

const commentRouter = express.Router({mergeParams: true});

commentRouter.route('/')
.get( catchAsync( async(req, res)=>{
  const {id, reviewId} = req.params;
  const blogs = await Blog.findById(id);
  const reviews = await Review.findById(reviewId).populate('comments');
  console.log(reviews);
  res.render('blog/comments',{
    reviews,
    blogs
  })
}))
.post( catchAsync(async(req,res)=>{
  const { reviewId, id } = req.params;
  const blogs = await Blog.findById(id); 
  const review = await Review.findById(reviewId);
  const comment = new Comment(req.body.comment);
  review.comments.push(comment);
  await review.save();
  await comment.save();
  res.redirect(`/blogs/${blogs._id}/reviews/${review._id}/comments`);
}));

module.exports =  commentRouter
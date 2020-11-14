const express = require('express');
const Review = require('../models/reviewModel');
const Blog = require('../models/blogModel');

const reviewRouter = express.Router({mergeParams: true});

reviewRouter.route('/')
.post(async(req,res)=>{
  const { id } = req.params;
  const blogs =await Blog.findById(id)
  const review = new Review(req.body.review);
  blogs.reviews.push(review);
  await review.save();
  await blogs.save();
  res.redirect(`/blogs/${blogs._id}`);
})

module.exports = reviewRouter
const express = require('express');
const { isLoggedin, isAuthor } = require('../Middleware/middleware');
const Blog = require('../models/blogModel');
const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');

const router = express.Router();

router.route('/')
.get(catchAsync(async (req, res) =>{
  const { page = 1, limit = 10} = req.query;
  const blogs = await Blog.find({}).limit(limit * 1).skip((page-1)*limit).sort({$natural: -1}).populate('author');
  console.log(req.user);
  res.render('index', {
    blogs,
    page
  })
}))
.post( isLoggedin, catchAsync(async (req, res)=>{
  const blogs = new Blog( req.body.blog );
  blogs.author = req.user._id;
  await blogs.save();
  req.flash('success', "Successfully made a new blog");
  res.redirect(`/blogs`)
}));

router.route('/new')
.get( isLoggedin, (req, res)=>{
  res.render('blog/new')
});

router.route('/:id')
.get( catchAsync(async(req,res)=>{
  const { id } = req.params;
  const blogs = await Blog.findById(id).populate({
    path:'reviews',
    populate: {
      path: 'comments'
    }
  }).populate('author');
  console.log(blogs);  
  if (!blogs) {
    return res.redirect("/fallback");
  }
  res.render('blog/show', {
    blogs
  })
}))
.put(isLoggedin, isAuthor, catchAsync(async (req, res)=>{
  const { id }= req.params;
  const blogs = await Blog.findByIdAndUpdate(id , req.body.blogs , {new: true})
  await blogs.save();
  res.redirect(`/blogs/${blogs._id}`)
}))
.delete(isLoggedin, isAuthor, catchAsync(async(req,res)=>{
  const {id} = req.params;
  const blogs = await Blog.findByIdAndDelete(id);
  res.redirect('/fallback')
}));

router.route('/:id/edit')
.get(isLoggedin, isAuthor, catchAsync(async (req, res)=>{
  const { id }= req.params;
  const blogs = await Blog.findById(id);
  if (!blogs) {
    return res.redirect("/blogs");
  }
  res.render('blog/edit', {
    blogs
  })
}));

module.exports = router;
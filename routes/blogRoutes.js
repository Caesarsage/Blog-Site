const express = require('express');
const Blog = require('../models/blogModel');
const catchAsync = require('../utils/catchAsync');

const router = express.Router();

router.route('/')
.get(catchAsync(async (req, res) =>{
  const { page = 1, limit = 10} = req.query;
  const blogs = await Blog.find({}).limit(limit * 1).skip((page-1)*limit);
  res.render('index', {
    blogs,
    page
  })
}))
.post(catchAsync(async (req, res)=>{
  const blogs = new Blog( req.body.blog );
  await blogs.save();
  res.redirect(`/blogs`)
}));

router.route('/new')
.get((req, res)=>{
  res.render('blog/new')
});

router.route('/:id')
.get( catchAsync(async(req,res)=>{
  const { id } = req.params;
  const blogs = await Blog.findById(id).populate('reviews');
  console.log(blogs);
  if (!blogs) {
    return res.redirect("/fallback");
  }
  res.render('blog/show', {
    blogs
  })
}))
.put(catchAsync(async (req, res)=>{
  const { id }= req.params;
  const blogs = await Blog.findByIdAndUpdate(id , req.body.blogs , {new: true})
  await blogs.save();
  console.log(blogs);
  res.redirect(`/blogs/${blogs._id}`)
}))
.delete( catchAsync(async(req,res)=>{
  const {id} = req.params;
  const blogs = await Blog.findByIdAndDelete(id);
  res.redirect('/fallback')
}));

router.route('/:id/edit')
.get( catchAsync(async (req, res)=>{
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
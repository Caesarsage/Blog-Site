const express = require('express');
const Blog = require('../models/blogModel');

const router = express.Router();

router.route('/')
.get(async (req, res) =>{
  const blogs = await Blog.find({});
  res.render('index', {
    blogs
  })
})
.post( async (req, res)=>{
  const blogs = new Blog( req.body.blog );
  await blogs.save();
  res.redirect(`/blogs`)
});

router.route('/new')
.get((req, res)=>{
  res.render('blog/new')
});

router.route('/:id')
.get( async(req,res)=>{
  const { id } = req.params;
  const blogs = await Blog.findById(id);
  console.log(blogs);
  if (!blogs) {
    return res.redirect("/blogs");
  }
  res.render('blog/show', {
    blogs
  })
})
.put(async (req, res)=>{
  const { id }= req.params;
  const blogs = await Blog.findByIdAndUpdate(id , req.body.blogs , {new: true})
  await blogs.save();
  console.log(blogs);
  res.redirect(`/blogs/${blogs._id}`)
});

router.route('/:id/edit')
.get(async (req, res)=>{
  const { id }= req.params;
  const blogs = await Blog.findById(id);
  if (!blogs) {
    return res.redirect("/blogs");
  }
  res.render('blog/edit', {
    blogs
  })
})





module.exports = router;
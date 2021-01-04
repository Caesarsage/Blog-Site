const express = require('express');
const { isLoggedin, isAuthor, validateBlog } = require('../Middleware/middleware');
const Blog = require('../models/blogModel');
const catchAsync = require('../utils/catchAsync');
const request = require('request');
// image handling with multer
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const router = express.Router();

router.route('/')
.get(catchAsync(async (req, res) =>{
  const { page = 1, limit = 10} = req.query;
  const blogs = await Blog.find({}).limit(limit * 1).skip((page-1)*limit).sort({$natural: -1}).populate('author');
  console.log(req.user);
  res.render('index', {
    blogs,
    page,
    limit
  })
})) //POST NEW BLOG
.post( isLoggedin, upload.single('image'), validateBlog, catchAsync(async (req, res)=>{
  const blogs = new Blog( req.body.blog );
  blogs.image = req.file;
  blogs.author = req.user._id;
  await blogs.save();
  req.flash('success', "Successfully made a new blog");
  res.redirect(`/blogs`)
}));

// create new blog views
router.route('/new')
.get( isLoggedin, (req, res)=>{
  res.render('blog/new')
});

router.route('/about')
.get((req, res)=>{
  const user = User
  res.render('blog/about')
})
// Subscribe to Newsletter route and setup
router.route('/subscribe')
.post((req, res)=>{
  const { email, firstName, lastName } = req.body;

  if (!email && firstName && lastName) {
    req.flash('error', 'please input your email before submitting');
    res.redirect('/blog')
  }

  // Construct request data
  const data = {
    members: [
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  }

  const postData = JSON.stringify(data);

  const options = {
    url:   "https://us7.api.mailchimp.com/3.0/lists/8e4e136a09",
    method: 'POST',
    headers: {
      Authorization:`auth ${process.env.MAILCHIMP_API_KEY}`
    },
    body: postData 
  }

  request(options, (err, response, body)=>{
    if (err) {
      req.flash('error', `ouch something went wrong!!!`);
      res.redirect('/blogs')
    }else{
      if (response.statusCode === 200) {
        const newBody = JSON.parse(body);
        if (newBody.new_members.length) {
          console.log('SUCCESS', newBody);
          console.log(newBody.errors);
          req.flash('success', 'Successfully subscribed to our newsletter')
          res.redirect('/blogs');
        }else{
          req.flash('error', 'Email Already existed, please provide another!!!')
          res.redirect('/blogs');
        }
      }else{
        req.flash('error', `ouch!!!`)
        res.redirect('/blogs')
      }
    }
  })
})

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
    req.flash('error', 'Cannot find that campground')
    return res.redirect("/blogs");
  }
  res.render('blog/show', {
    blogs
  })
}))
.put( isAuthor, upload.single('image'), catchAsync(async (req, res)=>{
  const { id }= req.params;
  const blogs = await Blog.findByIdAndUpdate(id , req.body.blogs);
  blogs.image = req.file;
  await blogs.save();
  req.flash('success', 'Successfully made a updated campground!');
  res.redirect(`/blogs/${blogs._id}`)
}))
.delete(isLoggedin, isAuthor, catchAsync(async(req,res)=>{
  const { id } = req.params;
  await Blog.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted a campground!');
  res.redirect('/blogs')
}));

router.route('/:id/edit')
.get( isLoggedin, isAuthor, catchAsync(async (req, res)=>{
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
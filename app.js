if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate');
const chalk = require('chalk');
const morgan = require('morgan');
const Blog = require('./models/blogModel');

const app = express();

// Creating DB
mongoose.connect('mongodb://localhost:27017/blog-camp',{useCreateIndex:true,useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
  console.log(chalk.yellow('CONNECTED CORRECTLY'));
})
.catch(err => {
  console.log('error occur');
  console.log(err);
});

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

app.get('/', (req, res)=>{
  res.render('index')
});


app.get('/blogs',async (req, res)=>{
  const blogs = await Blog.find({});
  res.render('blog/show', {
    blogs
  })
})

app.get('/blogs/new', (req, res)=>{
  res.render('blog/new')
})
app.post('/blogs', async (req, res)=>{
  const blogs = await new Blog(req.body.blog);
  // blogs.save()
  console.log(blogs);
  res.send('successful')
})
// Connecting
const port = process.env.PORT || 3000

app.listen(port, ()=>{
  console.log(`listing at port ${chalk.green(port)}`)
});
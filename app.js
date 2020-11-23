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
const flash = require('connect-flash')
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const User = require('./models/userModel')

const blogRouter = require('./routes/blogRoutes');
const reviewRouter = require('./routes/reviewRouters');
const userRouter = require('./routes/userRoutes');
const commentRouter = require('./routes/commentRoutes');

const ExpressError = require('./utils/expressError');
const catchAsync = require('./utils/catchAsync');

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

// FLASH CONFIG
app.use(flash());

// Auth
// express session
const sessionConfig = {
  secret: 'abcdefghijklmnopqrstuvwxyz',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}
app.use(session(sessionConfig));
// passport config
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// locals: available to the template 
// must be after express session  and passport config
app.use((req, res, next )=>{
  console.log(req.session);
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currentUser = req.user;
  next();
});

// routes
app.use('/blogs', blogRouter);
app.use('/blogs/:id/reviews', reviewRouter)
app.use('/user', userRouter);
app.use('/blogs/:id/reviews/:reviewId/comments', commentRouter)

app.get('/', catchAsync(async (req, res)=>{
  req.user;
  res.redirect(`/blogs`);
}));

app.get('/fallback', catchAsync(async (req, res)=>{
  const blogs = await Blog.find({});
  console.log(blogs);
  res.render('fallback', {
    blogs
  })
}));

app.all('*', (req, res, next)=>{ 
  next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next)=>{
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong!!!, it's not your fault but ours" 
  res.status(statusCode);
  res.render('404', {
    err
  })
});


// Connecting
const port = process.env.PORT || 3000

app.listen(port, ()=>{
  console.log(`listing at port ${chalk.green(port)}`)
});
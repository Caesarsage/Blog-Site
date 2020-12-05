const express = require('express');
const passport = require('passport');

const async = require('async');
const nodeMailer = require('nodemailer');
const crypto = require('crypto');

const userRouter = express.Router();

const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const Blog = require('../models/blogModel');
const { isLoggedin } = require('../Middleware/middleware');

userRouter.route('/register')
.get((req, res)=>{
  res.render('user/register');
})
.post(catchAsync(async(req, res)=>{
  try {
    const {password, username, FirstName, LastName, email, avatar, Headline, description,
            website, twitter,linkedIn, facebook } = req.body;
    const user = new User({username,FirstName, LastName, email, avatar, Headline, 
      website, twitter,linkedIn, facebook, description});
      user.avatar =  "https://images.unsplash.com/photo-1502489743911-88606f93ba47?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjF9";
      user.Headline = '';
      user.description = '';
      user.website = '';
      user.twitter = '';
      user.linkedIn = '';
      user.facebook = '';
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err =>{
      if (err) return next(err);
      req.flash('success', 'Welcome Back!!!');
      res.redirect(`/user/profile/${user._id}`)
    })
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('/register')
  }
}));

userRouter.route('/profile/:id')
.get(isLoggedin ,catchAsync(async(req, res)=>{
  const { id } = req.params;
  const user = await User.findById(id)
  const blogs = await Blog.find({'author': user._id });
  console.log(user);
  console.log(blogs);
  res.render('user/dashboard', {
    user,
    blogs
  });
  if (!user) {
    req.flash('error', 'Something went wrong')
    res.redirect('/')
  }
})).put(catchAsync(async(req, res)=>{
  const { id } = req.params;
  const user = await User.findByIdAndUpdate(id, req.body);
  await user.save();
  req.flash('success', 'Updated Profile');
  res.redirect(`/user/profile/${user._id}`)
}));
;

userRouter.route('/profile/:id/edit')
.get(isLoggedin, catchAsync(async(req, res)=>{
  const { id } = req.params;
  const user = await User.findById(id)
  res.render('user/edit', {
   user 
  });
  if (!user) {
    req.flash('error', 'Something went wrong')
    res.redirect('/')
  }
}));

userRouter.route('/login')
.get((req,res)=>{
  res.render('user/login')
})
.post( passport.authenticate('local',{failureFlash: true, failureRedirect: '/user/login'}), (req, res)=>{
  req.flash('success', 'Welcome Back!!!');
  const redirectUrl = req.session.returnTo || '/blogs';
  res.redirect(redirectUrl);
});



// userRouter.route('/forget')
// .get((req, res)=>{
//   res.render('user/forget');
// })
// .post( (req, res, next)=>{
//   async.waterfall([
//     (done)=>{
//       crypto.randomBytes(20, (err, buf)=>{
//         let token = buf.toString('hex');
//         done(err, token);
//       });
//     },
//     (token, done)=>{
//       User.findOne({email: req.body.email}, (err, user)=>{
//         if (!user) {
//           req.flash('error', 'No account with that email address exists.');
//           return res.redirect('/forget');
//         }
//         user.resetPasswordToken = token;
//         user.resetPasswordExpires = Date.now() * 3600000; //1 hour

//         user.save((err)=>{
//           done(err, token , user);
//         });
//       });
//     },
//     (token, user, done)=>{
//       let smtpTransport = nodeMailer.createTransport({
//         service: 'Gmail',
//         auth: {
//           user: 'destinyerhabor6@gmail.com',
//           pass: process.env.GMAILPW
//         }
//       });
//        const mailOptions = {
//          to: user.email,
//          from: 'destinyerhabor6@gmail.com',
//          subject: 'Reset Password',
//          text: `
//             You are receiving this because you have requested to rest your password,
//             Please click on the following link, or paste to your browser to complete the process
//             http://${req.headers.host}/reset/${token}  
//             \n\n Kindly ignore if you did not initiate this process
//             `
//        };
//        smtpTransport.sendMail(mailOptions, (err)=>{
//          console.log('mail sent');
//          req.flash('success', `An e-mail has been sent to ${user.email} with further instructions`)
//          done(err, 'done');
//        });
//     }
//   ], (err)=>{
//     if (err) return next(err); 
//     res.redirect('/forget');
//   })
// });

userRouter.route('/logout')
.get((req, res)=>{
  req.logout();
  req.flash('success', 'You Logged out')
  res.redirect('/blogs')
})
module.exports = userRouter;
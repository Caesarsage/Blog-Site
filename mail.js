const nodemailer = require('nodemailer');
const mailGun = require('nodemailer-mailgun-transport');


const auth = {
  auth: {
    api_key: process.env.MAILGUN_KEY,
    domain: process.env.MAILGUN_DOMAIN
  }
}

const transport =nodemailer.createTransport(mailGun(auth));

const mailOptions = {
  from: 'caesar.de.hero@gmail.com',
  to: 'destinyerhabor6@gmail.com',
  subject: 'Subscribing To receive blog updates',
  text: 'Please add me to your email subscribe list'
}

transport.sendMail(mailOptions, function (err, data) {
  if (err) {
    
  } else {
    
  }
})
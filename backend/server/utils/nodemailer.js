const nodemailer = require("nodemailer");
require("dotenv").config();

// let secrets;
// if (process.env.NODE_ENV == "production") {
//     secrets = process.env;
// } else {
//     secrets = require("./secrets");
// }

const emailService = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use SSL

  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    rejectUnAuthorized: false
  }

  // service: 'gmail',
  // port:465,
  // secure: true, // true for 465, false for other ports
  // logger: true,
  // debug: true,
  // secureConnection: false,
  // auth: {
  //     user: process.env.EMAIL_USERNAME, // generated ethereal user
  //     pass: process.env.EMAIL_PASSWORD, // generated ethereal password
  // },
  // tls:{
  //     rejectUnAuthorized:true
  // }
});

module.exports = emailService;

const nodemailer = require('nodemailer');
require("dotenv").config();

password = process.env.PASS;
const transporter = nodemailer.createTransport({
 
  service: "gmail",
  auth: {
    user: "dreamshack1999@gmail.com",
    pass: password,
    
  },
  tls: {
    rejectUnauthorized: false,
  },
});

async function sendMail(mailData) {
  console.log("Mail Service Called.");
  const mailOptions = {
    from: "dreamshack1999@gmail.com",
    to: mailData.to,
    subject: mailData.subject,
    html: mailData.html,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

module.exports = sendMail;
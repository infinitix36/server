const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "infinitix36@gmail.com",
    pass: "xlgwjsdoitjfktaz",
  },
  tls: {
    rejectUnauthorized: false
  }
});

async function sendMail(mailData) {
  console.log("Mail Service Called.");
  const mailOptions = {
    from: "infinitix36@gmail.com",
    to: mailData.to,
    subject: mailData.subject,
    html: mailData.html,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

module.exports = sendMail;

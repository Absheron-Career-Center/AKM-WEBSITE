const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

async function sendVerificationEmail(email, code) {
  try {
    await transporter.sendMail({
      from: `"Absheron Port" <${process.env.SMTP_FROM_EMAIL}>`,
      to: email,
      subject: 'Your Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Email Verification</h2>
          <p>Your verification code is:</p>
          <strong style="font-size: 1.5rem;">${code}</strong>
          <p>This code expires in 30 minutes.</p>
        </div>
      `,
      text: `Your verification code is: ${code} (expires in 30 minutes)`
    });
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
}

module.exports = { sendVerificationEmail };
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `http://localhost:4200/verify-email?token=${token}`;
  await transporter.sendMail({
    from: '"StackTots" <no-reply@stacktots.com>',
    to: email,
    subject: 'Verify your email address',
    html: `Please click this link to verify your email address: <a href="${verificationUrl}">${verificationUrl}</a>`,
  });
};

module.exports = {
  sendVerificationEmail,
};

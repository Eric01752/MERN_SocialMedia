const express = require('express');
const router = express.Router();
const UserModel = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');
const baseUrl = require('../utils/baseUrl');
const isEmail = require('validator/lib/isEmail');

const options = {
  auth: {
    api_key: process.env.sendGrid_api,
  },
};

const transporter = nodemailer.createTransport(sendGridTransport(options));

//Check user exists and send email for reset password
router.post('/', async (req, res) => {
  try {
    const { email } = req.body;

    if (!isEmail(email)) {
      return res.status(401).send('Invaild Email');
    }

    const user = await UserModel.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).send('User Not Found');
    }

    const token = crypto.randomBytes(32).toString('hex');

    user.resetToken = token;
    user.expireToken = Date.now() + 3600000;

    await user.save();

    const href = `${baseUrl}/reset/${token}`;

    const mailOptions = {
      to: user.email,
      from: 'eric.schmidt1350@gmail.com',
      subject: 'Hi there! Password Reset Request',
      html: `<p>Hey ${user.name
        .split(' ')[0]
        .toString()}, there was a request for password reset. <a href=${href}>Click this link to reset the password</a></p>
      <p>This token is vaild for only 1 hour.</p>`,
    };

    transporter.sendMail(mailOptions, (err, info) => err && console.log(err));

    return res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server Error');
  }
});

//Verify token and reset the password
router.post('/token', async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token) {
      return res.status(401).send('Unauthorized');
    }

    if (password.length < 6) {
      return res.status(401).send('Unauthorized');
    }

    const user = await UserModel.findOne({ resetToken: token });

    if (!user) {
      return res.status(404).send('User Not Found');
    }

    if (Date.now() > user.expireToken) {
      return res.status(401).send('Token expired. Generate a new one');
    }

    user.password = await bcrypt.hash(password, 10);

    user.resetToken = '';
    user.expireToken = undefined;

    await user.save();

    return res.status(200).send('Password updated');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server Error');
  }
});

module.exports = router;

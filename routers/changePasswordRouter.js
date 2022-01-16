const express = require('express');
const nodemailer = require('nodemailer');
const User = require('../models/user');
const bcrypt = require("bcryptjs")

const changePasswordRouter = express.Router();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

let transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'gamingglobal.xd@gmail.com',
		pass: 'gaming098'
	}
});

changePasswordRouter.post('/otp', async (req, res) => {
  try {
    console.log(req.body)
    const user = await User.find({ email: req.body.email })
    if(user.length < 1) {
      return res.status(404).send({ error: "No user Found!" })
    }
    console.log(user)
    console.log(user[0].userOTP)
    let mailOptions = {
      from: 'gamingglobal.xd@gmail.com',
      to: req.body.email,
      subject: 'OTP for Change password!',
      text: `Your OTP code to change password is ${user[0].userOTP}`
    }
    transporter.sendMail(mailOptions, (err, data) => {
      if(err) {
        console.log(err)
        res.status(500).send({ error: "Server Error" })
      }
      else {
        console.log('Email Send!')
        res.status(200).send({ data: "Email Send!" })
      }
    })
  }
  catch(error) {

  }
});

changePasswordRouter.post('/getnewpassword', async (req, res) => {
  try {
    console.log(req.body)

    const userxd = await User.find({ email: req.body.email })
    if(userxd.length < 1) {
      return res.status(500).send({ error: "Server Error!" })
    }
    if(userxd[0].userOTP !== Number(req.body.otp)) {
      return res.status(500).send({ error: "Server Error" })
    }

    const user = await User.findById(userxd[0]._id)
    console.log('---------------------')
    console.log(user)
    console.log('---------------------')
    // Means Everything went well
    
      user.password = await bcrypt.hash(req.body.password, 8)
      await user.save()

    return res.status(200).send({ data: "We Good!" })
  }
  catch(error) {
    console.log(error)
    return res.status(500).send({ error: "Server Error" })
  }
})

module.exports = changePasswordRouter;
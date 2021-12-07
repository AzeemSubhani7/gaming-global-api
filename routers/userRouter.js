const express = require('express');

const User = require('../models/user');
const Follow = require('../models/follower')
const Chat = require('../models/chat')
const Notification = require('../models/notification')

const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const userRouter = express.Router();

// To create a new User // Sign-in a user
userRouter.post('/api/user', async(req, res) => {
  try {
    const isAlreadyRegistered = await User.findOne({ email: req.body.email })
    if(isAlreadyRegistered) {
      return res.status(409).send({ alreadyExisted: "The user already exist" })
    }
    const user = new User(req.body);
    // console.log("From try")
    user.token = jwt.sign({ _id: user._id.toString() }, "woodywassad")
    user.password = await bcrypt.hash(user.password, 8)
    console.log(user)
    await user.save();

    await new Follow({ user: user._id, followers: [], following: [] }).save()
    await new Chat({ user:user._id, chats: [] }).save()
    await new Notification({ user:user._id, notifications: [] }).save()

    return res.status(201).send(user);
  } catch (error) {
    // console.log('from error')
    return res.status(500).send(error)
  }
})

userRouter.post('/api/user/login', async (req, res) => {
  try{
    // console.log(req.body)
    const {email, password} = req.body;


    const user = await User.findOne({ email })

    if(!user) {
      return res.status(401).send({ Error: "Unable to Login" })
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch) {
      return res.status(401).send({ Error: "Unable to Login" })
    }

    user.token = jwt.sign({ _id: user._id.toString() }, "woodywassad")
    await user.save()
    return res.status(200).send(user)

  }
  catch(error) {
    console.log(error.message)
    return res.status(500).send({ Error: "Unable to Login" })
  }
})

// To get a user by its id
userRouter.get('/api/user/:id', async(req, res) => {
  
  const _id = req.params.id;
  // console.log(_id)
  try {
    const user =await User.findById(_id)
    // console.log(user)
    if(!user) {
      return res.status(404).send()
    }
    return res.send(user)
  } catch (error) {
    return res.status(501).send({error, errorMsg: "There is no user found with the given ID"})
  }
})


module.exports = userRouter;
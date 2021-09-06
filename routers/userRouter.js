const express = require('express');
const User = require('../models/user');


const userRouter = express.Router();

// To create a new User
userRouter.post('/api/user', async(req, res) => {
  try {
    const user = new User(req.body);
    console.log("From try")
    console.log(user)
    await user.save();
    return res.status(201).send(user);
  } catch (error) {
    console.log('from error')
    return res.status(500).send(error)
  }
})

// To get a user by its id
userRouter.get('/api/user/:id', async(req, res) => {
  
  const _id = req.params.id;
  console.log(_id)
  try {
    const user =await User.findById(_id)
    console.log(user)
    if(!user) {
      return res.status(404).send()
    }
    return res.send(user)
  } catch (error) {
    return res.status(501).send({error, errorMsg: "There is no user found with the given ID"})
  }
})


module.exports = userRouter;
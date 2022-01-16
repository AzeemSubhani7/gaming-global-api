const express = require("express");
const User = require('../models/user')
const editRouter = express.Router();
const bcrypt = require("bcryptjs")

editRouter.patch('/changemyprofile', async(req, res) => {
  try{
    console.log(req.body)

    const user = await User.findById(req.body.id)
    if(!user) {
      return res.status(404).send("No user Found!")
    }

    if(req.body.userName) {
      user.userName = req.body.userName;
      await user.save()
    }
    if(req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 8)
      await user.save()
    }
    if(req.body.profilePic) {
      user.profilepicUrl = req.body.profilePic
      await user.save()
    }
    console.log(user)

    return res.status(200).send(user)
  }
  catch(error) {
    console.log(error)
    return res.status(500).send(error)
  }
})


module.exports = editRouter;
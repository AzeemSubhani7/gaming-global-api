const express = require('express');
const postModel = require('../models/post');
const authMiddleware = require('../middleware/auth');

const postRouter = express.Router();

postRouter.post('/api/post',authMiddleware, async(req, res) => {
  try{
    // console.log(req.body)
    // console.log(req.user)
    return res.send("I am accepting your data")
  }
  catch(error) {
    return res.status(500).send(error)
  }
})


module.exports = postRouter;
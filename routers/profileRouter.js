const express = require('express');

const Post = require('../models/post');
const User = require('../models/user');
const Follow = require('../models/follower');

const authMiddleware = require('../middleware/auth');

const profileRouter = express.Router();

// 01 get Profile information of a user
profileRouter.get('/api/:id', authMiddleware, async(req, res) => {
  try{
    const userToFetchId = req.params.id;

    const user = await User.findById(userToFetchId);
    if(!user) {
      return res.status(404).send({ error: "No user Found!" })
    }
    const userToSendFollowers = await Follow.find({ user: userToFetchId })
    .populate('user', { userName:1, avatar: 1 })
    .populate('followers', { userName:1, avatar: 1 })
    .populate('following', { userName:1, avatar: 1 })
    // console.log(user)
    // console.log(user._id)
    const userToSend = {
      role: user.role,
      _id: user._id,
      userName: user.userName,
      bio: user.bio,
      avatar: user.avatar,
      joinedAt: user.createdAt,
      followStats: userToSendFollowers
    }
    return res.status(200).send(userToSend)
  }
  catch(error){
    console.log(error);
    return res.status(500).send(error)
  }
})

// 02 get posts of a specific user
profileRouter.get('/api/userposts/:id', authMiddleware, async(req, res) => {
  try{
    const userId = req.params.id;

    const user = await User.findById(userId);
    if(!user) {
      return res.status(404).send({ error: "404 No user found!" })
    }

    const posts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate('user', { userName:1, avatar: 1 })
      .populate('postLikes.user', { userName: 1, avatar: 1 })
      .populate('postComments.user', { userName: 1, avatar: 1 })

    if(posts.length == 0) {
      return res.status(404).send({ error: "There are no posts by this user!" })
    }  

    return res.status(200).send(posts)

  }
  catch(error) {
    console.log(error)
    return res.status(500).send(error)
  }
})

// 03 Follow a user
profileRouter.post('/api/user/follow/:id', authMiddleware, async(req, res) => {
  try{
    const userToFollowId = req.params.id;

    const userToFollowStats = await Follow.find({user: userToFollowId})
    const userToFollowingStats = await Follow.find({ user: req.user._id })
    if(!userToFollowStats) {
      return res.status(404).send({ error: "404 not found!" })
    }

    if(userToFollowStats.length == 0) {
      // There were no followers of this user
      userToFollowStats.user = await userToFollowId;
      await userToFollowStats.followers.push({ user: req.user._id })
      await userToFollowStats.save()  

      console.log("Pehla bacha")
      return res.status(200).send("OK we good!")
    }

    // const isFollowing = userToFollow.followers.filter(x => {
    //   return x.user == req.user._id
    // })

    console.log(userToFollowStats);

    return res.status(200).send("OK we good!")
  }
  catch(error){
    console.log(error)
    return res.status(500).send(error)
  }
})











module.exports = profileRouter;
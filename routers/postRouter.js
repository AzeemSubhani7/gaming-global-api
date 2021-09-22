const express = require('express');
const Post = require('../models/post');
const authMiddleware = require('../middleware/auth');

const postRouter = express.Router();


// ROUTES FOR POSTS

// FOR CREATING A POST
postRouter.post('/api/post',authMiddleware, async(req, res) => {
  try{
    // console.log(req.body.user)
    // console.log(req.body.postText)

    const newPost = {
      user: req.body.user,
      postText: req.body.postText
    }

    const post = new Post(newPost)

    // console.log(post)
    await post.save()
    const lemme = await Post.findOne({ _id: post._id }).populate('user', { userName: 1, email: 1, bio: 1, avatar: 1})
    return res.status(200).send(lemme)

  }
  catch(error) {
    return res.status(500).send(error)
  }
});

// FOR LIKING A POST 
postRouter.post('/api/post/likes/:id', authMiddleware, async (req, res) => {
  try{
    const postId = req.params.id;    // ID to like the post 
    const { user } = req;            // user who is liking your post

    const post = await Post.findById(postId);
    if(!post) {
      return res.status(404).send("No Posts Found!")
    }

    // Checking if user already liked the post

    const isLiked = post.postLikes.filter(like => {
      return like = user._id
    })

    if(isLiked.length > 0) {
      return res.status(401).send({ error: "post already liked" })
    }


    await post.postLikes.unshift({ user: user._id })
    await post.save();

    return res.status(200).send(post)
  }
  catch(error) {
    res.status(500).send(error);
  }
})

// FOR UNLIKING A POST 
postRouter.post('/api/post/unlikes/:id', authMiddleware, async (req, res) => {
  try{
    const postId = req.params.id;    // ID to like the post 
    const { user } = req;            // user who is liking your post

    const post = await Post.findById(postId);
    if(!post) {
      return res.status(404).send("No Posts Found!")
    }

    // Checking if user already liked the post

    const isLiked = post.postLikes.filter(like => {
      return like = user._id
    })

    // IF this condition is true then user has liked the post
    if(isLiked.length > 0) {
      // Logic goes here
      const index = post.postLikes.map(like => like.user.toString()).indexOf(user._id);
      await post.postLikes.splice(index, 1);     
      await post.save();
      return res.status(200).send(post)
    }

    return res.status(401).send({ error: "you have not liked the post" })
  }
  catch(error) {
    res.status(500).send(error);
  }
})

// GET ALL THE LIKES OF A POST
postRouter.get('/api/getlikes/:id', authMiddleware, async(req, res) => {
  try{
    const { id } = req.params;
    
    const post = await Post.findById(id).populate('postLikes.user', { userName: 1, avatar: 1 })

    if(!post) {
      return res.status(404).send({ error: "Not Found!" })
    }
    
    return res.status(200).send(post)
  }
  catch(error) {
    return res.status(500).send(error)
  }
})

module.exports = postRouter;
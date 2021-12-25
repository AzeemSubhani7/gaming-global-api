const express = require("express");
const User = require("../models/user");
const Post = require("../models/post");
const Report = require("../models/report");

const adminRouter = express.Router();

// get request for getting the statistics
adminRouter.get("/api/admin/getstats", async (req, res) => {
  try {
    let numberOfUsers = 0;
    let numberOfPosts = 0;
    let error = false;

    await User.find().count((err, count) => {
      if (err) {
        error = true;
      }
      numberOfUsers = count;
    });

    await Post.find().count((err, count) => {
      if (err) {
        error = true;
      }
      numberOfPosts = count;
    });

    if (error) {
      return res.status(500).send("Something bad Happend!");
    }

    return res.status(200).send({ user: numberOfUsers, post: numberOfPosts });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// get request for getting the users
adminRouter.get("/api/admin/getusers", async (req, res) => {
  try {
    const users = await User.find();
    // console.log(users);
    if (!users) {
      return res.status(404).send("No users");
    }
    return res.status(200).send(users);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
});

// To Make a user admin
adminRouter.post("/api/admin/makeadmin/:id", async (req, res) => {
  try {
    console.log(req.params.id);
    const user = await User.findById(req.params.id);
    console.log(user);
    if (!user) {
      return res.status(404).send("User Not Found!");
    }
    user.role = "root";
    await user.save();
    return res.status(200).send(user);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
});

// To Remove admin privelleges
adminRouter.post("/api/admin/removeadmin/:id", async (req, res) => {
  try {
    console.log(req.params.id);
    const user = await User.findById(req.params.id);
    console.log(user);
    if (!user) {
      return res.status(404).send("User Not Found!");
    }
    user.role = "user";
    await user.save();
    return res.status(200).send(user);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
});

// To ban a user
adminRouter.post("/api/admin/banuser/:id", async (req, res) => {
  try {
    console.log(req.params.id);
    const user = await User.findById(req.params.id);
    console.log(user);
    if (!user) {
      return res.status(404).send("User Not Found!");
    }
    user.isBanned = true;
    await user.save();
    return res.status(200).send(user);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
});

// To unban a user
adminRouter.post("/api/admin/unbanuser/:id", async (req, res) => {
  try {
    console.log(req.params.id);
    const user = await User.findById(req.params.id);
    console.log(user);
    if (!user) {
      return res.status(404).send("User Not Found!");
    }
    user.isBanned = false;
    await user.save();
    return res.status(200).send(user);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
});

// To get the posts
adminRouter.get("/api/admin/getposts", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "userName email");
    // console.log(users);
    if (!posts) {
      return res.status(404).send("No posts");
    }
    return res.status(200).send(posts);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
});

adminRouter.delete("/api/admin/deletepost/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).send("Post not found!");
    }
    let isReport = await Report.findOneAndDelete({ post: postId });
    console.log(isReport);
    if (isReport) {
      await post.remove();
      return res.status(200).send("Post and Report Removed!");
    }
    console.log(post);
    await post.remove();
    res.status(200).send("Post Removed!");
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
});
module.exports = adminRouter;

const express = require("express");

const Post = require("../models/post");
const User = require("../models/user");
const Follow = require("../models/follower");
const Notification = require("../models/notification");

const authMiddleware = require("../middleware/auth");

const profileRouter = express.Router();

// 01 get Profile information of a user
profileRouter.get("/api/:id", authMiddleware, async (req, res) => {
  try {
    const userToFetchId = req.params.id;

    const user = await User.findById(userToFetchId);
    if (!user) {
      return res.status(404).send({ error: "No user Found!" });
    }
    const userToSendFollowers = await Follow.find({ user: userToFetchId })
      .populate("user")
      .populate("followers.user")
      .populate("following.user");
    // console.log(user)
    // console.log(user._id)
    const userToSend = {
      role: user.role,
      _id: user._id,
      userName: user.userName,
      bio: user.bio,
      avatar: user.avatar,
      joinedAt: user.createdAt,
      followStats: userToSendFollowers,
    };
    return res.status(200).send(userToSend);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

// 02 get posts of a specific user
profileRouter.get("/api/userposts/:id", authMiddleware, async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ error: "404 No user found!" });
    }

    const posts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate("user", { userName: 1, avatar: 1 })
      .populate("postLikes.user", { userName: 1, avatar: 1 })
      .populate("postComments.user", { userName: 1, avatar: 1 });

    if (posts.length == 0) {
      return res
        .status(404)
        .send({ error: "There are no posts by this user!" });
    }

    return res.status(200).send(posts);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

// 03 Follow a user or unfollow a user
profileRouter.post("/api/user/follow/:id", authMiddleware, async (req, res) => {
  try {
    const userToFollowId = req.params.id;

    const userStats = await Follow.findOne({ user: req.user._id })
      .populate("following.user")
      .populate("followers.user");
    const userToFollowStats = await Follow.findOne({ user: userToFollowId })
      .populate("following.user")
      .populate("followers.user");

    if (!userStats || !userToFollowStats) {
      return res.status(404).send("User not found");
    }

    const isFollowing = userStats.following.filter(
      (x) => x.user._id.toString() === userToFollowId
    );
    console.log(isFollowing)
    if (isFollowing.length == 0) {
      // its means user A is not following user B
      await userStats.following.unshift({ user: userToFollowId });
      await userStats.save();

      await userToFollowStats.followers.unshift({ user: req.user._id });
      await userToFollowStats.save();

      const newNotification = {
        type: "newfollower",
        user: req.user._id,
        date: Date.now(),
      };

      const userNotification = await Notification.findOne({
        user: userToFollowId,
      }).populate("");
      await userNotification.notifications.unshift(newNotification);
      await userNotification.save();

      return res
        .status(200)
        .send({ message: "followed", userStats, userToFollowStats });
    }

    // if user is already following and made a req. then unfollow if already following
    // user A is following the user B

    const removeFollowingIndex = userStats.following
      .map((x) => x.user.toString())
      .indexOf(userToFollowId);
    await userStats.following.splice(removeFollowingIndex, 1);
    await userStats.save();

    const removeFollowerIndex = userToFollowStats.followers
      .map((x) => x.user.toString())
      .indexOf(req.user._id);
    await userToFollowStats.followers.splice(removeFollowerIndex, 1);
    await userToFollowStats.save();

    return res
      .status(200)
      .send({ message: "unfollowed", userStats, userToFollowStats });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

module.exports = profileRouter;

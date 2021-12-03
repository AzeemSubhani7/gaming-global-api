// Libraries
const express = require("express");
// Models
const User = require("../models/user");
const Notification = require("../models/notification");
const Follow = require("../models/follower");
// Middleware
const authMiddleware = require("../middleware/auth");

const postRouter = express.Router();

postRouter.post(
  "/follow/:userToBeFollower/:userToFollowId",
  authMiddleware,
  async (req, res) => {
    try {
      const { userToBeFollowerId, userToFollowId } = req.params;

      const user = await Follow.findOne({ user: userToBeFollowerId });
      const userToFollow = await Follow.findOne({ user: userToFollowId });

      // If no user found!
      if (!user || !userToFollow) {
        return res.status(404).send("User Not Found!");
      }

      // Check if requested user already followed the user!

      const isFollowing =
        user.following.length > 0 &&
        user.following.filter(
          (following) => following.user.toString() === userToFollowId
        ).length > 0;
        
      if(isFollowing) {
        return res.status(401).send("User Already Followed!");
      }

      // If Both of the user Found and requested user is not following then this happens

      await user.following.unshift({ user: userToFollowId });
      await user.save();

      await userToFollow.followers.unshift({ user: userToBeFollowerId })
      await userToFollow.save()

      return res.status(200).send({ message: "Followed Successfully" });

    } catch (error) {
      console.error(error);
      return res.status(500).send("Server Error");
    }
  }
);

module.exports = postRouter;

// Libraries
const express = require("express");
// Models
const Post = require("../models/post");
const Notification = require("../models/notification");
// Middleware
const authMiddleware = require("../middleware/auth");
const User = require("../models/user");

const postRouter = express.Router();

// -------------------------ROUTES FOR POSTS------------------------------//

// FOR CREATING A POST
postRouter.post("/api/post", authMiddleware, async (req, res) => {
  try {
    // console.log(req.body.user)
    // console.log(req.body.postText)

    const newPost = {
      user: req.body.user,
      postText: req.body.postText,
    };

    const post = new Post(newPost);

    // console.log(post)
    await post.save();
    const lemme = await Post.findOne({ _id: post._id }).populate("user", {
      userName: 1,
      email: 1,
      bio: 1,
      avatar: 1,
    });
    return res.status(200).send(lemme);
  } catch (error) {
    return res.status(500).send(error);
  }
});

// FOR LIKING A POST
postRouter.post("/api/post/likes/:id", authMiddleware, async (req, res) => {
  try {
    // console.log('inside the request!');
    const postId = req.params.id; // ID to like the post
    const { user } = req; // user who is liking your post

    // console.log(postId);
    // console.log(user);

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).send(new Error("No Posts Found!"));
    }

    // Checking if user already liked the post

    const isLiked = post.postLikes.filter((like) => {
      return like.user.toString() === user._id.toString();
    });

    // console.log('from Like', user._id)
    console.log("from like isliked", isLiked);

    if (isLiked.length > 0) {
      // console.log(isLiked);
      console.log("inside IF");
      // console.log(isliked)
      return res.status(402).send(new Error("Post Already liked"));
    }

    await post.postLikes.unshift({ user: user._id });
    await post.save();

    const newNotification = {
      type: "newlike",
      user: user._id,
      post: post._id,
      date: Date.now(),
    };

    const userNotification = await Notification.findOne({ user: post.user });
    await userNotification.notifications.unshift(newNotification);
    await userNotification.save();

    return res
      .status(200)
      .send({ message: "post liked and notified", post, userNotification });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

// FOR UNLIKING A POST
postRouter.post("/api/post/unlikes/:id", authMiddleware, async (req, res) => {
  try {
    const postId = req.params.id; // ID to like the post
    const { user } = req; // user who is liking your post

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).send(new Error("Post not found"));
    }

    // Checking if user already liked the post

    const isLiked = post.postLikes.filter((like) => {
      return (like = user._id);
    });

    // IF this condition is true then user has liked the post
    if (isLiked.length > 0) {
      // Logic goes here
      const index = post.postLikes
        .map((like) => like.user.toString())
        .indexOf(user._id);
      await post.postLikes.splice(index, 1);
      await post.save();
      return res.status(200).send(post);
    }

    return res.status(400).send(new Error("You've not liked the post!"));
  } catch (error) {
    res.status(500).send(error);
  }
});

// GET ALL THE LIKES OF A POST
postRouter.get("/api/getlikes/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id).populate("postLikes.user", {
      userName: 1,
      avatar: 1,
    });

    if (!post) {
      return res.status(404).send({ error: "Not Found!" });
    }

    return res.status(200).send(post);
  } catch (error) {
    return res.status(500).send(error);
  }
});

postRouter.get("/api/posts/:user", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.user);
    const posts = await Post.find({ user: req.params.user }).populate("user");

    if (!user) {
      return res.status(404).send(new Error("User Not Found!"));
    }

    return res.status(200).send(posts);
  } catch (error) {
    return res.status(402).send(error);
  }
});

// GET ALL THE POST FOR FEED PAGE
postRouter.get("/api/post/allposts", authMiddleware, async (req, res) => {
  const post = await Post.find()
    .populate("user", { userName: 1, avatar: 1 })
    .populate("postLikes.user", { userName: 1, avatar: 1 })
    .populate("postComments.user", { userName: 1, avatar: 1 });
  if (!post) {
    return res.status(404).send({ error: "No post Found!" });
  }
  return res.status(200).send(post);
});

// GET A POST BY ITS ID
postRouter.get("/api/post/:id", authMiddleware, async (req, res) => {
  try {
    // Actual logic for getting a post by its ID
    const post = await Post.findById(req.params.id)
      .populate("user")
      .populate("postLikes.user", { userName: 1, avatar: 1 })
      .populate("postComments.user", { userName: 1, avatar: 1 });

    if (!post) {
      return res.status(404).send(new Error("Post Not found"));
    }

    return res.status(200).send(post);
  } catch (error) {
    console.log(error);
    return res.status(404).send(new Error("Post not Found!"));
  }
});

// DELETING A POST BY ITS ID
postRouter.delete("/api/post/del/:id", authMiddleware, async (req, res) => {
  try {
    const postId = req.params.id; // ID to like the post
    const { user } = req;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).send({ error: "post not found" });
    }

    const postUserID = post.user.toString();
    const requestUserID = user._id;

    const isAdmin = user.role === "root" ? true : false;

    if (isAdmin) {
      console.log("admin is deleting post");
      await post.remove();
      return res.status(200).send({ message: "post deleted by admin", post });
    }

    if (postUserID == requestUserID) {
      console.log("There goes the logic");
      await post.remove();
      return res
        .status(200)
        .send({ message: "post deleted successfully", post });
    }

    return res.status(401).send("Unauthorized");
  } catch (error) {
    return res.status(500).send(error);
  }
});

// CREATE A COMMENT
postRouter.post("/api/post/comment/:id", authMiddleware, async (req, res) => {
  try {
    const postToCommentId = req.params.id;
    const { user } = req;
    const { text } = req.body;

    if (text.length < 1) {
      return res
        .status(400)
        .send({ error: "Comment length must be 1 character" });
    }

    const post = await Post.findById(postToCommentId);

    if (!post) {
      return res.status(404).send({ error: "Not Found!" });
    }

    const newComment = {
      user: user._id,
      text,
    };

    await post.postComments.unshift(newComment);
    await post.save();

    const newNotification = {
      type: "newcomment",
      user: user._id,
      post: post._id,
      date: Date.now(),
    };

    const userNotification = await Notification.findOne({ user: post.user });
    await userNotification.notifications.unshift(newNotification);
    await userNotification.save();

    return res
      .status(200)
      .send({ message: "comment created! and notified original user!", post });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

// DELETING A COMMENT
postRouter.delete(
  "/api/:post/comment/del/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const postId = req.params.post;
      const commentToDeleteId = req.params.id;
      const { user } = req;

      // console.log(commentToDeleteId)
      // console.log(postId)
      // console.log(user._id)

      // Logic Goes there
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).send({ error: "post not found!" });
      }

      // Finding the comment index
      const commentIndex = post.postComments.filter(
        (comment) => comment._id == commentToDeleteId
      );
      if (commentIndex.length < 1) {
        return res.status(404).send({ error: "Comment not found" });
      }
      const isAbleToDelete =
        commentIndex[0].user.toString() == user._id ? true : false;
      const indexOfComment = post.postComments
        .map((comment) => comment._id)
        .indexOf(commentToDeleteId);

      if (user.role == "root") {
        await post.postComments.splice(indexOfComment, 1);
        await post.save();
        return res.status(200).send({ message: "admin deleted comment", post });
      } else {
        if (isAbleToDelete) {
          await post.postComments.splice(indexOfComment, 1);
          await post.save();
          return res
            .status(200)
            .send({ message: "post deleted by user", post });
        }
      }

      return res.status(401).send({ error: "Unauthorized!" });
    } catch (error) {
      console.log(error);
      return res.stauts(500).send(error);
    }
  }
);

// GETTING THE NOTIFICATIONS OF A USER
postRouter.get("/api/notifications", authMiddleware, async (req, res) => {
  try {
    console.log(req.user);

    const notifications = await Notification.find({
      user: req.user._id,
    })
      .populate("user")
      .populate("notifications.user", "userName _id")
      .populate("notifications.post", "_id")
    // console.log(notifications);
    if(notifications) {
      return res.status(200).send(notifications)
    }
    if(!notifications) {
      return res.status(404).send({ error: "No notifications" })
    }

    return res.send("Ok");
  } catch (error) {
    return res.status(500).send(error);
  }
});
module.exports = postRouter;

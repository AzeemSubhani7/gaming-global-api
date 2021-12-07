const express = require("express");
const Chat = require("../models/chat");
const authMiddleware = require("../middleware/auth");

const chatRouter = express.Router();

chatRouter.get("/api/chat/getchats", authMiddleware, async (req, res) => {
  try {
    // The user who's is making the request!
    const user = req.user;
    // console.log(user._id)

    const usersChat = await Chat.findOne({ user: user._id })
      .populate("chats.messageWith", "userName user._id")
      .populate("user", "userName user._id")
      .populate("chats.messages.sender", "userName user._id")
      .populate("chats.messages.receiver", "userName user._id");

    let chatsToBeSent = []

    if(usersChat.chats.length > 0) {
      chatsToBeSent = await usersChat.chats.map(chat => {
        return { 
          messagesWith: chat.messageWith._id,
          messagesWithUser: chat.messageWith.userName,
          lastMessage: chat.messages[chat.messages.length - 1]
         }
      })
      return res.status(200).send(chatsToBeSent);
    }

    return res.status(404).send({ error: "No Chat Found!" });

    // console.log(chatsToBeSent);
    // console.log(usersChat);

    
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
});

module.exports = chatRouter;

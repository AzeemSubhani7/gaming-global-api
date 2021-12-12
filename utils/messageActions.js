const Chat = require("../models/chat");
const User = require("../models/user");

const loadMessages = async (userId, messagesWith) => {
  try {
    // console.log('from load meassages', userId)
    // console.log('from load meassages', messagesWith)
    const usersChats = await Chat.findOne({ user: userId }).populate(
      "chats.messageWith"
    );

    // console.log(usersChats)
    const chat = usersChats.chats.find(
      (chat) => chat.messageWith._id.toString() === messagesWith
    );
    // console.log(chat)
    if (!chat) {
      return { error: "No chat found" };
    }
    return { chat };
  } catch (error) {
    console.log(error);
    return { error };
  }
};

const sendMessage = async (userId, messageSendToUserId, msg) => {
  try {
    // sender user!
    const senderUser = await Chat.findOne({ user: userId });
    // receiver user!
    const receiverUser = await Chat.findOne({ user: messageSendToUserId });

    // console.log(senderUser)
    // console.log(receiverUser)
    const newMessage = {
      msg: msg,
      sender: userId,
      receiver: messageSendToUserId,
      date: Date.now(),
    };

    // Checking is there any previous chat
    const isPreviousChat = senderUser.chats.find(
      (x) => x.messageWith.toString() === messageSendToUserId
    );


    if (isPreviousChat) {
      isPreviousChat.messages.push(newMessage);
      await senderUser.save();
    } //
    else {
      const newChat = {
        messageWith: messageSendToUserId,
        messages: [],
      };
      newChat.messages.push(newMessage);
      senderUser.chats.push(newChat);
      await senderUser.save();
    }

    // Now For the receiver xD
    const isPreviousChatForReceiver = receiverUser.chats.find(
      (x) => x.messageWith.toString() === userId
    );

    // console.log('from xdxdxd', isPreviousChatForReceiver)

    if (isPreviousChatForReceiver) {
      isPreviousChatForReceiver.messages.push(newMessage);
      await receiverUser.save();
    } //
    else {
      // console.log('inside else')
      // console.log(userId)
      const newChat = {
        messageWith: userId,
        messages: [],
      };
      newChat.messages.push(newMessage)
      receiverUser.chats.push(newChat);
      await receiverUser.save();
    }

    return { newMessage }

  } catch (error) {
    console.error(error);
    return { error };
  }
};

const setMessageToUnread = async (userId) => {
  try{
    const user = await User.findById(userId);
    if(!user.unreadMessage) {
      user.unreadMessage = true;
      await user.save();
    }
  }
  catch(error) {
    console.error(error)
    return {error}
  }
}

module.exports = { loadMessages, sendMessage, setMessageToUnread };

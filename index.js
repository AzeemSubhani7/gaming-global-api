// Libraries
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser")

// Routers
const userRouter = require("./routers/userRouter");
const postRouter = require("./routers/postRouter");
const profileRouter = require("./routers/profileRouter");
const statsRouter = require("./routers/statsRouter");
const chatRouter = require("./routers/chatRouter");
const adminRouter = require("./routers/adminRouter");
const reportRouter = require("./routers/reportRouter");
const scrimRouter = require("./routers/scrimRouter");
const patchRouter = require("./routers/patchRouter");
const editRouter = require("./routers/editProfileRouter");
const changePasswordRouter = require('./routers/changePasswordRouter');

// Message Actions
const { addUser, removeUser, findConnectedUser } = require("./utils/roomActions")
const { loadMessages, sendMessage, setMessageToUnread } = require("./utils/messageActions");

// This Node will automatically run the mentioned File
require("./db/mongoose");

// This will automatically parse json to an object
app.use(express.json());

// const corsOptions ={
//   origin:'http://localhost:3000',
//   credentials:true,            //access-control-allow-credentials:true
//   optionSuccessStatus:200
// }

// Middlewares
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(userRouter);
app.use(postRouter);
app.use(profileRouter);
app.use(statsRouter);
app.use(chatRouter);
app.use(adminRouter);
app.use(reportRouter);
app.use(scrimRouter);
app.use(patchRouter);
app.use(editRouter);
app.use(changePasswordRouter);

app.get("/", (req, res) => {
  console.log("There is a request !");
  res.send("The server is up and running!");
});

var port = process.env.PORT || 4000;

var server = app.listen(port, () =>
  console.log(`The server is listenning on ${port}`)
);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("join", async ({ userId }) => {
    // console.log("A user has joined", userId);
    const users = await addUser(userId, socket.id);
    console.log(users);

  });

  socket.on("loadMessages", async ({ userId, messagesWith }) => {
    // console.log(userId);
    // console.log(messagesWith);
    const { chat, error } = await loadMessages(userId, messagesWith);
    // console.log("from index", chat);
    if (!error) {
      socket.emit("messagesLoaded", { chat });
    } else {
      socket.emit("noPreviousChat");
    }
  });

  socket.on("sendNewMessage", async (data) => {
    // console.log(data);
    const { newMessage, error } = await sendMessage(
      data.userId,
      data.messageSendToUserId,
      data.message
    );
    const receiverSocket = findConnectedUser(data.messageSendToUserId)
    // This means that user is online
    if(receiverSocket) {
      io.to(receiverSocket.socketId).emit('newMessageReceived', {newMessage})
    }
    else {
        setMessageToUnread(data.messageSendToUserId)
    }
    if(!error) {
      socket.emit('messageSent', { newMessage });
      
    }
  });

  socket.on("disconnected", () => {
    const users = removeUser(socket.id)
    console.log(users)
    console.log("A user has disconnected! with socket-id", socket.id);
  });
});

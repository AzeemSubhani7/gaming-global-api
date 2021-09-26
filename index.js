// Libraries
const express = require('express');
const cors = require('cors')

// Local Files
const userRouter = require('./routers/userRouter')
const postRouter = require('./routers/postRouter')
const profileRouter = require('./routers/profileRouter')
// This Node will automatically run the mentioned File
require('./db/mongoose');

const app = express();

// This will automatically parse json to an object
app.use(express.json());

const corsOptions ={
  origin:'http://localhost:3000', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}
app.use(cors(corsOptions));

app.use(userRouter);
app.use(postRouter);
app.use(profileRouter);

app.get('/', (req,res) => {
  console.log("There is a request !")
  res.send("The server is up and running!")
})

app.listen(4000, () => console.log('The server is listenning on 4000'))
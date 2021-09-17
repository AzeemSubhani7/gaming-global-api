const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authMiddleware = async(req, res, next) => {
  try{
    // console.log("from Auth")
    if(!req.headers.authorization) {
      // console.log(req.headers.authorization)
      return res.status(401).send({ error: "Unauthorized! first" })
    }
    const token = req.headers.authorization;

    // console.log(token)

    const decoder = jwt.verify(token, "woodywassad")
    const user = await User.findOne({ _id: decoder._id, token: token })

    // console.log(decoder)
    // console.log(user)

    if(!user) {
      return res.status(401).send({ error: "Unauthorized! User" })
    }

    req.token = token;
    req.user = user
    next();

  }
  catch(error) {
    res.status(401).send({ error: "Unauthorized!" })
  }
}

module.exports = authMiddleware;
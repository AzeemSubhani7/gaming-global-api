const mongoose = require('mongoose')

const mongoDbUrl = "mongodb+srv://gamingglobal:gamingglobal@cluster2.zrwjx.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(mongoDbUrl,{
  useUnifiedTopology: true,
  useCreateIndex: true,
  useNewUrlParser: true
})
  .then( () => console.log('Database Connected'))
  .catch(e => console.log(e))

const mongoose = require('mongoose')

const mongoDbUrl = "mongodb://localhost:27017/gaming-global-api"

mongoose.connect(mongoDbUrl,{
  useUnifiedTopology: true,
  useCreateIndex: true,
  useNewUrlParser: true
})
  .then( () => console.log('Database Connected'))
  .catch(e => console.log(e))

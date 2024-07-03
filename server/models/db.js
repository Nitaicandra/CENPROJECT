const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url, {
})
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

  const todoSchema = new mongoose.Schema({
    text: String,
    done: Boolean
  })

module.exports = mongoose.model('Todo', todoSchema)

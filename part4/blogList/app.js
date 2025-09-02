const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const blogsRouter = require('./controllers/blogs')

const app = express()

logger.info('Connecting to db')
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('Connected to db successfully')
  })
  .catch(error => logger.error('Error connecting to db:', error.message))

app.use(express.json())
app.use('/api/blogs', blogsRouter)

module.exports = app
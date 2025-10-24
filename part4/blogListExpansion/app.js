const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./middleware/middleware')

const app = express()

logger.info('Connecting to db')
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('Connected to db successfully')
  })
  .catch(error => logger.error('Error connecting to db:', error.message))

app.use(express.json())
app.use(middleware.tokenExtractor)
app.use('/api/login', loginRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

module.exports = app
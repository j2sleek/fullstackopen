const User = require('../models/user')
const jwt = require('jsonwebtoken')

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    const retrievedToken = authorization.replace('Bearer ', '')
    request.token = retrievedToken
  }
  next()
}

const userExtractor = async (request, response, next) => {
  if (!request.token) {
    return next()
  }
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({
      message: 'token invalid'
    })
  }
  const user = await User.findById(decodedToken.id)
    if (!user) {
      return response.status(400).json({
        message: 'UserId missing or not valid'
    })
  }
  request.user = user
  next()
}

module.exports = {
  tokenExtractor,
  userExtractor
}
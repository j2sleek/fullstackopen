const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    const retrievedToken = authorization.replace('Bearer ', '')
    request.token = retrievedToken
  } else { return null }

  next()
}

const errorHandler = (error, request, response, next) => {
  if (error.name === 'ValidationError') {
    response.status(400).json({
      message: 'title or url validation failed'
    }) 
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' })
  } else {
    response.status(400).json({
      message: error.message
    })
  }

  next(error)
}

module.exports = {
  tokenExtractor,
  errorHandler,
}
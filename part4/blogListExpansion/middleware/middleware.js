const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    const retrievedToken = authorization.replace('Bearer ', '')
    request.token = retrievedToken
  } else { return null }

  next()
}

module.exports = {
  tokenExtractor
}
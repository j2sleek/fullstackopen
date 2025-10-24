const blogsRouter = require('express').Router()
const { response } = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  try {
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
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

    const blog = new Blog({...request.body, user: user._id})
    const res = await blog.save()

    user.blogs = user.blogs.concat(res._id)
    await user.save()

    response.status(201).json(res)

  } catch (error) {
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
  } 
})

blogsRouter.delete('/:id', async (request, response) => {
  try {
    const id = request.params.id
    await Blog.findByIdAndDelete(id)
    response.status(204).end()
  } catch (error) {
    response.status(400).json({
      error: error.message
    })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  try {
    const id = request.params.id
    const { likes } = request.body

    const blogToUpdate = await Blog.findById(id)
    blogToUpdate.likes = likes
    
    const updatedBlog = await blogToUpdate.save()
    response.json(updatedBlog)
  } catch (error) {
    response.status(400).json({
      error: error.message
    })
  }
})

module.exports = blogsRouter
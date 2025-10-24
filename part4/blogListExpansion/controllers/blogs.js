const blogsRouter = require('express').Router()
const { response } = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  try {
    const allUsers = await User.find({})
    const user = allUsers[0]
    request.body.user = user.id

    const blog = new Blog(request.body)
    const res = await blog.save()

    user.blogs = user.blogs.concat(res._id)
    await user.save()

    response.status(201).json(res)

  } catch (error) {
    if (error.name === 'ValidationError') {
      response.status(400).json({
        message: 'title or url validation failed'
      }) 
    }else {
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
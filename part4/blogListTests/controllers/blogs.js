const blogsRouter = require('express').Router()
const { response } = require('../app')
const blog = require('../models/blog')
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  try {
    const blog = new Blog(request.body)
    const res = await blog.save()
    response.status(201).json(res)
  } catch (error) {
    if (error.name === 'ValidationError') {
      response.status(400).json({
        message: 'title or url validation failed'
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

module.exports = blogsRouter
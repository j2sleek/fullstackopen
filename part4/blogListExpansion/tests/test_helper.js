const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: "Testing 123",
    author: "Me",
    url: "https://fullstackopen.io",
    likes: 2,
  },
  {
    title: "Testing 456",
    author: "Me",
    url: "https://fullstackopen.io",
    likes: 1,
  },
]

const nonExistingId = async () => {
  const blog = new Blog({
    title: "Testing 789",
    author: "Me",
    url: "https://fullstackopen.com",
    likes: 0,
  })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs, 
  nonExistingId, 
  blogsInDb,
  usersInDb,
}
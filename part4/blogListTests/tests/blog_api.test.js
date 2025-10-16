const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('all blogs are returned in JSON', async () => {
    const res = await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/)
    assert.strictEqual(res.body.length, helper.initialBlogs.length)
})

test('verifies the unique identifier is named id', async () => {
  const res = await helper.blogsInDb()
  assert(res[0].hasOwnProperty('id'))
})

test('verifies new blog post created', async () => {
  const newBlog = {
    title: 'Checking POST request',
    author: 'Developer',
    url: 'https://example.com',
    likes: 1,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const allBlogsInDb = await helper.blogsInDb()
  assert.strictEqual(allBlogsInDb.length, helper.initialBlogs.length + 1)
  
  const title = allBlogsInDb.map(t => t.title)
  assert(title.includes('Checking POST request'))
})

test('verifies like property defaults to 0', async () => {
  const newBlog = {
    title: 'This is a new blog',
    author: 'Developer',
    url: 'https://dev.io'
  }

  const res = await api.post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  
  assert.strictEqual(res.body.likes, 0)
})

test.only('verifies 400 status response if title or url missing from request data', async () => {
  const newBlog = {
    author: 'Developer',
    url: 'https://dev.io'
  }

  const res = await api.post('/api/blogs')
    .send(newBlog)
    .expect(400)
    .expect('Content-Type', /application\/json/)
  
  assert.strictEqual(res.body.message, 'title or url validation failed')
})

after(async () => {
  await mongoose.connection.close()
})
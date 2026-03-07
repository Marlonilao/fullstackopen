const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./blog_helper')
const Blog = require('../models/blog')
const assert = require('node:assert')
const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('blog list application returns the correct amount of blog posts in the JSON format', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
    .expect((response) => {
      assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })
})

test('unique identifier property of the blog posts is named id', async () => {
  const blogs = await helper.blogsInDb()

  blogs.forEach((blog) => {
    assert.strictEqual(Object.hasOwn(blog, 'id'), true)
  })
})

test('making an HTTP POST request to the /api/blogs URL successfully creates a new blog post', async () => {
  const newBlog = {
    title: 'Blog 3',
    author: 'Author for blog 3',
    url: 'blog3.com',
    likes: 300,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', 'application/json; charset=utf-8')

  const blogs = await api.get('/api/blogs')

  // console.log('blogs.body', blogs.body)
  // console.log('blogs.body.length', blogs.body.length)
  // console.log('helper.length + 1', helper.initialBlogs.length + 1)
  assert.strictEqual(blogs.body.length, helper.initialBlogs.length + 1)

  const titles = blogs.body.map((blog) => blog.title)

  assert(titles.includes('Blog 3'))
})

after(async () => {
  await mongoose.connection.close()
})

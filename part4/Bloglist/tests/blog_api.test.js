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

after(async () => {
  await mongoose.connection.close()
})

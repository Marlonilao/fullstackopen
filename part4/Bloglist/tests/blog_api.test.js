const { test, after, beforeEach, describe } = require('node:test')
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

test('if the likes property is missing from the request, it will default to the value 0', async () => {
  const newBlog = {
    title: 'Blog 3',
    author: 'Author for blog 3',
    url: 'blog3.com',
  }

  await api.post('/api/blogs').send(newBlog)

  const blogToBeTested = await Blog.findOne({ title: 'Blog 3' })

  // console.log('blogToBeTested', blogToBeTested)
  assert.strictEqual(blogToBeTested.likes, 0)
})

describe('returns 400 if title or url is missing', () => {
  test('returns 400 if title is missing', async () => {
    const newBlog = {
      author: 'Author',
      url: 'url',
      likes: 0,
    }

    await api.post('/api/blogs').send(newBlog).expect(400)
  })

  test('returns 400 if url is missing', async () => {
    const newBlog = {
      title: 'title',
      author: 'author',
      likes: 0,
    }

    await api.post('/api/blogs').send(newBlog).expect(400)
  })
})

test('deleting a single blog post resource', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToBeDeleted = blogsAtStart[0]
  const blogToBeDeletedTitle = blogsAtStart[0].title

  await Blog.findByIdAndDelete(blogToBeDeleted.id)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

  const titles = blogsAtEnd.map((blog) => blog.title)
  assert(!titles.includes(blogToBeDeletedTitle))
})

after(async () => {
  await mongoose.connection.close()
})

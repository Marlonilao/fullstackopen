const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  const body = request.body
  if (!body.title || !body.url) {
    response.status(400).json({ error: 'title or url missing' })
  } else {
    const blog = new Blog(body)
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
  }
})

module.exports = blogRouter

const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

// const getTokenFrom = (request) => {
//   const authorization = request.get('authorization')
//   if (authorization && authorization.startsWith('Bearer ')) {
//     return authorization.replace('Bearer ', '')
//   }
//   return null
// }

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  const body = request.body

  if (!body.title || !body.url) {
    return response.status(400).json({ error: 'title or url missing' })
  }

  if (!request.token) {
    return response.status(401).json({ error: 'token missing' })
  }

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = request.user

  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  } else {
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user.id,
    })

    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id.toString())
    await user.save()

    response.status(201).json(savedBlog)
  }
})

blogRouter.delete('/:id', async (request, response) => {
  // if (!request.token) {
  //   return response.status(401).json({ error: 'token missing' })
  // }

  // const decodedToken = jwt.verify(request.token, process.env.SECRET)
  // if (!decodedToken.id) {
  //   return response.status(401).json({ error: 'token invalid' })
  // }

  const user = request.user
  const blog = await Blog.findById(request.params.id)

  if (blog.user.toString() === user.id) {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } else {
    response
      .status(403)
      .json({ error: 'User is not authorized to delete this blog' })
  }
})

blogRouter.put('/:id', async (request, response) => {
  const blogToBeUpdated = await Blog.findById(request.params.id)

  if (!blogToBeUpdated) {
    return response.status(404).end()
  }

  blogToBeUpdated.likes += request.body.likes

  const updatedBlog = await blogToBeUpdated.save()
  response.json(updatedBlog)
})

module.exports = blogRouter

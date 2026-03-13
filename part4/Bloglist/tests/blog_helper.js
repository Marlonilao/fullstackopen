const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'Blog 1',
    author: 'Author for blog 1',
    url: 'blog1.com',
    likes: 100,
  },
  {
    title: 'Blog 2',
    author: 'Author for blog 2',
    url: 'blog2.com',
    likes: 200,
  },
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'willremovesoon',
    author: 'willremovesoon',
    url: 'willremovesoon',
    likes: 0,
  })

  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const usersInDb = async () => {
  const users = await User.find({})

  return users.map((user) => user.toJSON())
}

module.exports = { initialBlogs, blogsInDb, nonExistingId, usersInDb }

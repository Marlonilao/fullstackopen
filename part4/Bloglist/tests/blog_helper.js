const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'Blog 1',
    author: 'Author for blog 1',
    url: 'blog1.com',
    likes: 100,
  },
  {
    title: 'Blog 2',
    authro: 'Author for blog 2',
    url: 'blog2.com',
    likes: 200,
  },
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

module.exports = { initialBlogs, blogsInDb }

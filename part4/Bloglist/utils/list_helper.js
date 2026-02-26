const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.length === 0
    ? 0
    : blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.length === 0
    ? null
    : blogs.reduce((max, currentBlog) =>
        max.likes > currentBlog.likes ? max : currentBlog,
      )
}

const mostBlogs = (blogs) => {
  const blogCounts = {}

  for (let i = 0; i < blogs.length; i++) {
    if (blogCounts[blogs[i].author]) {
      blogCounts[blogs[i].author]++
    } else {
      blogCounts[blogs[i].author] = 1
    }
  }

  const result = { author: '', blogs: 0 }

  for (const author in blogCounts) {
    if (blogCounts[author] > result.blogs) {
      result.author = `${author}`
      result.blogs = blogCounts[author]
    }
  }

  return blogs.length === 0 ? null : result
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs }

import { useState } from 'react'

const Blog = ({ blog }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <div style={blogStyle}>
      {isExpanded ? (
        <>
          <p>
            Title: {blog.title}{' '}
            <button onClick={() => setIsExpanded(!isExpanded)}>hide</button>
          </p>
          <p>Url: {blog.url}</p>
          <p>
            Likes: {blog.likes} <button>like</button>
          </p>
          <p>Author: {blog.author}</p>
        </>
      ) : (
        <>
          Title: {blog.title} / Author: {blog.author}{' '}
          <button onClick={() => setIsExpanded(!isExpanded)}>View</button>
        </>
      )}
    </div>
  )
}

export default Blog

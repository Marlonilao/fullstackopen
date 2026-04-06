import { useState } from 'react'

const Blog = ({ blog, handleLike, handleDelete, user }) => {
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
        <div>
          <p className='title'>
            Title: {blog.title}{' '}
            <button onClick={() => setIsExpanded(!isExpanded)}>hide</button>
          </p>
          <p className='url'>Url: {blog.url}</p>
          <p className='likes'>
            Likes: {blog.likes}{' '}
            <button
              onClick={() =>
                handleLike(blog.id, {
                  likes: blog.likes + 1,
                })
              }
            >
              like
            </button>
          </p>
          <p className='author'>Author: {blog.author}</p>
          {user && user.username === blog.user.username ? (
            <div>
              <button
                type='button'
                style={{
                  backgroundColor: 'lightblue',
                  borderRadius: '20%',
                  border: '0',
                }}
                onClick={() => handleDelete(blog.id, blog.title, blog.author)}
              >
                remove
              </button>
            </div>
          ) : null}
        </div>
      ) : (
        <div>
          Title: {blog.title} / Author: {blog.author}{' '}
          <button onClick={() => setIsExpanded(!isExpanded)}>View</button>
        </div>
      )}
    </div>
  )
}

export default Blog

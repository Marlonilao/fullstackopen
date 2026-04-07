import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

const SingleBlog = ({ blogs, handleLike, handleDelete, user }) => {
  const { id } = useParams()
  const blog = blogs.find((b) => b.id === id)
  const navigate = useNavigate()

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const handleDeleteButton = () => {
    handleDelete(blog.id, blog.title, blog.author)
    navigate('/')
  }

  return (
    <div style={blogStyle}>
      <p className='title'>Title: {blog.title}</p>
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
            onClick={handleDeleteButton}
          >
            remove
          </button>
        </div>
      ) : null}
    </div>
  )
}

export default SingleBlog

import { Links, useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { Paper, Link, Button } from '@mui/material'

const SingleBlog = ({ blog, handleLike, handleDelete, user }) => {
  const navigate = useNavigate()

  const handleDeleteButton = async () => {
    await handleDelete(blog.id, blog.title, blog.author)
    navigate('/')
  }

  if (!blog) {
    return null
  }

  return (
    <Paper elevation={3} style={{ padding: '1rem', margin: '1rem 0' }}>
      <p className='title'>Title: {blog.title}</p>
      <Link href={blog.url} target='_blank' rel='noopener noreferrer'>
        Url: {blog.url}
      </Link>
      <p className='author'>Author: {blog.author}</p>
      <p className='likes'>
        Likes:
        {blog.likes}{' '}
        {user && (
          <Button
            variant='outlined'
            onClick={() =>
              handleLike(blog.id, {
                likes: blog.likes + 1,
              })
            }
          >
            like
          </Button>
        )}{' '}
        {user && user.username === blog.user.username ? (
          <Button
            variant='outlined'
            type='button'
            color='error'
            onClick={handleDeleteButton}
          >
            remove
          </Button>
        ) : null}
      </p>
    </Paper>
  )
}

export default SingleBlog

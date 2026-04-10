import { useState, useEffect, useRef } from 'react'
import LoginForm from './components/Login'
import CreateNew from './components/CreateNew'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import './index.css'
import { Routes, Route, Link, useMatch } from 'react-router-dom'
import SingleBlog from './components/SingleBlog'
import { Container, AppBar, Toolbar, Button, Typography } from '@mui/material'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)

  // useEffect(() => {
  //   blogService.getAll().then((blogs) => setBlogs(blogs))
  // }, [])

  const match = useMatch('/blogs/:id')
  const blog = match ? blogs.find((b) => b.id === match.params.id) : null

  useEffect(() => {
    const fetchData = async () => {
      const blogs = await blogService.getAll()
      setBlogs(blogs)
    }
    fetchData()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])

  const handleLogin = async (credentials) => {
    const { username, password } = credentials
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
    } catch {
      setMessage({
        text: 'Wrong username or password',
        type: 'error',
      })
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    blogService.setToken(null)
  }

  const handleCreateNew = async (blogInfo) => {
    const response = await blogService.create(blogInfo)

    setBlogs(blogs.concat(response))
    setMessage({
      text: `a new blog ${response.title} by ${response.author}`,
      type: 'success',
    })
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const handleLike = async (id, newLike) => {
    if (!user) {
      setMessage({
        text: 'You must be logged in to like a blog',
        type: 'error',
      })
      setTimeout(() => {
        setMessage(null)
      }, 5000)
      return
    }

    const response = await blogService.update(id, newLike)
    setBlogs(blogs.map((blog) => (blog.id === id ? response : blog)))
  }

  const handleDelete = async (id, title, author) => {
    console.log('id', id)
    if (window.confirm(`Remove blog ${title} by ${author}`)) {
      await blogService.deleteBlog(id)
      setBlogs(blogs.filter((blog) => blog.id !== id))
    } else {
      return
    }
  }

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  const padding = { padding: 5 }

  return (
    <Container>
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h5' component='div' sx={{ flexGrow: 1 }}>
            Blog App
          </Typography>
          <Button color='inherit' component={Link} to='/' style={padding}>
            blogs
          </Button>
          {user ? (
            <>
              <Button
                color='inherit'
                component={Link}
                to='/create'
                style={padding}
              >
                new blog
              </Button>
              <Button color='inherit' onClick={handleLogout} style={padding}>
                logout
              </Button>
            </>
          ) : (
            <Button
              color='inherit'
              component={Link}
              to='/login'
              style={padding}
            >
              login
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Notification message={message} />
      <Routes>
        <Route
          path='/create'
          element={<CreateNew handleCreateNew={handleCreateNew} />}
        />
        <Route
          path='/blogs/:id'
          element={
            <SingleBlog
              blog={blog}
              handleLike={handleLike}
              handleDelete={handleDelete}
              user={user}
            />
          }
        />
        <Route
          path='/'
          element={
            <div>
              <h2>blogs</h2>
              <ul id='blogList'>
                {sortedBlogs.map((blog) => (
                  <li key={blog.id}>
                    <Link to={`/blogs/${blog.id}`}>
                      {blog.title} by {blog.author}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          }
        />
        <Route
          path='/login'
          element={
            <div>
              <h2>log in to application</h2>
              <LoginForm handleLogin={handleLogin} />
            </div>
          }
        />
      </Routes>
    </Container>
  )
}

export default App

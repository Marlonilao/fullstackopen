import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/Login'
import CreateNew from './components/CreateNew'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)

  // useEffect(() => {
  //   blogService.getAll().then((blogs) => setBlogs(blogs))
  // }, [])

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

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      setMessage({
        content: 'Wrong username or password',
        isSuccess: false,
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

  const createNewRef = useRef()

  const handleCreateNew = async (blogInfo) => {
    createNewRef.current.toggleVisible()
    const response = await blogService.create(blogInfo)

    setBlogs(blogs.concat(response))
    setMessage({
      content: `a new blog ${response.title} by ${response.author}`,
      isSuccess: true,
    })
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const handleLike = async (id, newLike) => {
    const response = await blogService.update(id, newLike)
    setBlogs(blogs.map((blog) => (blog.id === id ? response : blog)))
  }

  const handleDelete = async (id, title, author) => {
    if (window.confirm(`Remove blog ${title} by ${author}`)) {
      await blogService.deleteBlog(id)
      setBlogs(blogs.filter((blog) => blog.id !== id))
    } else {
      return
    }
  }

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  // console.log(
  //   'blog.user.username',
  //   blogs.map((blog) => blog.user.username),
  // )
  // console.log('user.username', user.username)

  return (
    <div>
      <Notification message={message} />
      {!user && (
        <div>
          <h2>log in to application</h2>
          {
            <LoginForm
              handleLogin={handleLogin}
              username={username}
              password={password}
              setUsername={setUsername}
              setPassword={setPassword}
            />
          }
        </div>
      )}

      {user && (
        <div>
          <h2>blogs</h2>
          <p>
            {user.name} logged in{' '}
            <button type='button' onClick={handleLogout}>
              logout
            </button>
          </p>
          <Togglable buttonLabel='create new blog' ref={createNewRef}>
            <CreateNew handleCreateNew={handleCreateNew} />
          </Togglable>
          <div>
            {sortedBlogs.map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                handleLike={handleLike}
                handleDelete={handleDelete}
                user={user}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default App

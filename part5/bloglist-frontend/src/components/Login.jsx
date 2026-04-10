import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextField, Button } from '@mui/material'

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    handleLogin({ username, password })
    navigate('/')
    setUsername('')
    setPassword('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <TextField
          id='standard-basic'
          label='username'
          variant='standard'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <TextField
          id='standard-basic'
          label='password'
          variant='standard'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <Button variant='contained' style={{ marginTop: 10 }} type='submit'>
        login
      </Button>
    </form>
  )
}

export default LoginForm

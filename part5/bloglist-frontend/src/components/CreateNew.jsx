import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextField, Button } from '@mui/material'

const CreateNew = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    await props.handleCreateNew({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
    navigate('/')
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create New</h2>
      <div>
        <TextField
          id='outlined-basic'
          label='title'
          variant='outlined'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin='dense'
          sx={{ width: 450 }}
        />
      </div>
      <div>
        <TextField
          id='outlined-basic'
          label='author'
          variant='outlined'
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          margin='dense'
          sx={{ width: 450 }}
        />
      </div>
      <div>
        <TextField
          id='outlined-basic'
          label='url'
          variant='outlined'
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          margin='dense'
          sx={{ width: 450 }}
        />
      </div>
      <Button variant='contained' style={{ marginTop: 10 }} type='submit'>
        Create
      </Button>
    </form>
  )
}

export default CreateNew

import Togglable from './Togglable'

const CreateNew = (props) => {
  return (
    <Togglable buttonLabel='create new blog'>
      <form onSubmit={props.handleCreateNew}>
        <h2>Create New</h2>
        <div>
          <label>
            title:{' '}
            <input
              type='text'
              value={props.title}
              onChange={props.handleTitleChange}
            />
          </label>
        </div>
        <div>
          <label>
            author:{' '}
            <input
              type='text'
              value={props.author}
              onChange={props.handleAuthorChange}
            />
          </label>
        </div>
        <div>
          <label>
            url:{' '}
            <input
              type='text'
              value={props.url}
              onChange={props.handleUrlChange}
            />
          </label>
        </div>
        <button type='submit'>Create</button>
      </form>
    </Togglable>
  )
}

export default CreateNew

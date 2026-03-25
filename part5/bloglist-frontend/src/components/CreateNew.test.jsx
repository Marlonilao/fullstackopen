import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateNew from './CreateNew'

test('form calls the event handler it received as props with the right details when a new blog is created', async () => {
  const mockHandler = vi.fn()
  render(<CreateNew handleCreateNew={mockHandler} />)

  const user = userEvent.setup()
  const titleInput = screen.getByLabelText('title:')
  const authorInput = screen.getByLabelText('author:')
  const urlInput = screen.getByLabelText('url:')
  const button = screen.getByText('Create')

  await user.type(titleInput, 'blog title')
  await user.type(authorInput, 'blog author')
  await user.type(urlInput, 'blog url')

  await user.click(button)

  expect(mockHandler).toHaveBeenCalledTimes(1)
  expect(mockHandler).toHaveBeenCalledWith({
    title: 'blog title',
    author: 'blog author',
    url: 'blog url',
  })
})

import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

test('renders title and author but not url or likes by default', () => {
  const blog = {
    title: 'blog title',
    author: 'blog author',
    url: 'blog url',
    likes: 1,
  }

  const { container } = render(<Blog blog={blog} />)

  const titleAndAuthor = screen.getByText(
    /Title: blog title \/ Author: blog author/,
  )

  const url = container.querySelector('.url')
  const likes = container.querySelector('.likes')

  expect(titleAndAuthor).toBeInTheDocument()
  expect(url).not.toBeInTheDocument()
  expect(likes).not.toBeInTheDocument()
})

test("blog's URL and number of likes are shown when the button controlling the shown details has been clicked", async () => {
  const blog = {
    title: 'blog title',
    author: 'blog author',
    url: 'blog url',
    likes: 1,
    user: { username: 'asd', name: 'asd' },
  }

  const userObject = { username: 'asd', name: 'asd' }

  const { container } = render(<Blog blog={blog} user={userObject} />)

  const user = userEvent.setup()
  const button = screen.getByText('View')
  await user.click(button)

  const url = container.querySelector('.url')
  const likes = container.querySelector('.likes')
  expect(url).toBeInTheDocument()
  expect(likes).toBeInTheDocument()
})

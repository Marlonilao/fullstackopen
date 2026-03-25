import { render, screen } from '@testing-library/react'
import Blog from './Blog'

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

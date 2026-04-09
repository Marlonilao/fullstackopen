const loginWith = async (page, username, password) => {
  await page.getByText('login').click()
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByLabel('title').fill(title)
  await page.getByLabel('author').fill(author)
  await page.getByLabel('url').fill(url)
  await page.getByRole('button', { name: 'Create' }).click()
  await page
    .getByRole('link', { name: 'test blog 1 by Test User 01' })
    .waitFor()
}

export { loginWith, createBlog }

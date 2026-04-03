const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')
const { log } = require('node:console')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Test User 01',
        username: 'testUser01',
        password: 'test1234',
      },
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('log in to application')).toBeVisible()
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'testUser01', 'test1234')

      await expect(page.getByText('Test User 01 logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'testUser01', 'wrongpassword')

      await expect(page.getByText('Wrong username or password')).toBeVisible()
      await expect(page.getByText('Test User 01 logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'testUser01', 'test1234')
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await createBlog(page, 'test blog 1', 'Test User 01', 'testblog1.com')

      await expect(
        page.getByText('Title: test blog 1 / Author: Test User 01'),
      ).toBeVisible()
      await expect(page.locator('#blogList > *')).toHaveCount(1)
    })

    test('a blog can be liked', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await createBlog(page, 'test blog 1', 'Test User 01', 'testblog1.com')

      // const blog = page.getByText('Title: test blog 1 / Author: Test User 01')
      // await blog.getByRole('button', { name: 'View' }).click()
      // const likes = page.getByText('Likes: 0')
      // await likes.getByRole('button', { name: 'like' }).click()

      const blogItem = page.locator('#blogList > :first-child')
      await blogItem.getByRole('button', { name: 'View' }).click()
      await blogItem.getByRole('button', { name: 'like' }).click()
      await expect(blogItem.getByText('Likes: 1')).toBeVisible()
    })

    test('a blog can be deleted by the user who created it', async ({
      page,
    }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await createBlog(page, 'test blog 1', 'Test User 01', 'testblog1.com')

      const blog = page.getByText('Title: test blog 1 / Author: Test User 01')
      await blog.getByRole('button', { name: 'View' }).click()
      await page.once('dialog', async (dialog) => {
        await dialog.accept()
      })
      await page
        .locator('#blogList > :first-child')
        .getByRole('button', { name: 'remove' })
        .click()

      await expect(page.locator('#blogList > *')).toHaveCount(0)
    })
  })

  describe('with multiple users and blogs', () => {
    beforeEach(async ({ page, request }) => {
      await request.post('http://localhost:3003/api/users', {
        data: {
          name: 'Test User 02',
          username: 'testUser02',
          password: 'test1234',
        },
      })
    })

    test.only("only the user who added the blog sees the blog's delete button", async ({
      page,
    }) => {
      // User 01 creates a blog and should see the delete button for that blog
      await loginWith(page, 'testUser01', 'test1234')
      await page.getByRole('button', { name: 'create new blog' }).click()
      await createBlog(page, 'test blog 1', 'Test User 01', 'testblog1.com')
      const blogItem = page.locator('#blogList > :first-child')
      await blogItem.getByRole('button', { name: 'View' }).click()
      await expect(
        blogItem.getByRole('button', { name: 'remove' }),
      ).toBeVisible()

      // User 02 logs in and should not see the delete button for the blog created by User 01
      await page.getByRole('button', { name: 'Logout' }).click()
      await loginWith(page, 'testUser02', 'test1234')
      await blogItem.getByRole('button', { name: 'View' }).click()
      await expect(
        blogItem.getByRole('button', { name: 'remove' }),
      ).not.toBeVisible()
    })
  })
})

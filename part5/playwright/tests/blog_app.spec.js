const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

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
      await expect(page.getByText('Test User 01 logged in')).toHaveCount(0)
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
      await expect(page.locator('#blogList')).toHaveCount(1)
    })
  })
})

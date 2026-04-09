const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')
const { log } = require('node:console')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Test User 01',
        username: 'testUser01',
        password: 'test1234',
      },
    })

    await page.goto('/')
  })

  test.only('Login form is shown', async ({ page }) => {
    await page.getByText('login').click()
    await expect(page.getByText('log in to application')).toBeVisible()
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('login', () => {
    test.only('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'testUser01', 'test1234')

      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()

      // await expect(page.getByText('Test User 01 logged in')).toBeVisible()
    })

    test.only('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'testUser01', 'wrongpassword')

      await expect(page.getByText('Wrong username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'testUser01', 'test1234')
    })

    test.only('a new blog can be created', async ({ page }) => {
      await page.getByText('new blog').click()
      await createBlog(page, 'test blog 1', 'Test User 01', 'testblog1.com')

      await expect(
        page.getByRole('link', { name: 'test blog 1 by Test User 01' }),
      ).toBeVisible()
      await expect(page.locator('#blogList > *')).toHaveCount(1)
    })

    test.only('a blog can be liked', async ({ page }) => {
      await page.getByText('new blog').click()
      await createBlog(page, 'test blog 1', 'Test User 01', 'testblog1.com')

      await page
        .getByRole('link', { name: 'test blog 1 by Test User 01' })
        .click()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('Likes: 1')).toBeVisible()
    })

    test.only('a blog can be deleted by the user who created it', async ({
      page,
    }) => {
      await page.getByText('new blog').click()
      await createBlog(page, 'test blog 1', 'Test User 01', 'testblog1.com')

      await page
        .getByRole('link', { name: 'test blog 1 by Test User 01' })
        .click()
      await page.once('dialog', async (dialog) => {
        await dialog.accept()
      })
      await page.getByRole('button', { name: 'remove' }).click()

      await expect(page.locator('#blogList > *')).toHaveCount(0)
    })
  })

  describe('with multiple users and blogs', () => {
    beforeEach(async ({ page, request }) => {
      await request.post('api/users', {
        data: {
          name: 'Test User 02',
          username: 'testUser02',
          password: 'test1234',
        },
      })
    })

    test("only the user who added the blog sees the blog's delete button", async ({
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
      await page.getByRole('button', { name: 'logout' }).click()
      await loginWith(page, 'testUser02', 'test1234')
      await blogItem.getByRole('button', { name: 'View' }).click()
      await expect(
        blogItem.getByRole('button', { name: 'remove' }),
      ).not.toBeVisible()
    })

    test('blogs are arranged in the order according to the likes, the blog with the most likes first', async ({
      page,
    }) => {
      // User 01 creates two blogs
      await loginWith(page, 'testUser01', 'test1234')
      await page.getByRole('button', { name: 'create new blog' }).click()
      await createBlog(page, 'test blog 1', 'Test User 01', 'testblog1.com')
      await page.getByRole('button', { name: 'create new blog' }).click()
      await createBlog(page, 'test blog 2', 'Test User 01', 'testblog2.com')

      // User 02 logs in and likes the second blog twice and the first blog once
      await page.getByRole('button', { name: 'logout' }).click()
      await loginWith(page, 'testUser02', 'test1234')

      const firstBlogItem = page
        .locator('#blogList > *')
        .filter({ hasText: 'test blog 1' })
      const secondBlogItem = page
        .locator('#blogList > *')
        .filter({ hasText: 'test blog 2' })

      await secondBlogItem.getByRole('button', { name: 'View' }).click()
      await secondBlogItem.getByRole('button', { name: 'like' }).click()
      await expect(secondBlogItem).toContainText('Likes: 1')
      await secondBlogItem.getByRole('button', { name: 'like' }).click()
      await expect(secondBlogItem).toContainText('Likes: 2')

      await firstBlogItem.getByRole('button', { name: 'View' }).click()
      await firstBlogItem.getByRole('button', { name: 'like' }).click()
      await expect(firstBlogItem).toContainText('Likes: 1')

      // The second blog should now be the first in the list and the first blog should be the second
      await expect(page.locator('#blogList > :first-child')).toContainText(
        'test blog 2',
      )
      await expect(page.locator('#blogList > :nth-child(2)')).toContainText(
        'test blog 1',
      )
    })

    describe.only('single blog view', () => {
      test('Blog information and the number of likes are displayed to unauthenticated users, buttons are not displayed', async ({
        page,
        request,
      }) => {
        // Create a blog as an authenticated user
        await loginWith(page, 'testUser01', 'test1234')
        await page.getByText('new blog').click()
        await createBlog(page, 'test blog 1', 'Test User 01', 'testblog1.com')

        // Log out to view the blog as an unauthenticated user
        await page.getByRole('button', { name: 'logout' }).click()

        // Click on the blog link to view the single blog view
        await page
          .getByRole('link', { name: 'test blog 1 by Test User 01' })
          .click()

        // Verify that the blog information and number of likes are displayed
        await expect(page.getByText('Title: test blog 1')).toBeVisible()
        await expect(page.getByText('Author: Test User 01')).toBeVisible()
        await expect(page.getByText('URL: testblog1.com')).toBeVisible()
        await expect(page.getByText('Likes: 0')).toBeVisible()

        // Verify that the like and remove buttons are not visible to unauthenticated users
        await expect(
          page.getByRole('button', { name: 'like' }),
        ).not.toBeVisible()
        await expect(
          page.getByRole('button', { name: 'remove' }),
        ).not.toBeVisible()
      })

      test('Authenticated users who are not the blog’s creator are shown only the like button', async ({
        page,
        request,
      }) => {
        // Create a blog as User 01
        await loginWith(page, 'testUser01', 'test1234')
        await page.getByText('new blog').click()
        await createBlog(page, 'test blog 1', 'Test User 01', 'testblog1.com')

        // Log out and log in as User 02
        await page.getByRole('button', { name: 'logout' }).click()
        await loginWith(page, 'testUser02', 'test1234')

        // Click on the blog link to view the single blog view
        await page
          .getByRole('link', { name: 'test blog 1 by Test User 01' })
          .click()

        // Verify that the like button is visible and the remove button is not visible to User 02
        await expect(page.getByRole('button', { name: 'like' })).toBeVisible()
        await expect(
          page.getByRole('button', { name: 'remove' }),
        ).not.toBeVisible()
      })

      test('Authenticated users who are the blog’s creator are shown both the like and remove buttons', async ({
        page,
        request,
      }) => {
        // Create a blog as User 01
        await loginWith(page, 'testUser01', 'test1234')
        await page.getByText('new blog').click()
        await createBlog(page, 'test blog 1', 'Test User 01', 'testblog1.com')

        // Click on the blog link to view the single blog view
        await page
          .getByRole('link', { name: 'test blog 1 by Test User 01' })
          .click()

        // Verify that both the like and remove buttons are visible to User 01
        await expect(page.getByRole('button', { name: 'like' })).toBeVisible()
        await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()
      })
    })
  })
})

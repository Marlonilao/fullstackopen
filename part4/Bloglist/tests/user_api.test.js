const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./user_helper')
const User = require('../models/user')
const assert = require('node:assert')
const bcrypt = require('bcrypt')
const api = supertest(app)

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({
      username: 'root',
      passwordHash,
    })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'asdsad',
      name: 'asdasd',
      password: 'secretpassword',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map((user) => user.username)
    assert(usernames.includes(newUser.username))
  })

  test('get all users in db', async () => {
    const usersInDb = await helper.usersInDb()

    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .expect((response) => {
        assert.deepStrictEqual(response.body, usersInDb)
      })
  })

  describe('returns status 400 if username or password is less than 3 characters long', () => {
    test('returns status 400 if username is less than 3 characters long', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'as',
        name: 'asdasd',
        password: 'asdasdasd',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()

      assert.strictEqual(usersAtStart.length, usersAtEnd.length)

      assert(
        result.body.error.includes(
          'username and password must be atleast 3 characters long',
        ),
      )
    })

    test('returns status 400 if password is less than 3 characters long', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'asdasd',
        name: 'asdasd',
        password: 'as',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()

      assert.strictEqual(usersAtStart.length, usersAtEnd.length)

      assert(
        result.body.error.includes(
          'username and password must be atleast 3 characters long',
        ),
      )
    })
  })

  test('username must be unique', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'asdad',
      password: 'asdasdsa',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtStart.length, usersAtEnd.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})

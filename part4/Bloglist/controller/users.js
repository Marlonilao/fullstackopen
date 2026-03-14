const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')

userRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (username.length < 3 || password.length < 3) {
    return response.status(400).json({
      error: 'username and password must be atleast 3 characters long',
    })
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

userRouter.get('/', async (request, response) => {
  const users = await User.find({})

  response.status(200).json(users)
})

module.exports = userRouter

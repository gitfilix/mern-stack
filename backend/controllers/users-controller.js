const HttpError = require('../models/http-error')
const e = require('express')
const { v4: uuidv4 } = require('uuid')

const DUMMY_USERS = [
  {
    id: "u1",
    name: "filiksi adamovski",
    email: "filiksi.adamovski@emailski.ro",
    password: "testikovski"
  }
]

const getUsers = (req, res, next) => {
  // for now just return the dummy
  res.json({ users: DUMMY_USERS })
}

const signup = (req, res, next) => {
  const { name, email, password } = req.body

  const hasUser = DUMMY_USERS.find(u => u.email === email)
  if( hasUser) {
    throw new HttpError('Could not create user, email already exists', 422)
  }


  const createdUser = {
    id: uuidv4(),
    name, 
    email,
    password
  }

  DUMMY_USERS.push(createdUser)
  res.status(201).json({user: createdUser})
}

const login = (req, res, next) => {
  const { email, password } = req.body
  console.log(email)
  console.log(password)
  // is the email the requested body mail
  const identifiedUser = DUMMY_USERS.find(u => u.email === email)
  if (!identifiedUser || identifiedUser !== password) {
    throw new HttpError('could not identify user, credentials seems to be wrong', 401)
  }
  res.json({message: 'Logged in!'})
}



exports.getUsers = getUsers
exports.signup = signup
exports.login = login
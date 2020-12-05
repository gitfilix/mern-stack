const { v4: uuidv4 } = require('uuid')
const HttpError = require('../models/http-error')
const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/user')
const user = require('../models/user')
const { isValidObjectId } = require('mongoose')


const getUsers = async (req, res, next) => {
  let users
  try {
    // find snytax: give back username , email but no password. 
    users = await User.find({}, '-password')

  } catch (err) {
    const error = new HttpError('fetching users falied, try again',500)
    return next(error)
  }
  res.json({users: users.map(user => user.toObject({ getters: true }))})
}

const signup = async (req, res, next) => {
  // first: valiation 
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(
      new HttpError('invalid or not data at all passed, please check input data', 422)
    )
  } 
  const { name, email, password } = req.body

  let existingUser
  try {
    // do not accept user with same email-adress by using findOne
    existingUser = await User.findOne({ email: email })
  } catch (err) {
    const error = new HttpError('Signing up failed try again later', 500)
    return next(error)
  }
  
  if (existingUser) {
    const error = new HttpError('User exists already, please login instead', 422)
    return next(error)
  }


  // hashed password pw-string, salt
  let hashedPassword
  try {
    hashedPassword = await bcrypt.hash(password, 12)
  } catch (err) {
    const error = new HttpError('could not creaate user password ', 500)
    return next(error)
  }

  // new User
  const createdUser = new User({
    name, 
    email,
    image: req.file.path,
    password: hashedPassword,
    places: []
  })

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, sorry', 500)
    return next(error)
  }

  // create jwt token on userId
  let token
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      'supersecret_dont_share_this',
      { expiresIn: '1h'}
    )
  } catch (err) {
    const error = new HttpError(
    'Signing up somehow failed, sorry', 500)
    return next(error)
  }

  res.status(201).json({userId: createdUser.id, email: createdUser.email, token: token })
}

const login = async (req, res, next) => {
  const { email, password } = req.body
 
  // check for an existing User
  let existingUser

  try {
    // do not accept user with same email-adress by using findOne
    existingUser = await User.findOne({ email: email })
  } catch (err) {
    const error = new HttpError('Login in failed. try again later', 500)
    return next(error)
  }

  //  if user not exisit  
  if(!existingUser) {
    const error = new HttpError('Invalid credetnials (!typos!), could not login. bad for you', 403)
    return next(error)
  }
  // check passwordhash of existing user is the same hash
  let isValidPassword = false
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password)
  } catch (err) {
    const error = new HttpError('could not match password, please enter correct pw', 500)
    return next(error)
  }

  if(!isValidPassword) {
    const error = new HttpError('invalid credentials, could not log you in', 403)
    return next(error)
  }

  // create jwt token on userId
  let token
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      'supersecret_dont_share_this',
      { expiresIn: '1h' }
    )
  } catch (err) {
    const error = new HttpError(
      'Login up somehow failed, sorry', 500)
    return next(error)
  }
  
  // must be a valid user then
  res.json({
   userId: existingUser.id,
   email: existingUser.email,
   token: token
  })
}


module.exports ={
  getUsers,
  signup,
  login
}
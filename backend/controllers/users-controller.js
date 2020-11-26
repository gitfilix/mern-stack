const { v4: uuidv4 } = require('uuid')
const HttpError = require('../models/http-error')
const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const user = require('../models/user')


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
    hashedPassword = await bcryptjs.hash(password, 12)
  } catch (err) {
    const error = new HttpError('could not creaate user password ', 500)
    return next(error)
  }

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

  res.status(201).json({user: createdUser.toObject({ getters: true }) })
}

const login = async (req, res, next) => {
  const { email, password } = req.body
  
  let existingUser

  try {
    // do not accept user with same email-adress by using findOne
    existingUser = await User.findOne({ email: email })
  } catch (err) {
    const error = new HttpError('Login in failed. try again later', 500)
    return next(error)
  }

  //  if user not exisitng or provided password is not the same as in the db
  if(!existingUser || existingUser.password !== password) {
    const error = new HttpError('Invalid credetnials, could not login. bad for you', 401)
    return next(error)
  }

  res.json({
    message: 'Logged in! thats good. groovy', 
    user: existingUser.toObject({getters: true})
  })
}


module.exports ={
  getUsers,
  signup,
  login
}
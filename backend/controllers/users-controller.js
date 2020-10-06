const { v4: uuidv4 } = require('uuid')
const HttpError = require('../models/http-error')
const { validationResult } = require('express-validator')
const User = require('../models/user')


const DUMMY_USERS = [
  {
    id: "u1",
    name: "filiksi adamovski",
    email: "filiksi.adamovski@emailski.ro",
    password: "testikovski"
  },
  {
    id: "u2",
    name: "testi",
    email: "test@test.ch",
    password: "test123"
  }
]

const getUsers = (req, res, next) => {
  // for now just return the dummy
  res.json({ users: DUMMY_USERS })
}

const signup = async (req, res, next) => {
  // first: valiation 
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(
      new HttpError('invalid or not data at all passed, please check input data', 422)
    )
  } 
  const { name, email, password, places } = req.body

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

  const createdUser = new User({
    name, 
    email,
    image: 'https://www.indianapoliszoo.com/wp-content/uploads/2018/04/Amur-tiger3-Fred-Cate.jpg',
    password,
    places
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

  res.json({message: 'Logged in! thats good. groovy'})
}


module.exports ={
  getUsers,
  signup,
  login
}
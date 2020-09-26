// continue here with video 99 !
const express = require('express')
const { check } = require('express-validator')
const usersControllers = require('../controllers/users-controller')
const router = express.Router()
// const HttpError = require('../models/http-error')


// GET register middleware on router
// 
router.get('/', usersControllers.getUsers)

// POST signup api/users/signup
// input checks
router.post('/signup', 
  [
    check('name')
      .not()
      .isEmpty(),
    check('email')
      .normalizeEmail()
      .isEmail(),
    check('password').isLength({ min: 6 })
  ],
usersControllers.signup
)

// POST login /api/users/login
router.post('/login', usersControllers.login)

module.exports = router
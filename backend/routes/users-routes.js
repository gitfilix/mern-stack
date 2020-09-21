// continue here with video 99 !
const express = require('express')
const router = express.Router()
// const HttpError = require('../models/http-error')

const usersControllers = require('../controllers/users-controller')

// GET register middleware on router
// 
router.get('/', usersControllers.getUsers)

// POST signup api/users/signup
router.post('/signup', usersControllers.signup)

// POST 
router.post('/login', usersControllers.login)

module.exports = router
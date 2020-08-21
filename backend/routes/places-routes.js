const express = require('express')
const router = express.Router()
// const HttpError = require('../models/http-error')

const placesControllers = require('../controllers/places-controller')

// register middleware on router
// /api/places/p1
router.get('/:pid', placesControllers.getPlacesById)

// api/places/user/u1
router.get('/user/:uid', placesControllers.getPlacesByUserId)


// export router with middlewares
module.exports = router
const express = require('express')
const router = express.Router()
// const HttpError = require('../models/http-error')

const placesControllers = require('../controllers/places-controller')

// GET register middleware on router
// /api/places/p1
router.get('/:pid', placesControllers.getPlacesById)

// GET api/places/user/u1
router.get('/user/:uid', placesControllers.getPlacesByUserId)

// POST api/places
router.post('/', placesControllers.createPlace)

// PATCH 
router.patch('/:pid', placesControllers.updatePlace)

// DELETE place
router.delete('/:pid', placesControllers.deletePlace)
// export router with middlewares
module.exports = router
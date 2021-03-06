const express = require('express')
const router = express.Router()
const { check, checkSchema } = require('express-validator')
// const HttpError = require('../models/http-error')

const placesControllers = require('../controllers/places-controller')
const fileUpload = require('../middleware/file-upload')
const checkAuth = require('../middleware/check-auth')

// up here: OPEN routes
// GET register middleware on router
// /api/places/p1
router.get('/:pid', placesControllers.getPlacesById)

// update place owned by a specified user 
// GET 'api/places/user/u1'
router.get('/user/:uid', placesControllers.getPlacesByUserId)

// down here: PROTECTED ROUTE
// handle check token in 
router.use(checkAuth)

// POST api/places
// check middleware for validation and fileupload
router.post('/',
        fileUpload.single('image'),
        [
          check('title')
            .not()
            .isEmpty(),
          check('description').isLength({min: 5}),
          check('address').not().isEmpty()
        ],
        placesControllers.createPlace)

// PATCH 
router.patch('/:pid', [
  check('title')
    .not()
    .isEmpty(),
    check('description').isLength( {min: 5} )
], placesControllers.updatePlace)

// DELETE place
router.delete('/:pid', placesControllers.deletePlace)
// export router with middlewares
module.exports = router
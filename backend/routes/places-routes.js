const express = require('express')
const router = express.Router()
const HttpError = require('../models/http-error')

// dummy data
const DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'hundefelsen',
    description: 'the nicest view from sigriswil',
    location: {
      lat:  40.7484474,
      lng: -74.9871531
    },
    address: '21 jump street',
    creator: 'u1'
  },
  {
    id: 'p2',
    title: 'bern bundesplatz',
    description: 'das ist lustig im sommer mit kindern',
    location: {
      lat: 20.7484474,
      lng: -41.9871531
    },
    address: 'Bundesplatz 1',
    creator: 'u1'
  }
]

// register middleware on router
// /api/places/p1

router.get('/:pid', (req, res, next) => {
  const placeId = req.params.pid // { pid: 'p1'}
  const place = DUMMY_PLACES.find( place => {
    return place.id === placeId
  })
  // if we RETURN res status then no other code will be execued
  if (!place) {
    throw new HttpError(`could not find place.. for that pid: ${placeId} `, 404)
  }
  res.json({ place: place }) // yea - you can shorten that...
})


router.get('/user/:uid', (req, res, next) => {
  const userId = req.params.uid // {uid: 'u1' }
  const place = DUMMY_PLACES.find( p => {
    return p.creator === userId  
  }) 
  // error handling asyncrounous
  if (!place) {
    return next(
      new HttpError('could not find place for the user id', 404)
    )
  }

  res.json({ place })
})


// export router with middlewares
module.exports = router
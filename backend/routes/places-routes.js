const express = require('express')

const router = express.Router()

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
  }
]

// register middleware on router
// /api/places/p1

router.get('/:pid', (req, res, next) => {
  const placeId = req.params.pid // { pid: 'p1'}
  const place = DUMMY_PLACES.find( p => {
    return p.id === placeId
  } )
  console.log('GET request on places')
  res.json({ place: place })
})



// export router with middlewares
module.exports = router
const { v4: uuidv4 } = require('uuid')
const HttpError = require('../models/http-error')
const getCoordsForAddress = require('../util/location')
const { validationResult } = require('express-validator')


// dummy data
let DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'hundefelsen',
    description: 'the nicest view from sigriswil',
    location: {
      lat: 40.7484474,
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
    creator: 'u2'
  },
  {
    id: 'p3',
    title: 'bern victoriaplatz',
    description: 'thats a view of berne',
    location: {
      lat: 20.7484474,
      lng: -41.9871531
    },
    address: 'Victoriaplatz 1',
    creator: 'u2'
  }
]

const getPlacesById = (req, res, next) => {
  const placeId = req.params.pid // { pid: 'p1'}
  const place = DUMMY_PLACES.find(place => {
    return place.id === placeId
  })
  // if we RETURN res status then no other code will be execued
  if (!place) {
    throw new HttpError(`could not find place.. for that pid: ${placeId} `, 404)
  }

  res.json({ place: place }) // yea - you can shorten that...
}


const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.uid // {uid: 'u1' }
  const places = DUMMY_PLACES.filter(p => {
    return p.creator === userId
  })
  // error handling asyncrounous
  if (!places || places.lenght == 0 ) {
    return next(
      new HttpError('could not find places for the user id', 404)
    )
  }
  // return all places for that uid
  res.json({ places })
}

// POST req add a place: we asume the req-object is filled
// its parsed in the app.js with bodyparser to json 
const createPlace = async (req, res, next) => {
  
  //errors-obj from validator 
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    console.log(errors)
    next (new HttpError('invalid or not data at all passed, please check input data', 422))
  } 

  const { title, description, address, creator } = req.body

  // gets the coords from an adress in that utility helper
  let coordinates
  try {
    coordinates = await getCoordsForAddress(address)
  } catch (error) {
    return next(error)
  }
  // create a NEW obj
  const createdPlace = {
    id: uuidv4(), // creates a Id by that library
    title,
    description,
    location: coordinates,
    address,
    creator
  }
  // replace later
  DUMMY_PLACES.push(createdPlace) // or use unshift

  res.status(201).json(createdPlace) // 201 new status
}

const updatePlace = (req, res, next) => {
  // validation
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    console.log(errors)
    throw new HttpError('invalid or not data at all passed, please check input data', 422)
  } 

  const { title, description } = req.body
  const placeId = req.params.pid

  // best practice make a copy, (...rest ) edit copy, push back 
  const updatedPlace = { ...DUMMY_PLACES.find(p => p.id === placeId) }
  const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId)
  updatedPlace.title = title
  updatedPlace.description = description
  // replace at that index the original with the newly created obj
  DUMMY_PLACES[placeIndex] = updatedPlace

  res.status(200).json({place: updatedPlace})
}

const deletePlace = (req, res, next) => {
  const placeId = req.params.pid
  if (!DUMMY_PLACES.find(p => p.id === placeId)) {
    throw new HttpError('Could not find a place for that id.', 404)
  }
  // filter does return a new copy and we want everything
  // but the deleded pid - so return false for the to delete-candidate
  DUMMY_PLACES = DUMMY_PLACES.filter(p => p.pid !== placeId)
  res.status(200).json({ message: 'Deleted that place'})
}

// export methods
exports.getPlacesById = getPlacesById
exports.getPlacesByUserId = getPlacesByUserId
exports.createPlace = createPlace
exports.updatePlace = updatePlace
exports.deletePlace = deletePlace

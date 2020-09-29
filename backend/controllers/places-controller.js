const { v4: uuidv4 } = require('uuid')
const HttpError = require('../models/http-error')
const getCoordsForAddress = require('../util/location')
const { validationResult } = require('express-validator')

// model is a constructor function
const Place = require('../models/place')

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

const getPlacesById = async (req, res, next) => {
  const placeId = req.params.pid // { pid: 'p1'}
  let place

  try {
    // findById is mongoose-specific - place
    place = await Place.findById(placeId)
  } catch (err) {
    const error = new HttpError('something went wrong... could not find a place', 500)
    return next(error)
  }


  // if we RETURN res status then no other code will be execued
  if (!place) {
    const error = new HttpError(`could not find place.. for that pid: ${placeId} `, 404)
    return next(error)
  }

  res.json({ place: place.toObject( { getters: true }) }) // place object converted to normal js-object. getters: true = _id :id
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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { title, description, address, creator } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  // const title = req.body.title;
  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/400px-Empire_State_Building_%28aerial_view%29.jpg',
    creator
  });

  try {
    await createdPlace.save();
  } catch (err) {
    const error = new HttpError(
      'Creating place failed, so sorry', 500 )
    return next(error)
  }

  res.status(201).json({ place: createdPlace });
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

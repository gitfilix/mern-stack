const { v4: uuidv4 } = require('uuid')
const HttpError = require('../models/http-error')
const getCoordsForAddress = require('../util/location')
const { validationResult } = require('express-validator')
const mongoose = require('mongoose')
// const mongooseUniqueValidator = require('mongoose-unique-validator')

// model is a constructor function
const Place = require('../models/place')
const User = require('../models/user')

// find places for a given Place-ID
const getPlacesById = async (req, res, next) => {
  const placeId = req.params.pid // { pid: 'p1'}
  let place
  try {
    // findById is mongoose-specific - place
    place = await Place.findById(placeId)
  } catch (err) {
    const error = new HttpError('something went wrong...- could not find a place', 500)
    return next(error)
  }

  // if we RETURN res status then no other code will be execued
  if (!place) {
    const error = new HttpError(`could not find place.. for that pid: ${placeId} `, 404)
    return next(error)
  }
  
  // place object converted to normal js-object. getters: true = _id :id
  res.json({ place: place.toObject( { getters: true }) }) 
}

// 2.nd alternative approach (lection 137)
const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid // {uid: 'u1' }
  // let places
  let userWithPlaces
  try {
    // using mongoose specific method find() not mongo-db find. -> we get an array back 
    // now here: search User collection with findbyId (userId) 
    userWithPlaces = await User.findById(userId).populate('places')
  } catch (err) {
    const error = new HttpError('fetching userWithPlaces failed - try again', 500)
    return next(error)
  }

  // error handling asyncrounous
  if (!userWithPlaces || userWithPlaces.lenght == 0 ) {
    return next(
      new HttpError('could not find places for the user id', 404)
    )
  }

  // return all places for that uid
  res.json({ places: userWithPlaces.places.map(place => place.toObject({ getters: true })) })
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
    image: req.file.path,
    creator
  });

  // check if user for this places exists with his id
  let user

  try {
    user = await User.findById(creator)
  } catch (err) {
    const error = new HttpError('creating failed. because of user? ', 500)
    return next(error)
  } 
  // check, if user is in db
  if (!user) {
    const error = new HttpError('could not find a corresponding user for provided it', 404)
    return next(error)
  }
  console.log(user)

  try {
    // start transaction within a session:
    // save user and createdPlace
    const sess = await mongoose.startSession()
      sess.startTransaction()
      await createdPlace.save({ session: sess })
    // mongoose push: pushes place-id to user-collection
      user.places.push(createdPlace)
      await user.save({ session: sess })
    await sess.commitTransaction()

  } catch (err) {
    const error = new HttpError(
      'Creating place failed, so sorry', 500 )
    return next(error)
  }

  res.status(201).json({ place: createdPlace });
}


const updatePlace = async (req, res, next) => {
  // validation
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(
      new HttpError('invalid or not data at all passed, please check input data', 422)
    )
  } 

  const { title, description } = req.body
  const placeId = req.params.pid
  
  let place
  try {
    // findById is mongoose-specific - 
    place = await Place.findById(placeId)
  } catch (err) {
    const error = new HttpError('could not update place', 500 )
    return next(error)
  }

  place.title = title
  place.description = description
  // save updated
  try {
    await place.save()
  } catch (err) {
    const error = new HttpError('could not save updated place', 501)
    return next(error)
  }
  // return response 200 - updated place
  res.status(200).json({ place: place.toObject({ getters: true }) })
}
const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid

  let place
  // 1. find it from Place with populate WHERE user is creator 
  try {
    place = await Place.findById(placeId).populate('creator')
  } catch (err) {
    const error = new HttpError('Something went wrong, could not delete place.', 500)
    return next(error)
  }
  // 2. check if place even exists. 
  if (!place) {
    const error = new HttpError('Could not find place for this id.', 404)
    return next(error)
  }

  // 3. remofit from collection place WHERE creator have it in his array
  try {
    // create a mongoose session
    const sess = await mongoose.startSession()
    sess.startTransaction();
      await place.remove({ session: sess });
      // get access to another collection by place.creator.places 
      // mongoose.pull means put it off 
      place.creator.places.pull(place);
      await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete that ugly place.',
      500
    );
    return next(error);
  }
  // respond 200 after successfull deletion 
  res.status(200).json({ message: 'Deleted ugly place.' });
};

// export methods
exports.getPlacesById = getPlacesById
exports.getPlacesByUserId = getPlacesByUserId
exports.createPlace = createPlace
exports.updatePlace = updatePlace
exports.deletePlace = deletePlace

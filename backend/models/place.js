const mongoose = require('mongoose')

const Schema = mongoose.Schema

const placeSchema = new Schema({
  title: { type: String, required: true},
  description: { type: String, required: true},
  image: { type: String, required: true},
  adress: { type: String, required: true},
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  creator: { type: String, required: true } 
})

// model-method: returns a constructor function: singular 
// collection will be a called 'PlaceS'
module.exports = mongoose.model('Place', placeSchema)
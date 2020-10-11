const mongoose = require('mongoose')

const Schema = mongoose.Schema
// creator: this should correspond to a User.Id provided by mongo.DB 
// ref: 'User': connection to other collection called User (foreign key)
const placeSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User'}
})

// model-method: returns a constructor function: singular 
// collection Name in the mongo-DB will be a called 'Places' (db-overview)

module.exports = mongoose.model('Place', placeSchema)
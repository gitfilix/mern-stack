// model user
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  name: { type: String, reqired: true },
  email: { type: String, reqired: true, unique: true },
  password: {types: String, required: true, minlength: 6 },
  image: { type: String, required: true },
  places: { type: String, required: true }
})
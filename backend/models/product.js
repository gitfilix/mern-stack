const mongoose = require('mongoose')

// schema product

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true}
})

// schema model: name, and corresponding schema
module.exports = mongoose.model('Product', productSchema)
const mongoose = require('mongoose')
// create product from model
const Product = require('./models/product')
// connect to db
mongoose.connect('mongodb+srv://mongodbuser01:77nobigdeal88@cluster0.ajxtu.mongodb.net/products_test?retryWrites=true&w=majority')
  .then(() => {
    console.log('connected to database')
  }).catch(() => {
    console.log('connection to db failed')
  })


const createProduct = async (req, res, next) => {
  const createProduct = new Product({
    name: req.body.name,
    price: req.body.price
  })
  // if you have a mongoose model, you can use the method save here! nice!!
  const result = await createdProduct.save()

  res.json(result)
}

exports.createProduct = createProduct
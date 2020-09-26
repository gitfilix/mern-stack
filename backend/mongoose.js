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
  const createdProduct = new Product({
    name: req.body.name,
    price: req.body.price
  })
  // if you have a mongoose model, you can use the method save here! nice!!
  const result = await createdProduct.save()
  // convert the object of id to a string with .id-method
  // console.log(typeof createdProduct.id)
  // return result to the calling function
  res.json(result)
}

// get all products using 'mongoose-find' (returns an array of results)
const getProducts = async (req, res, next) => {
  const products = await Product.find().exec()
  res.json(products)
}



exports.createProduct = createProduct
exports.getProducts = getProducts
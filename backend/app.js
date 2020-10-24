// normaly called server.js 
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const placesRoutes = require('./routes/places-routes')
const usersRoutes = require('./routes/users-routes')
const HttpError = require('./models/http-error')
// everything is hanging on that complex app object
const app = express()

// must be before reacing routes: parse json from post payload
app.use(bodyParser.json())

// prevent CORS problems: change header for each
app.use((req, res, next) => {
  // allow Cors from all origins
  res.setHeader('Access-Control-Allow-Origin',
                 '*'
  )
  // set a new specific headers for different types - 
  // Authorization is NOT set default in the browser we can allow it here
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  )
  // allows HTTP methods
  res.setHeader('Access-Control-Allow-Methods',
                'GET, POST, PATCH, DELETE'
  )
  next()
})


app.use('/api/places', placesRoutes)
app.use('/api/users', usersRoutes) // => api/users

// middleware if a unvalid url route was entered - errorhandling
app.use((req, res, next) => {
  const error = new HttpError('Server: could not find this route, sorry...', 404)
  throw error
})

// special middleware for errorhandling (4 params)
app.use((error, req, res, next) => {
  // has a response been sent? 
  if (res.headerSent) {
    return next(error)
  }
  // no response sent - so check if an error
  // on the res object - else send a 500
  res.status(error.code || 500)
  // send back a err message
  res.json({ message: error.message || 'An error has occured have fun finding that one'})
})

// mongoose mongo- db connection to 
// old only for backend
// const connectUrl = 'mongodb+srv://mongodbuser01:77nobigdeal88@cluster0.ajxtu.mongodb.net/places?retryWrites=true&w=majority'
const connectUrl = 'mongodb+srv://mongodbuser01:77nobigdeal88@cluster0.ajxtu.mongodb.net/mern?retryWrites=true&w=majority'
const connectConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}

// connect() is a mongoose specific method with promise 
// startup logic first mongoose connection then app
mongoose.connect(connectUrl, connectConfig)
  // .connect('mongodb+srv://mongodbuser01:77nobigdeal88@cluster0.ajxtu.mongodb.net/places?retryWrites=true&w=majority')
  .then(() => {
    // start the app
    console.log('+++ mongo database: successfully connected +++')
    app.listen(5000)

  })
  .catch(err => {
    console.log('there is a connection error - is your ip whitelisted? ')
    console.log(err)
  })

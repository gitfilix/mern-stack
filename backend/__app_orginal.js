/* normaly called server.js 
const express = require('express')
const bodyParser = require('body-parser')

const placesRoutes = require('./routes/places-routes')
const usersRoutes = require('./routes/users-routes')
const HttpError = require('./models/http-error')
// everything is hanging on that complex app object
const app = express()

// must be before reacing routes: parse json from post payload
app.use(bodyParser.json())

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

app.listen(5000)
*/
// normaly called server.js 
const express = require('express')
const bodyParser = require('body-parser')

const placesRoutes = require('./routes/places-routes')
// everything is hanging on that complex app object

const app = express()

app.use('/api/places', placesRoutes)


app.listen(5000)
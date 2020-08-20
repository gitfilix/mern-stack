const express = require('express')
const router = express.Router()


// register middleware on router
router.get('/', (req, res, next) => {
  console.log('GET request on places')
  res.json({message: 'it should kinda work...'})
})



// export router with middlewares
module.exports = router
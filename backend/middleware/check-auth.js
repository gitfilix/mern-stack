const jwt = require('jsonwebtoken')
const HttpError = require('../models/http-error')

module.exports = (req, res, next) => {
  // because the browser sends default a OPTIONS-request: just continue
  if (req.method === 'OPTIONS') {
    return next()
  }
  // POST requests handling with token
  try {
    const token = req.headers.authorization.split(' ')[1] // Authorization: 'Bearer TOKEN' -> split(' ')[1] -> token
    if (!token) {
      throw new Error('Authentication failed! - no token', 403)
    }
    // verify token
    const decodedToken = jwt.verify(token, 'supersecret_dont_share_this')
    // the decodedToken is already verified - so authentication went well
    // add userData to the userId obj
    req.userData = {userId: decodedToken.userId}
    // continue on route-journey
    next()
  } catch (err) {
    // if not validated - throw this error
    const error = new HttpError('Authentication failed - other error!', 403)
    return next(error)
  }
}

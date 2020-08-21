// blueprint for error
class HttpError extends Error {
  constructor(message, errorCode) {
    super(message) // add a 'message' property
    this.code = errorCode // add a 'error-code' property

  }
}


module.exports = HttpError
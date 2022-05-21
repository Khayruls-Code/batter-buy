const ErrorHandaler = require("../utils/errorHandaler")

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.message = err.message || "Enternal server error"

  if (err.name === 'CastError') {
    const message = `Resource not found invailed: ${err.path}`
    err = new ErrorHandaler(message, 400)
  }

  res.status(404).json({
    success: false,
    message: err.message
  })
}
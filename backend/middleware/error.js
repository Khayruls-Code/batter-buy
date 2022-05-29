const ErrorHandaler = require("../utils/errorHandaler")

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.message = err.message || "Enternal server error"

  //cast error
  if (err.name === 'CastError') {
    const message = `Resource not found invailed: ${err.path}`
    err = new ErrorHandaler(message, 400)
  }

  //mongoose dublicate error
  if (err.code === 11000) {
    const message = `Dublicate ${Object.keys(err.keyValue)} entered`
    err = new ErrorHandaler(message, 400)
  }
  //JSON web token error
  if (err.name === "JsonWebTokenError") {
    const message = `Invailed json web token, Try again`
    err = new ErrorHandaler(message, 400)
  }
  //token expire token error
  if (err.name === "TokenExpiredError") {
    const message = `JSON Web Token is expired, Try again`
    err = new ErrorHandaler(message, 400)
  }

  res.status(404).json({
    success: false,
    message: err.message
  })
}
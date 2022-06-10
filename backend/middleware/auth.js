const catchAsyncError = require("./catchAsyncError");
const jwt = require('jsonwebtoken');
const ErrorHandaler = require("../utils/errorHandaler");
const User = require("../models/userModel");

exports.getAuthenTicateUser = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandaler("Login to access this resourse"), 401)
  }
  const decodedUser = jwt.verify(token, process.env.JWT_SECRET)
  req.user = await User.findById(decodedUser.id)
  next()
})

exports.checkRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorHandaler(`Role: ${req.user.role} is not allowed to access this resourse`, 403))
    }
    next()
  }
}
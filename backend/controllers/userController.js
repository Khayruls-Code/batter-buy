const catchAsyncError = require('../middleware/catchAsyncError')
const User = require('../models/userModel');
const ErrorHandaler = require('../utils/errorHandaler');
const tokenStore = require('../utils/jwtToken');

//register user
exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "f4f321fgh4dfg45d",
      url: "Avatar image"
    }
  })

  tokenStore(user, 201, res)
})

//login user
exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandaler("Please enter email and password"), 400)
  }

  const user = await User.findOne({ email: email }).select("+password")

  if (!user) {
    return next(new ErrorHandaler("Invailed email or password"), 401)
  }

  const isPasswordMatched = await user.comparePassword(password)

  if (!isPasswordMatched) {
    return next(new ErrorHandaler("Invailed email or password"), 401)
  }

  tokenStore(user, 200, res)
})

//logout user

exports.logoutUser = catchAsyncError(async (req, res, next) => {
  res.cookie('token', null, {
    expires: new Date(
      Date.now()
    ),
    httpOnly: true
  })

  res.status(200).json({
    success: true,
    message: "Logged out successfully"
  })
})
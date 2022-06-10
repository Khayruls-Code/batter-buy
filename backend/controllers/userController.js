const catchAsyncError = require('../middleware/catchAsyncError')
const User = require('../models/userModel');
const ErrorHandaler = require('../utils/errorHandaler');
const tokenStore = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require("crypto");

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

//forgate password
exports.forgatePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })

  if (!user) {
    return next(new ErrorHandaler("User not found", 404))
  }
  const resetToken = user.getResetPasswordToken()
  await user.save({ validateBeforeSave: false })

  const resetPasswordUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`

  const message = `Your password reset link is \n\n ${resetPasswordUrl} \n\n if you don't wont to change your password, please ignore`

  try {
    await sendEmail({
      email: user.email,
      subject: "Batter Buy Password Reset",
      message: message
    })

    res.status(200).json({
      success: true,
      message: `Reset password link sent to ${user.email}`
    })
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false })
    next(new ErrorHandaler(error.message, 500
    ))
  }
})


//reset password
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex")

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  })

  if (!user) {
    return next(new ErrorHandaler("Invailed reset password token or token is expired", 404))
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandaler("Passwords are not matched", 400))
  }

  user.password = req.body.password
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save()

  tokenStore(user, 200, res)
})

//get user details
exports.getUserDetails = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id)
  res.status(200).json({
    success: true,
    user
  })
})

//update user password
exports.updateUserPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password")
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword)
  if (!isPasswordMatched) {
    return next(new ErrorHandaler("Old Password is incorrect", 400))
  }

  if (req.body.newPassword !== req.body.conPassword) {
    return next(new ErrorHandaler("Passwords dose not matched", 400))
  }

  user.password = req.body.newPassword
  await user.save()

  tokenStore(user, 200, res)
})

//update user details
exports.updateUserDetails = catchAsyncError(async (req, res, next) => {
  const updateData = {
    name: req.body.name,
    email: req.body.email
  }
  ///we will use cloudinary to add avatar

  const user = await User.findByIdAndUpdate(req.user.id, updateData, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    message: "Details updated successfully",
    user
  })
})

//get all user ---admin
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find()
  res.status(200).json({
    success: true,
    users
  })
})

//get single user --admin
exports.getSingleUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id)
  if (!user) {
    return next(new ErrorHandaler(`User not found for id ${req.params.id}`))
  }
  res.status(200).json({
    success: true,
    user
  })
})

//update user role ---admin
exports.updateUserRole = catchAsyncError(async (req, res, next) => {
  const updateData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role
  }
  ///we will use cloudinary to add avatar

  const user = await User.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    message: "Details updated successfully",
    user
  })
})

//delete user admin
exports.deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id)
  if (!user) {
    return next(new ErrorHandaler(`User not found for id ${req.params.id}`))
  }
  //we will remove cloudinary

  await user.remove()

  res.status(200).json({
    success: true,
    message: "User Deleted Successfully"
  })
})
const Product = require('../models/productModel')
const ErrorHandaler = require('../utils/errorHandaler')
const catchAsyncError = require('../middleware/catchAsyncError')
const ProductFeatures = require('../utils/productFeatures')

//create product ---admin
exports.createProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.create(req.body)
  res.status(201).json({
    success: true,
    product
  })
})

//get all products
exports.getAllProducts = catchAsyncError(async (req, res) => {
  const pagePerView = 5;
  const productCount = await Product.countDocuments();
  const productFeatures = new ProductFeatures(Product.find(), req.query).search().filter().pagination(pagePerView);
  const products = await productFeatures.query
  res.status(200).json({
    success: true,
    products,
    productCount
  })
})

//get single product
exports.getSingleProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id)

  if (!product) {
    return next(new ErrorHandaler("Product not found", 404))
  }

  res.status(200).json({
    success: true,
    product
  })
});

//update product ---admin
exports.updateProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id)

  if (!product) {
    return next(new ErrorHandaler("Product not found", 404))
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })

  res.status(200).json({
    success: true,
    product
  })
});

//delete product ---admin
exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id)

  if (!product) {
    return next(new ErrorHandaler("Product not found", 404))
  }

  await product.remove()

  res.status(200).json({
    success: true,
    message: "Product deleted successfully"
  })
});
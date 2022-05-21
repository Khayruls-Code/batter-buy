const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter the product name"],
    trim: true
  },
  description: {
    type: String,
    required: [true, "Please enter product desciption"]
  },
  price: {
    type: Number,
    required: [true, "Please enter product price"],
    maxlength: [8, 'Product price cannot exceed 8 charecters']
  },
  rating: {
    type: Number,
    default: 0
  },
  images: [
    {
      public_id: {
        type: String,
        required: true
      },
      url: {
        type: String,
        required: true
      }
    },
  ],
  category: {
    type: String,
    required: [true, "Please enter product category"]
  },
  stock: {
    type: String,
    default: 1,
    maxlength: [true, 'Stock cannot sxceed 4 charecter']
  },
  numOfReviews: {
    type: Number,
    default: 0
  },
  reviews: [
    {
      name: {
        type: String,
        required: true
      },
      rating: {
        type: Number,
        required: true
      },
      comment: {
        type: String,
        required: true
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
})
const Product = mongoose.model('Product', productSchema)
module.exports = Product;
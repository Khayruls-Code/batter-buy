const express = require("express")
const errorMiddleware = require('./middleware/error')
const cookieParser = require("cookie-parser")

const app = express()

app.use(express.json())
app.use(cookieParser())

//product route import
const products = require('./routes/productRoute')
const user = require('./routes/userRoute')

app.use('/api/v1', products)
app.use('/api/v1', user)

//error middleware
app.use(errorMiddleware)

module.exports = app;
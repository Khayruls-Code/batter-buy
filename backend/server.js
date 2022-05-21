const app = require('./app')
const dotenv = require("dotenv")
const connectWithDatabase = require('./config/database')

//uncaught Exception error
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`)
  console.log('Sutting down the server due to uncaught Exception')
  process.exit(1)
})

//dotenv config
dotenv.config({ path: "backend/config/config.env" })

//database connection
connectWithDatabase()

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`)
})

//unhandle rejection error
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`)
  console.log('Sutting down the server due to unhandle promise rejection')

  server.close(() => {
    process.exit(1)
  })
})
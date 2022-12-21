const express = require("express")
const app = express()
const helmet = require("helmet")
const sanitize = require("express-mongo-sanitize")
require("dotenv").config({ path: "./config/.env" })
require("./config/mgdb")
const saucesRoutes = require("./routes/sauce")
const userRoutes = require("./routes/user")
const path = require("path")

// CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  )
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS, PATCH"
  )
  next()
})

app.use(express.json())

// MIDDLEWARE DEBUT DE ROUTE
app.use("/images", express.static(path.join(__dirname, "images")))
app.use("/api/auth", userRoutes)
app.use("/api/sauces", saucesRoutes)

module.exports = app

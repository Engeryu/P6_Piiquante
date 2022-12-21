const express = require("express")
const router = express.Router()
const raterLimit = require("express-rate-limit")

const limiter = raterLimit({
  windowMs: 5 * 60 * 1000,
  max: 50,
})

const userCtrl = require("../controllers/user")

// ROUTES USER
router.post("/signup", userCtrl.signup)

router.post("/login", limiter, userCtrl.login)

module.exports = router

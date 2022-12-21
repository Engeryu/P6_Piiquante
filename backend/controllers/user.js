const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/User")

// LOGIQUE SIGNUP
exports.signup = (req, res, next) => {
  const passwordValidator = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/

  if (passwordValidator.test(req.body.password)) {
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        })
        user.save()
          .then(() => res.status(201).json({ error: 'Utilisateur créé !' }))
          .catch(() => res.status(400).json({ error: "L'adresse mail renseignée est déjà utilisée." }))
      })
      .catch(error => res.status(500).json({ error }))
  }
  else {
    res.status(400).json({ message: "Le mot de passe doit faire une taille de 8 caractères et doit obligatoirement contenir : 1 majuscule + 1 minuscule + 1 chiffre + 1 symbole" })
  }
}

// LOGIQUE LOGIN
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error })
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: 'L\'utilisateur et/ou le mot passe est incorrect'  })
          }
          res.status(201).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              process.env.TOKEN_RANDOM,
              { expiresIn: process.env.TOKEN_TEMP }
            ),
          })
        })
        .catch((error) => res.status(500).json({ error }))
    })
    .catch((error) => res.status(500).json({ error }))
}

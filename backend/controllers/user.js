const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const validator = require("validator")
const requirement = require("../models/Password")

// LOGIQUE SIGNUP
exports.signup = (req, res, next) => {
  const valideEmail = validator.isEmail(req.body.email);
  const validePassword = requirement.validate(req.body.password);
  if (valideEmail === true && validePassword === true) {
    bcrypt
      .hash(req.body.password, 10)
      .then((hash) => {
        const user = new User({
          email: req.body.email,
          password: hash,
        });
        user
          .save()
          .then(() =>
            res
              .status(201)
              .json({ message: "Utilisateur créé !" })
          )
          .catch((error) => res.status(400).json({ error }));
      })
      .catch((error) => res.status(500).json({ error }));
  } else {
    console.log("Email ou mot de passe non conforme");
    return res.status(401).json({ error : 'Email ou mot de passe non conforme'})
  }
};    

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

const Sauce = require("../models/Sauce")
const fs = require("fs")
const format = require("../middleware/multer-config")

// LOGIQUE GETALLSAUCE
exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces)
    })
    .catch((error) => res.status(400).json({ error }))
}

// LOGIQUE GETONESAUCE
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }))
}

// LOGIQUE CREATESAUCE
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce)
  const initialisation = {
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  }
  if (sauceObject.userId !== req.auth.userId) {
    return res.status(403).json("unauthorized request")
  } else if (
    format
  ) {
    const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename
        }`,
      ...initialisation,
    })
    if (sauce.heat < 0 || sauce.heat > 10) {
      sauce.heat = 0
      console.log("valeur heat invalide, heat initialisé")
    }
    sauce
      .save()
      .then(() =>
        res
          .status(201)
          .json({ message: "POST sauce enregistrée !" })
      )
      .catch((error) => res.status(400).json({ error }))
  } else {
    return res.status(400).json({ error : 'Format d\'image incorrect'})
  }
}

// LOGIQUE MODIFYSAUCE
exports.modifySauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      var sauceBot
      const heatAvant = sauce.heat
      const immuable = {
        userId: req.auth.userId,
        likes: sauce.likes,
        dislikes: sauce.dislikes,
        usersLiked: sauce.usersLiked,
        usersDisliked: sauce.usersDisliked,
      }
      if (sauce.userId !== req.auth.userId) {
        return res.status(403).json("unauthorized request")
      } else if (req.file) {
        if (
          format
        ) {
          const filename = sauce.imageUrl.split("/images/")[1]
          const newImage = ''
          if (newImage != filename) {
            fs.unlink(`images/${filename}`, () => { })
          }
          const sauceObject = {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename
              }`,
            ...immuable,
          }
          sauceBot = sauceObject
        } else {
          return res.status(400).json({ error : 'Format d\'image incorrect'})
        }
      } else {
        req.body.imageUrl = sauce.imageUrl
        const sauceObject = {
          ...req.body,
          ...immuable,
        }
        sauceBot = sauceObject
      }
      if (sauceBot.heat < 0 || sauceBot.heat > 10) {
        sauceBot.heat = heatAvant
        console.log("valeur heat invalide, ancienne valeur heat conservée")
      }
      Sauce.updateOne(
        { _id: req.params.id },
        { ...sauceBot, _id: req.params.id }
      )
        .then(() =>
          res
            .status(201)
            .json({ message: "Objet modifié !" })
        )
        .catch((error) => res.status(400).json({ error }))
    })
    .catch((error) => {
      if (req.file) {
        fs.unlink(`images/${req.file.filename}`, () => { })
      }
      res.status(404).json({ error })
    })
}

// LOGIQUE DELETESAUCE
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const nomImage = sauce.imageUrl
      const imDefaut = ''
      if (sauce.userId !== req.auth.userId) {
        return res.status(403).json("unauthorized request")
      } else if (nomImage != imDefaut) {
        const filename = sauce.imageUrl.split("/images/")[1]
        fs.unlink(`images/${filename}`, () => {

          Sauce.deleteOne({ _id: req.params.id })
            .then(() =>
              res
                .status(200)
                .json({ message: "sauce supprimée !" })
            )
            .catch((error) => res.status(400).json({ error }))
        })
      } else {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() =>
            res
              .status(200)
              .json({ message: "sauce supprimée !" })
          )
          .catch((error) => res.status(400).json({ error }))
      }
    })
    .catch((error) => res.status(404).json({ error }))
}

// LOGIQUE LIKESAUCE
exports.likeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      let valeurVote
      let votant = req.body.userId
      let like = sauce.usersLiked
      let unlike = sauce.usersDisliked
      let bon = like.includes(votant)
      let mauvais = unlike.includes(votant)
      if (bon === true) {
        valeurVote = 1
      } else if (mauvais === true) {
        valeurVote = -1
      } else {
        valeurVote = 0
      }
      if (valeurVote === 0 && req.body.like === 1) {
        sauce.likes += 1
        sauce.usersLiked.push(votant)
      } else if (valeurVote === 1 && req.body.like === 0) {
        sauce.likes -= 1
        const nouveauUsersLiked = like.filter((f) => f != votant)
        sauce.usersLiked = nouveauUsersLiked
      } else if (valeurVote === -1 && req.body.like === 0) {
        sauce.dislikes -= 1
        const nouveauUsersDisliked = unlike.filter((f) => f != votant)
        sauce.usersDisliked = nouveauUsersDisliked
      } else if (valeurVote === 0 && req.body.like === -1) {
        sauce.dislikes += 1
        sauce.usersDisliked.push(votant)
      } else {
        console.log("tentavive de vote illégitime")
      }
      Sauce.updateOne(
        { _id: req.params.id },
        {
          likes: sauce.likes,
          dislikes: sauce.dislikes,
          usersLiked: sauce.usersLiked,
          usersDisliked: sauce.usersDisliked,
        }
      )
        .then(() => res.status(201).json({ message: "Un vote de votre part a déjà été effectué" }))
        .catch((error) => {
          if (error) {
            console.log(error)
          }
        })
    })
    .catch((error) => res.status(404).json({ error }))
}

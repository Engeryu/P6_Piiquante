const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]
    // décoder le token en vérifiant qu'il correspond avec sa clef secrète
    const decodedToken = jwt.verify(token, process.env.TOKEN_RANDOM)
    const userId = decodedToken.userId
    req.auth = { userId }
    if (req.body.userId && (req.body.userId !== userId)) {
      throw error
    } else {
      next()
    }
  } catch (error) {
    res.status(401).json({ error })
  }
}

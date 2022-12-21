const mongoose = require("mongoose")
// Mongoose est un package qui facilite les interactions avec notre base de données MongoDB.
mongoose.connect(process.env.MongoDB_USER,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'))

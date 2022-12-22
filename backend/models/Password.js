var passwordValidator = require('password-validator');
var requirement = new passwordValidator();

// le modèle du mot de passe
requirement
.is().min(8)
.is().max(20)
.has().uppercase(1)
.has().lowercase()
.has().symbols(1)
.has().digits(1)
.has().not().spaces()

module.exports = requirement;
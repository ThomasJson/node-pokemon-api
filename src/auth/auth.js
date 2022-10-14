const jwt = require("jsonwebtoken");
const privateKey = require("../auth/private_key");

// MiddleWare d'authentification
module.exports = (req, res, next) => {
  // C'est dans cette en-tête que transitera le jeton envoyé par l'user
  const authorizationHeader = req.headers.authorization;

  // On vérifie que le jeton a bien été fourni
  if (!authorizationHeader) {
    const message = `Vous n'avez pas fourni de jeton d'authentification. Ajoutez-en un dans l'en-tête de la requête.`;
    return res.status(401).json({ message });
  }

  // On recup le jeton dans une const token 
  const token = authorizationHeader.split(" ")[1];
  // authorization : Bearer <JWT>.
  // Pour extraire le jeton, il faut retirer le terme Bearer avant l'espace

  const decodedToken = jwt.verify(token, privateKey, (error, decodedToken) => {
    if (error) {
      const message = `L'utilisateur n'est pas autorisé à accèder à cette ressource.`;
      return res.status(401).json({ message, data: error });
    }

    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      const message = `L'identifiant de l'utilisateur est invalide.`;
      res.status(401).json({ message });
    } else {
        // Laisser l'utilisateur accéder au point de terminaison demandé
      next();
    }
  });
};

const { User } = require("../db/sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const privateKey = require("../auth/private_key");

module.exports = (app) => {
  app.post("/api/login", (req, res) => {
    User.findOne({ where: { username: req.body.username } })
      .then((user) => {
        if (!user) {
          const message = "Lutilisateur demandé n'existe pas";
          return res.status(404).json({ message });
        }
        // .compare est une méthode du module bcrypt
        // Compare le mp saisi par l'utilisateur avec le mp crypté en bdd
        bcrypt
          .compare(req.body.password, user.password)
          .then((isPasswordValid) => {
            if (!isPasswordValid) {
              const message = `Le mot de passe est incorrect`;
              return res.status(401).json({ message });
            }

            // JWT
            // .sign est une méthode du module jsonWebToken
            // 3 paramètres
            const token = jwt.sign({ userId: user.id }, privateKey, {
              expiresIn: "24h",
            });

            const message = `L'utilisateur a été connecté avec succès`;
            return res.json({ message, data: user, token });
          });
      })
      // Cas d'erreur générique
      .catch((error) => {
        const message = `L'utilisateur n'a pas pu être connecté. Réessayez dans quelques instants.`;
        return res.json({ message, data: error });
      });
  });
};

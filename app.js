// http://localhost:3000/api/pokemons
// http://localhost:3000/api/pokemons?limit=10

// Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY2NTczMDQ2NywiZXhwIjoxNjY1ODE2ODY3fQ.7CgLNeoXRS9JH7xyNfMTC6p9VwD95nhB0oWMGTSYIJs

// Fonction de app.js : Démarrer un serveur express
// Express : ???
const express = require("express");
// Sequelize : ORM
const sequelize = require("./src/db/sequelize");

// IMPORT Middlewares
const favicon = require("serve-favicon");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;
// En Développement, PORT vaut undefined
// Alors qu'en Production, PORT aura une valeur dynamique

// 1 MIDDLEWARE
// app.use((req, res, next ) => {
//   console.log(`URL : ${req.url}`)
//   next()
// });

// 2 MIDDLEWARES
app
  .use(favicon(__dirname + "/favicon.ico"))
  .use(bodyParser.json()); // Transforme les requêtes http en JSON

sequelize.initDb();

app.get("/", (req, res) => {
  res.json("Hello Heroku !");
});

// Points de terminaison
require("./src/routes/findAllPokemons")(app);
require("./src/routes/findPokemonByPK")(app);
require("./src/routes/createPokemon")(app);
require("./src/routes/updatePokemon")(app);
require("./src/routes/deletePokemon")(app);
require("./src/routes/login")(app);

// On ajoute la gestion des erreurs 404
app.use(({ res }) => {
  const message =
    "Impossible de se connecter à la ressource demandée ! Vous pouvez essayer une autre URL.";
  res.status(404).json({ message });
});

app.listen(port, () =>
  console.log(`Appli en cours d'éxécution sur : http://localhost:${port}`)
);

const validTypes = [
  "Plante",
  "Poison",
  "Feu",
  "Insecte",
  "Vol",
  "Normal",
  "Electrik",
  "Fée",
  "Normal",
  "Eau"
];

module.exports = (sequelize, DataTypes) => {
  // Cette fonction prend 2 paramètres, Cet objet représente la connexion à la bdd
  // Cet objet a la propriété define, qui permet de créer un nouveau modèle

  // DataTypes permet de définir le type de données de chaque propriété du modèle
  return sequelize.define(
    "Pokemon",
    {
      // .define prend 3 paramètres pour créer un nouveau modèle
      // 1/ Le nom du modèle
      // 2/ Description du modèle
      // 3/ Option de paramètrage global
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "Le nom est déjà pris"
        },
        // allowNull est à la fois un validateur JS
        // A la fois une contrainte côté SQL, lors de la génération
        // De la BDD
        validate: {
          notNull: { msg: "Le nom d'un pokémon est une propriété requise." },
          notEmpty: { msg: "Le nom du pokémon ne doit pas être vide." },
        },
      },
      hp: {
        type: DataTypes.INTEGER,
        allowNull: false,

        validate: {
          // Min, Max : validateurs Métiers
          min: {
            args: [0],
            msg: "Le minimum autorisé est 0",
          },
          max: {
            args: [999],
            msg: "Le maximum autorisé est 999",
          },
          isInt: {
            msg: "Utilisez uniquement des nombres entiers pour les hp.",
          },
          notNull: { msg: "Les hp sont une propriété requise." },
        },
      },
      cp: {
        type: DataTypes.INTEGER,
        allowNull: false,

        validate: {
          min: {
            args: [0],
            msg: "Le minimum autorisé est 0",
          },
          max: {
            args: [999],
            msg: "Le maximum autorisé est 999",
          },
          isInt: {
            msg: "Utilisez uniquement des nombres entiers pour les cp.",
          },
          notNull: { msg: "Les cp sont une propriété requise." },
        },
      },
      picture: {
        type: DataTypes.STRING,
        allowNull: false,

        validate: {
          isUrl: { msg: "L'URL de l'image doit être valide." },
          notNull: { msg: "L'image d'un pokémon est une propriété requise." },
        },
      },
      types: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
          // Getter : Base de données -> API REST
          return this.getDataValue("types").split(",");
          // "Poison, Plante".split(',') = ["Poison", "Plante"]
        },
        set(types) {
          // Setter : API REST -> Bdd
          this.setDataValue("types", types.join());
          // ["Plante", "Poison"].join() = "Plante, Poison"
        },
        validate: {
          // Validateur personnalisé
          isTypesValid(value) {
            if (!value) {
              throw new Error("Un pokémon doit avoir au moins un type");
            }
            if (value.split(",").length > 3) {
              throw new Error("Un pokémon ne peut pas avoir plus de 3 types");
            }
            value.split(",").forEach((type) => {
              if (!validTypes.includes(type)) {
                throw new Error(
                  `Le type d'un pokémon doit appartenir à la liste suivante : ${validTypes}`
                );
              }
            });
          },
        },
      },
    },
    {
      timestamps: true,
      createdAt: "created",
      updatedAt: false,
    }
  );
};

import mongoose from "mongoose";
import bcrypt from "bcryptjs"; // Ajout de bcryptjs pour hacher et vérifier les mots de passe

// Définition du schéma utilisateur
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    region: { type: String, required: false },
    role: {
      type: String,
      enum: [
        "admin",
        "user",
        "superviseur",
        "achat",
        "docteurs",
        "directeur",
        "coordinateur",
        "chargé de stock",
      ], // Les rôles possibles
      default: "user",
    },
    province: {
      type: String,
      required: true, // Marquer comme obligatoire si chaque utilisateur doit avoir une province
      trim: true,
    },
    site: {
      type: String,
      required: false, // Marquer comme obligatoire si chaque utilisateur doit avoir un site
      trim: true,
    },
    soldeConges: {
      type: Number,
      default: 18, // Initialiser avec 18 jours
    },
    derniereMiseAJourConges: {
      type: Date,
      default: new Date(), // Date de la dernière mise à jour du solde
    },
    historiqueConges: [
      {
        date: {
          type: Date,
          required: false, // Date à laquelle l'événement a eu lieu
          default: new Date(),
        },
        type: {
          type: String,
          enum: ["ajout", "retrait"], // Type d'opération (ajout de jours ou retrait de jours)
          required: false,
        },
        jours: {
          type: Number,
          required: false, // Nombre de jours ajoutés ou retirés
        },
        commentaire: {
          type: String, // Optionnel : commentaire ou raison
          trim: false,
        },
      },
    ],

    nomComplet: {
      type: String,
      required: true, // Marquer comme obligatoire ou non en fonction de vos besoins
      trim: true,
    },
    actifIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Actif", // Référence au modèle Actif
      },
    ],
  },
  {
    timestamps: true, // Ajoute createdAt et updatedAt
  }
);

// Middleware pour hasher le mot de passe avant de sauvegarder
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     return next();
//   }

//   // Générer un sel unique pour chaque utilisateur
//   const salt = await bcrypt.genSalt(10); // 10 est le facteur de coût
//   this.password = await bcrypt.hash(this.password, salt); // Hacher le mot de passe avec le sel
//   next();
// });

// Méthode pour ajouter 18 jours de congés au début de chaque année

// Comparaison du mot de passe
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password); // Comparer le mot de passe envoyé avec celui haché
};

// Exportation du modèle
const User = mongoose.model("User", userSchema);

export default User;

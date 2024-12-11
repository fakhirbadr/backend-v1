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
    role: {
      type: String,
      enum: ["admin", "user"], // Les rôles possibles
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

// Comparaison du mot de passe
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password); // Comparer le mot de passe envoyé avec celui haché
};

// Exportation du modèle
const User = mongoose.model("User", userSchema);

export default User;

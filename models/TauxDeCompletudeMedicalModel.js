import mongoose from "mongoose";

// Définition du schéma pour TauxDeCompletudeMedical
const TauxDeCompletudeMedical = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true, // Le champ 'date' est important, donc il est requis
    },
    region: {
      type: String,
      required: true, // Le champ 'region' est important, donc il est requis
    },
    province: {
      type: String,
      required: true, // Le champ 'province' est important, donc il est requis
    },
    unite: {
      type: String,
      required: true, // Le champ 'unite' est important, donc il est requis
    },
    tauxCompletudeMedical: {
      type: Number, // Utilisation du type 'Number' pour une meilleure gestion des calculs
      required: true, // Le taux est requis
      min: 0, // Validation que le taux ne soit pas négatif
      max: 100, // Validation que le taux ne dépasse pas 100
    },
  },
  { timestamps: true } // Inclut les champs 'createdAt' et 'updatedAt' automatiquement
);

// Modèle pour interagir avec la collection de la base de données
const tauxCompletude = mongoose.model(
  "tauxCompletude", // Nom du modèle
  TauxDeCompletudeMedical // Schéma
);

export default tauxCompletude;

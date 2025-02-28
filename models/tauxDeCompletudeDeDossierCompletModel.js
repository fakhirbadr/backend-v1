import mongoose from "mongoose";

const TauxDeCompletudeDeDossierCompletSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: false,
    },
    region: {
      type: String,
      required: false,
    },
    province: {
      type: String,
      required: false,
    },
    unite: {
      type: String,
      required: false,
    },
    TauxDeCompletudeDeDossierComplet: {
      type: Number, // Supposons que c'est un pourcentage
      required: false,
    },
  },
  { timestamps: true } // Active automatiquement `createdAt` et `updatedAt`
);

const TauxDeCompletudeDeDossierComplet = mongoose.model(
  "TauxDeCompletudeDeDossierComplet",
  TauxDeCompletudeDeDossierCompletSchema
);
export default TauxDeCompletudeDeDossierComplet;

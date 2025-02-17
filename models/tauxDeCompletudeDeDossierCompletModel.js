import mongoose from "mongoose";

const TauxDeCompletudeDeDossierCompletSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: false,
    },
    region: {
      type: String,
      required: true,
    },
    province: {
      type: String,
      required: true,
    },
    unite: {
      type: String,
      required: true,
    },
    TauxDeCompletudeDeDossierComplet: {
      type: Number, // Supposons que c'est un pourcentage
      required: true,
    },
  },
  { timestamps: true } // Active automatiquement `createdAt` et `updatedAt`
);

const TauxDeCompletudeDeDossierComplet = mongoose.model(
  "TauxDeCompletudeDeDossierComplet",
  TauxDeCompletudeDeDossierCompletSchema
);
export default TauxDeCompletudeDeDossierComplet;

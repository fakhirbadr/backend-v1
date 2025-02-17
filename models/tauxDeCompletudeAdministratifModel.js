import mongoose from "mongoose";

const TauxDeCompletudeAdministratifSchema = new mongoose.Schema(
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
    tauxCompletudeAdministratif: {
      type: Number, // Supposons que c'est un pourcentage
      required: true,
    },
  },
  { timestamps: true } // Active automatiquement `createdAt` et `updatedAt`
);

const TauxDeCompletudeAdministratif = mongoose.model(
  "TauxDeCompletudeAdministratif",
  TauxDeCompletudeAdministratifSchema
);

export default TauxDeCompletudeAdministratif;

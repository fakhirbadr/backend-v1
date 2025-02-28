import mongoose from "mongoose";

const TauxDeCompletudeAdministratifSchema = new mongoose.Schema(
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
    tauxCompletudeAdministratif: {
      type: Number, // Supposons que c'est un pourcentage
      required: false,
    },
  },
  { timestamps: true } // Active automatiquement `createdAt` et `updatedAt`
);

const TauxDeCompletudeAdministratif = mongoose.model(
  "TauxDeCompletudeAdministratif",
  TauxDeCompletudeAdministratifSchema
);

export default TauxDeCompletudeAdministratif;

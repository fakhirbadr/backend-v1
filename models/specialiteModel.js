import mongoose from "mongoose";

// Schéma pour SPECIALITE

const Specialite = new mongoose.Schema(
  {
    date: {
      type: String,
      required: false, // Le champ 'date' est important, donc il est requis
    },
    region: {
      type: String,
      required: false, // Le champ 'region' est important, donc il est requis
    },
    province: {
      type: String,
      required: false, // Le champ 'province' est important, donc il est requis
    },
    unite: {
      type: String,
      required: false, // Le champ 'unite' est important, donc il est requis
    },
    specialite: { type: String, required: false },
    plateau: {
      type: String,
      required: false,
    },
    NomdDuMedecinSpecialiste: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const tauxSpecialite = mongoose.model("tauxSpecialite", Specialite);
export default tauxSpecialite;

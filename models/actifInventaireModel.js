import mongoose from "mongoose";

const actifInventaireSchema = new mongoose.Schema({
  technicien: { type: String, required: true },
  selectedUnite: { type: String, required: true },
  date: { type: Date, required: true },
  validation: { type: Boolean, default: false },
  equipment: {
    type: Map,
    of: {
      quantite: { type: Number, required: false },
      fonctionnel: { type: String, required: false }, // "Oui" ou "Non"
    },
    required: true,
  },
  createdAt: { type: Date, default: Date.now }, // Date de création (utilise la date actuelle par défaut)
});

const ActifInventaire = mongoose.model(
  "ActifInventaire",
  actifInventaireSchema
);

export default ActifInventaire;

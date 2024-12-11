import mongoose from "mongoose";

const FournitureSchema = new mongoose.Schema({
  name: { type: String, required: false }, // Replacing 'ummc' with 'name'
  categorie: { type: String, required: false },
  besoin: { type: String, required: false },
  quantite: { type: Number, required: false },
  technicien: { type: String, required: false }, // Nouveau champ pour le technicien
  dateCreation: { type: Date, default: Date.now }, // Auto-generate the creation date
  commentaire: { type: String, required: false },

  isClosed: { type: Boolean, default: false }, // Valeur par défaut à false
  status: { type: String, required: false, default: "créé" },
  dateCloture: { type: Date, default: null }, // Date de clôture, initialisée à null
});

const TicketFourniture = mongoose.model("TicketFourniture", FournitureSchema);
export default TicketFourniture;

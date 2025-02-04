import mongoose from "mongoose";

const reclamation = new mongoose.Schema({
  user: { type: String },
  site: { type: String },
  region: { type: String },
  province: { type: String },
  typeReclamation: { type: String },
  commentaire: { type: String },
  etatReclamation: { type: Boolean },
  commentaireResponsable: { type: String, required: true },
  dateReclamation: { type: Date, default: Date.now }, // Default to the current date
  dateFermetureTicket: { type: Date }, // Optional, can be set when the ticket is closed
});

export default mongoose.model("Reclamation", reclamation);

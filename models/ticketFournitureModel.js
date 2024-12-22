import mongoose from "mongoose";

const FournitureSchema = new mongoose.Schema({
  name: { type: String, required: false }, // Replacing 'ummc' with 'name'
  categorie: { type: String, required: false },
  province: { type: String, required: false },
  region: { type: String, require: false },
  besoin: { type: String, required: false },
  quantite: { type: Number, required: false },
  technicien: { type: String, required: false }, // Nouveau champ pour le technicien
  dateCreation: { type: Date, default: Date.now }, // Auto-generate the creation date
  commentaire: { type: String, required: false },

  isClosed: { type: Boolean, default: false }, // Valeur par défaut à false
  status: { type: String, required: false, default: "créé" },
  dateCloture: { type: Date, default: null }, // Date de clôture, initialisée à null
});
FournitureSchema.virtual("tempsDeResolutionDetaille").get(function () {
  if (this.dateCloture) {
    const diff = this.dateCloture - this.dateCreation; // Différence en millisecondes

    const jours = Math.floor(diff / (1000 * 60 * 60 * 24));
    const heures = Math.floor(
      (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${jours}j ${heures}h ${minutes}m`;
  }
  return "Non clôturé";
});
FournitureSchema.set("toJSON", { virtuals: true });
FournitureSchema.set("toObject", { virtuals: true });
const TicketFourniture = mongoose.model("TicketFourniture", FournitureSchema);
export default TicketFourniture;

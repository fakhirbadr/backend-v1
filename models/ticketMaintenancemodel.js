import mongoose from "mongoose";

// Définir le schéma pour le ticket de maintenance
const ticketMaintenanceSchema = new mongoose.Schema(
  {
    name: { type: String, required: false },
    site: { type: String, required: false },
    province: { type: String, required: false },
    technicien: { type: String, required: false },
    categorie: {
      type: String,
      required: false,
    },
    description: { type: String, required: false },
    equipement_deficitaire: { type: String, required: false },
    urgence: {
      type: String,
      required: false,
      enum: ["faible", "moyenne", "élevée"],
    },
    commentaire: { type: String, required: false },

    photos: [{ type: String }],
    isClosed: { type: Boolean, default: false }, // Valeur par défaut à false
    dateCloture: { type: Date, default: null }, // Date de clôture, initialisée à null
    selectedActifId: { type: String, required: false },
    selectedCategoryId: { type: String, required: false },
    selectedEquipmentId: { type: String, required: false },
    cloturerPar: { type: String, required: false, default: "" },
  },

  { timestamps: true }
);
ticketMaintenanceSchema.virtual("tempsDeResolutionDetaille").get(function () {
  if (this.dateCloture) {
    const diff = this.dateCloture - this.createdAt; // Différence en millisecondes

    const jours = Math.floor(diff / (1000 * 60 * 60 * 24));
    const heures = Math.floor(
      (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${jours}j ${heures}h ${minutes}m`;
  }
  return "Non clôturé";
});
ticketMaintenanceSchema.set("toJSON", { virtuals: true });
ticketMaintenanceSchema.set("toObject", { virtuals: true });
const TicketMaintenance = mongoose.model(
  "TicketMaintenance",
  ticketMaintenanceSchema
);

export default TicketMaintenance;

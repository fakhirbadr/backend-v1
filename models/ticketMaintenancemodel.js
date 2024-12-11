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
  },

  { timestamps: true }
);

const TicketMaintenance = mongoose.model(
  "TicketMaintenance",
  ticketMaintenanceSchema
);

export default TicketMaintenance;

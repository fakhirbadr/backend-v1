import mongoose from "mongoose";

// Schéma pour un sous-ticket
const subTicketSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Nom du sous-ticket
    site: { type: String, required: false },
    province: { type: String, required: false },
    region: { type: String, require: false },
    technicien: { type: String, required: false },
    categorie: {
      type: String,
      required: false,
    },
    description: { type: String, required: false },
    quantite: { type: Number, required: false },
    status: { type: String, default: "créé" },

    equipement_deficitaire: { type: String, required: false },
    isClosed: { type: Boolean, default: false }, // État de clôture
    commentaire: { type: String, required: false }, // Optionnel : commentaire
  },
  { timestamps: true } // Ajoute createdAt et updatedAt
);

// Définir le schéma pour le ticket de maintenance
const ticketMaintenanceSchema = new mongoose.Schema(
  {
    name: { type: String, required: false },
    site: { type: String, required: false },
    province: { type: String, required: false },
    region: { type: String, require: false },
    technicien: { type: String, required: false },
    categorie: {
      type: String,
      required: false,
    },
    description: { type: String, required: false },
    equipement_deficitaire: { type: String, required: false },
    dateCloture: { type: Date, default: null }, // Date de clôture, initialisée à null
    cloturerPar: { type: String, required: false, default: "" },

    urgence: {
      type: String,
      required: false,
      enum: ["faible", "moyenne", "élevée"],
    },
    commentaire: { type: String, required: false },

    photos: [{ type: String }],
    isClosed: { type: Boolean, default: false }, // Valeur par défaut à false
    isVisible: { type: Boolean, default: true }, // Champ ajouté pour gérer la visibilité

    dateCloture: { type: Date, default: null }, // Date de clôture, initialisée à null
    selectedActifId: { type: String, required: false },
    selectedCategoryId: { type: String, required: false },
    selectedEquipmentId: { type: String, required: false },
    cloturerPar: { type: String, required: false, default: "" },
    isDeleted: { type: Boolean, default: false },
    deletedBy: { type: String },
    // Ajout des sous-tickets
    subTickets: [subTicketSchema], // Tableau de sous-tickets
  },

  { timestamps: true }
);
// Middleware pour vérifier la clôture automatique du ticket principal
// ticketMaintenanceSchema.pre("save", function (next) {
//   // Si subTickets est undefined ou null, on le remplace par un tableau vide
//   if (!Array.isArray(this.subTickets)) {
//     this.subTickets = [];
//   }

//   // Log pour vérifier si les sous-tickets existent et leur état
//   console.log("SubTickets:", this.subTickets);

//   const allSubTicketsClosed = this.subTickets.every(
//     (subTicket) => subTicket.isClosed
//   );

//   // Log pour vérifier si tous les sous-tickets sont fermés
//   console.log("Tous les sous-tickets sont fermés:", allSubTicketsClosed);

//   // Si tous les sous-tickets sont fermés, on ferme le ticket principal
//   if (allSubTicketsClosed) {
//     this.isClosed = true; // Ferme le ticket principal
//     this.dateCloture = new Date(); // Définit la date de clôture
//     console.log("Ticket principal fermé");
//   } else {
//     this.isClosed = false; // Laisse le ticket ouvert si un sous-ticket est rouvert
//     this.dateCloture = null;
//     console.log("Ticket principal ouvert");
//   }

//   next();
// });
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

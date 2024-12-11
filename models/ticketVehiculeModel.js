import mongoose from "mongoose";

const ticketVehiculeSchema = new mongoose.Schema(
  {
    name: { type: String, required: false },
    province: { type: String, required: false },
    technicien: { type: String, required: false },
    categorie: {
      type: String,
      required: false,
    },
    commande: { type: String, require: false },
    marque: { type: String, require: false },
    description: { type: String, required: false },
    immatriculation: { type: String, required: false },

    urgence: {
      type: String,
      required: false,
    },
    status: { type: String, default: "créé", required: false },
    isClosed: { type: Boolean, default: false, required: true }, // Valeur par défaut à false
    dateCloture: { type: Date, default: null }, // Date de clôture, initialisée à null
    commentaire: { type: String, required: false },
  },
  { timestamps: true }
);

const TicketVehicule = mongoose.model("ticketVehicule", ticketVehiculeSchema);

export default TicketVehicule;

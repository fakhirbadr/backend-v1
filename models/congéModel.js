import mongoose from "mongoose";

// Définir le schéma pour chaque absence dans l'historique
const HistoriqueSchema = new mongoose.Schema({
  dateDebut: {
    type: Date,
    required: false,
  },
  dateFin: {
    type: Date,
    required: false,
  },
  typeAbsence: {
    type: String,
    required: false,
  },
  justification: {
    type: String,
    required: false, // Peut être vide pour certaines absences non justifiées
  },
  isValidated: {
    type: Boolean,
    required: false,
    default: false, // Par défaut, l'absence n'est pas validée
  },
  isValidatedRh: {
    type: Boolean,
    required: false,
    default: false,
  },
  nombreJours: {
    type: Number,
    required: true,
    default: function () {
      if (this.isValidated && this.isValidatedRh) {
        // Vérifier si les deux sont validés
        const diffTime = Math.abs(this.dateFin - this.dateDebut);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 pour inclure le jour de début et de fin
      }
      return 0; // Sinon, 0 jours
    },
  },
});

// Définir le schéma principal pour l'utilisateur
const AbsenceSchema = new mongoose.Schema({
  nomComplet: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    required: false,
  },
  province: {
    type: String,
    required: false,
  },
  historique: [HistoriqueSchema], // Tableau des absences
});

// Créer le modèle
const Absence = mongoose.model("Absence", AbsenceSchema);

export default Absence;

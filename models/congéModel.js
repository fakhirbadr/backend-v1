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
    required: false,
  },
  isValidated: {
    type: Boolean,
    required: false,
    default: false,
  },
  isValidatedRh: {
    type: Boolean,
    required: false,
    default: false,
  },
  nombreJours: {
    type: Number,
    required: true,
    default: 0, // Par défaut, 0 jours
  },
});

// Middleware pour recalculer nombreJours avant chaque sauvegarde
HistoriqueSchema.pre("save", function (next) {
  if (this.isValidated && this.dateDebut && this.dateFin) {
    const diffTime = Math.abs(this.dateFin - this.dateDebut);
    this.nombreJours = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 pour inclure le jour de début et de fin
  } else {
    this.nombreJours = 0; // Si non validé, 0 jours
  }
  next();
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
  cle: {
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

import mongoose from "mongoose";

const testSpeedNetworkSchema = mongoose.Schema({
  user: { type: String, required: true },
  unite: { type: String },
  region: { type: String },
  province: { type: String },
  date: { type: Date, default: Date.now }, // Utilisation de la date actuelle par défaut
  heure: { type: Date }, // Si vous voulez seulement l'heure, vous pourriez ajuster le type
  download: { type: Number }, // Si c'est une valeur numérique
  upload: { type: Number }, // Si c'est une valeur numérique
  idUser: { type: String },
  nomComplet: { type: String },
  testHoraire: { type: String },
  patientsWaiting: { type: Number },
});

const TestSpeedNetwork = mongoose.model(
  "TestSpeedNetwork",
  testSpeedNetworkSchema
);

export default TestSpeedNetwork;

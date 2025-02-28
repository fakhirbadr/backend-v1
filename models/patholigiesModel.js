import mongoose from "mongoose";

const PathologieSchema = new mongoose.Schema({
  date: {
    type: String,
    required: false,
  },
  region: {
    type: String,
    required: true,
  },
  province: {
    type: String,
    required: true,
  },
  unite: {
    type: String,
    required: true,
  },
 
  HTA: { type: Number },
  SuiviDeGrossesse: { type: Number },
  Lombalgies: { type: Number },
  Arthrose: { type: Number },
  RGO: { type: Number },
  Amygdalite: { type: Number },
  Goitre: { type: Number },
  Pharyngite: { type: Number },
  Bronchite: { type: Number },
  Conjonctivite: { type: Number },
  Grippe: { type: Number },
  Dysthyroidie: { type: Number },
  Angines: { type: Number },
});

const Pathologie = mongoose.model("Pathologie", PathologieSchema);

export default Pathologie;

import mongoose from "mongoose";

const EquipmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  isFunctionel: { type: Boolean, default: true }, // Nom de l'équipement
  description: { type: String }, // Description facultative
});

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true }, // Nom de la catégorie
  equipments: [EquipmentSchema], // Liste des équipements
});

const ActifSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Nom de l'actif
  region: { type: String, required: true }, // Nom de la région
  categories: [CategorySchema], // Liste des catégories
});

const Actif = mongoose.model("Actif", ActifSchema);

export default Actif;

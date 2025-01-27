import mongoose from "mongoose";

const ummcperformanceSchema = new mongoose.Schema(
  {
    date: { type: String, required: false }, // Date de la prise en charge
    region: { type: String, required: false }, // Région
    province: { type: String, required: false }, // Province
    unite: { type: String, required: false }, // Unité
    totalPriseEnCharge: { type: Number, required: false }, // Total Prise en Charge
    effectifTotalOperationnel: { type: Number, required: false }, // Effectif Total Opérationnel
    totalUMMCInstallees: { type: Number, required: false }, // Total des UMMC Installées
    ageGroup0to6: { type: Number, required: false }, // Age group 0 to 6 years
    ageGroup7to14: { type: Number, required: false }, // Age group 7 to 14 years
    ageGroup15to24: { type: Number, required: false }, // Age group 15 to 24 years
    ageGroup25to64: { type: Number, required: false }, // Age group 25 to 64 years
  },
  { timestamps: true }
);

const ummcperformance = mongoose.model(
  "ummcperformance",
  ummcperformanceSchema
);
export default ummcperformance;

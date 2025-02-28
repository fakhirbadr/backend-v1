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
    ConsultationMedcineGenerale: { type: Number, required: false },
    Teleexpertises: { type: Number, required: false },
    Referencement: { type: Number, required: false },
    Evacuation: { type: Number, required: false },
    DepistageDiabete: { type: Number, required: false },
    DepistageHTA: { type: Number, required: false },
    ageGroup0to6: { type: Number, required: false }, // Age group 0 to 6 years
    ageGroup7to14: { type: Number, required: false }, // Age group 7 to 14 years
    ageGroup15to24: { type: Number, required: false }, // Age group 15 to 24 years
    ageGroup25to64: { type: Number, required: false }, // Age group 25 to 64 years
    ageGroup65to100: { type: Number, required: false },
    Consultation: { type: Number, required: false },
    soins: { type: Number, required: false },
    Vaccination: { type: Number, required: false },

    DepistageCancerDuSein: { type: Number, required: false },
    DepistageDuCancerDuCol: { type: Number, required: false },
    TestCovid19Positif: { type: Number, required: false },
    TestCovid19Negatif: { type: Number, required: false },
    CasDeRougeole: { type: Number, required: false },
    Oreillon: { type: Number, required: false },
    SuiviDeGrossesse: { type: Number, required: false },
    GrossesseARisque: { type: Number, required: false },
    Femme: { type: Number, required: false },
    Homme: { type: Number, required: false },
    Transfert: { type: Number, required: false },
    Urgence: { type: Number, required: false },
    PathologieFrequente1: { type: String, required: false },
    PathologieFrequente2: { type: String, required: false },
    PathologieFrequente3: { type: String, required: false },
    PathologieFrequente4: { type: String, required: false },
    PathologieFrequente5: { type: String, required: false },
  },
  { timestamps: true }
);

const ummcperformance = mongoose.model(
  "ummcperformance",
  ummcperformanceSchema
);
export default ummcperformance;

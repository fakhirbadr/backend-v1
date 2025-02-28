import mongoose from "mongoose";

const TauxDeCompletudeDesPrescriptionsSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: false,
    },
    region: {
      type: String,
      required: false,
    },
    province: {
      type: String,
      required: false,
    },
    unite: {
      type: String,
      required: false,
    },
    TauxDeCompletudeDesPrescriptions: {
      type: Number,
      required: false,
    },
  },
  { timestamps: true }
);

const TauxDeCompletudeDesPrescriptions = mongoose.model(
  "TauxDeCompletudeDesPrescriptions",
  TauxDeCompletudeDesPrescriptionsSchema
);
export default TauxDeCompletudeDesPrescriptions;

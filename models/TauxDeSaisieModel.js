import mongoose from "mongoose";

const TauxDeSaisieSchema = new mongoose.Schema(
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
    TauxDeSaisie: {
      type: Number,
      required: false,
    },
  },
  { timestamps: true }
);

const TauxDeSaisie = mongoose.model("TauxDeSaisie", TauxDeSaisieSchema);

export default TauxDeSaisie;

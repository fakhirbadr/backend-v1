import mongoose from "mongoose";

const stocksSchema = new mongoose.Schema({
  name: { type: String },
  categorie: { type: String },
  quantity: { type: Number, default: 0 },
  date_entre: { type: String },
  emplacement: { type: String },
  etat: { type: String },
  referance: { type: String },
  responsable: { type: String },
  compatibility: { type: String, default: "-" },
  observations: { type: String },
});

const Stocks = mongoose.model("Stocks", stocksSchema);

export default Stocks;

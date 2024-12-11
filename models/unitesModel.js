// models/uniteModel.js
import mongoose from "mongoose";

const uniteSchema = new mongoose.Schema({
  etat: {
    type: Boolean,
    required: [false, "Unité must have a state"],
  },
  name: {
    type: String,
    required: [false, "Unité must have a name"],
    unique: true,
  },
  region: {
    type: String,
    trim: true,
  },
  province: {
    type: String,
    trim: true,
  },
  coordinateur: {
    type: String,
    trim: true,
  },
  chargeSuivi: {
    type: String,
    trim: true,
  },
  technicien: {
    type: String,
    trim: true,
  },
  docteur: {
    type: String,
    trim: true,
  },
  mail: {
    type: String,
    trim: true,
    validate: {
      validator: function (v) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
      },
      message: "Please enter a valid email",
    },
  },
  num: {
    type: String,
    trim: true,
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v); // Example for 10-digit phone numbers
      },
      message: "Please enter a valid phone number",
    },
  },
  lat: {
    type: Number,
    min: -90,
    max: 90,
  },
  long: {
    type: Number,
    min: -180,
    max: 180,
  },
});

const Unite = mongoose.model("Unite", uniteSchema);

export default Unite;

import mongoose from "mongoose";

const ummcInactive = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: false,
      get: (value) => {
        if (!value) return null;
        return value.toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric", // Année complète (yyyy)
        });
      },
    },
    unite: { type: String, required: false },
    region: { type: String, required: false },
    province: {
      type: String,
      required: false,
    },
    technicien: {
      type: String,
      required: false,
    },
    raison: {
      type: String,
      required: false,
    },
    CloseAt: {
      type: String,
      required: false,
      match: /^([01]\d|2[0-3]):([0-5]\d)$/,
    }, // Format 24h HH:mm
    CloseTo: {
      type: String,
      required: false,
      match: /^([01]\d|2[0-3]):([0-5]\d)$/,
    }, // Format 24h HH:mm
  },
  { timestamps: true }
);

const InactiveUmmc = mongoose.model("InactiveUmmc", ummcInactive);
export default InactiveUmmc;

import mongoose from "mongoose";

const connectionHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assurez-vous que "User" est le nom de votre modèle utilisateur
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    ipAddress: {
      type: String,
      default: "Unknown",
    },
    loginTime: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true } // Inclut createdAt et updatedAt
);

const ConnectionHistory = mongoose.model(
  "ConnectionHistory",
  connectionHistorySchema
);
export default ConnectionHistory;

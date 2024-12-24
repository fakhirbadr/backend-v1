import express from "express";

import {
  recordConnection,
  getConnectionHistory,
} from "../controllers/connectionHistoryController.js";
import router from "./ticketVehicule.js";

// Route pour enregistrer une connexion (utilisée lors de la connexion)
router.post("/record", recordConnection);

// Route pour récupérer l'historique des connexions
router.get("/", getConnectionHistory);

export default router;

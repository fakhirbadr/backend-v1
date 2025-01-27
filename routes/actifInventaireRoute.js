import express from "express";
import {
  getAllActifsInventaire,
  createActifInventaire,
  updateActifInventaire, // Make sure this function is exported from your controller
} from "../controllers/actifInventaireController.js";

const router = express.Router();

// Route pour récupérer tous les inventaires
router.get("/actifsInventaire", getAllActifsInventaire);

// Route pour créer un inventaire d'actifs
router.post("/actifsInventaire", createActifInventaire);

// Route pour mettre à jour un inventaire d'actifs (PATCH)
router.patch("/actifsInventaire/:id", updateActifInventaire); // Add this route

export default router;

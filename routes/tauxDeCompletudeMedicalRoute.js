import express from "express";
import {
  getAllTauxCompletude,
  creatTauxCompletude,
} from "../controllers/tauxDeCompletudeMedicalController.js";
const router = express.Router();

// Définition des routes
router.get("/", getAllTauxCompletude);
router.post("/", creatTauxCompletude);

export default router;

import express from "express";

import {
  getAllTauxDeCompletudeDeDossierComplet,
  createTauxDeCompletudeDeDossierComplet,
} from "../controllers/tauxDeCompletudeDeDossierCompletController.js";
const router = express.Router();

router.get("/", getAllTauxDeCompletudeDeDossierComplet);
router.post("/", createTauxDeCompletudeDeDossierComplet);

export default router;

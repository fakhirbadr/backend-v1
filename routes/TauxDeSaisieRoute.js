import express from "express";

import {
  getAllTauxDeSaisie,
  createTauxDeSaisie,
} from "../controllers/TauxDeSaisieController.js";
const router = express.Router();

router.get("/", getAllTauxDeSaisie);
router.post("/", createTauxDeSaisie);

export default router;

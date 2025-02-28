import express from "express";

import {
  createTauxDeCompletudeDesPrescriptions,
  getAllTauxDeCompletudeDesPrescriptions,
} from "../controllers/TauxDeCompletudeDesPrescriptionsController.js";
const router = express.Router();

router.get("/", getAllTauxDeCompletudeDesPrescriptions);
router.post("/", createTauxDeCompletudeDesPrescriptions);

export default router;

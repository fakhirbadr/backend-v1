import express from "express";

import {
  getAllTauxDeCompletudeAdministratif,
  createTauxDeCompletudeAdministratif,
} from "../controllers/tauxDeCompletudeAdministratif.js";
const router = express.Router();

router.get("/", getAllTauxDeCompletudeAdministratif);
router.post("/", createTauxDeCompletudeAdministratif);

export default router;

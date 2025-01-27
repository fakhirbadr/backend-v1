import express from "express";
import {
  getAllAbsences,
  getAbsenceById,
  createAbsence,
  updateAbsence,
} from "../controllers/congéController.js";

const router = express.Router();

// Route pour récupérer toutes les absences
router.get("/", getAllAbsences);

// Route pour récupérer une absence par ID
router.get("/:id", getAbsenceById);

// Route pour ajouter une nouvelle absence
router.post("/", createAbsence);

// Route pour mettre à jour une absence par ID (PATCH)
router.patch("/:id", updateAbsence);

export default router;
